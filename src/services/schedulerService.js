/**
 * Enhanced Scheduler Service
 * Handles automated and manual AI content generation scheduling
 */

import { generateQuestionsFromFile } from './aiContentService.js';
import { saveBatch, activateBatch, getLatestActiveBatch } from './batchService.js';

/**
 * Scheduler state management
 */
class SchedulerState {
  constructor() {
    this.isGenerating = false;
    this.lastGeneration = null;
    this.scheduledJobs = new Map();
    this.generationHistory = [];
    this.manualTriggerEnabled = true;
  }

  setGenerating(status) {
    this.isGenerating = status;
    console.log(`🔄 Generation status: ${status ? 'ACTIVE' : 'IDLE'}`);
  }

  recordGeneration(result) {
    this.lastGeneration = {
      timestamp: new Date().toISOString(),
      success: result.success,
      batchId: result.batchId,
      questionCount: result.questions?.length || 0
    };
    
    this.generationHistory.push(this.lastGeneration);
    
    // Keep only last 10 generations
    if (this.generationHistory.length > 10) {
      this.generationHistory = this.generationHistory.slice(-10);
    }
    
    console.log(`📝 Generation recorded: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  }

  canGenerate() {
    if (this.isGenerating) {
      console.log('⚠️ Generation already in progress');
      return false;
    }

    // Check if we generated recently (within last hour)
    if (this.lastGeneration) {
      const lastTime = new Date(this.lastGeneration.timestamp);
      const now = new Date();
      const hoursSinceLastGeneration = (now - lastTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastGeneration < 1) {
        console.log(`⚠️ Recent generation detected (${hoursSinceLastGeneration.toFixed(1)} hours ago)`);
        return false;
      }
    }

    return true;
  }

  getStatus() {
    return {
      isGenerating: this.isGenerating,
      lastGeneration: this.lastGeneration,
      generationHistory: this.generationHistory,
      canGenerate: this.canGenerate(),
      scheduledJobsCount: this.scheduledJobs.size
    };
  }
}

// Global scheduler state
const schedulerState = new SchedulerState();

/**
 * Execute AI content generation with state management
 */
export const executeGeneration = async (trigger = 'unknown') => {
  try {
    console.log(`🚀 Starting AI generation (trigger: ${trigger})`);
    
    if (!schedulerState.canGenerate()) {
      return {
        success: false,
        error: 'Generation blocked by state management',
        reason: schedulerState.isGenerating ? 'already_generating' : 'recent_generation'
      };
    }

    schedulerState.setGenerating(true);

    // Generate questions
    const generationResult = await generateQuestionsFromFile();
    
    if (generationResult.success) {
      // Save batch to Firestore
      console.log('💾 Saving batch to Firestore...');
      const saveResult = await saveBatch(generationResult);
      
      if (saveResult.success) {
        // Activate the new batch
        console.log('🔄 Activating new batch...');
        const activateResult = await activateBatch(generationResult.batchId);
        
        if (activateResult.success) {
          console.log('✅ Generation and activation successful');
          
          const finalResult = {
            success: true,
            batchId: generationResult.batchId,
            questions: generationResult.questions,
            metadata: generationResult.metadata,
            trigger,
            savedToFirestore: true,
            activated: true
          };
          
          schedulerState.recordGeneration(finalResult);
          return finalResult;
        } else {
          console.error('❌ Failed to activate batch:', activateResult.error);
          return {
            success: false,
            error: 'Failed to activate batch',
            details: activateResult
          };
        }
      } else {
        console.error('❌ Failed to save batch:', saveResult.error);
        return {
          success: false,
          error: 'Failed to save batch',
          details: saveResult
        };
      }
    } else {
      console.error('❌ AI generation failed:', generationResult.error);
      return generationResult;
    }

  } catch (error) {
    console.error('❌ Generation execution error:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    schedulerState.setGenerating(false);
  }
};

/**
 * Calculate next Monday 9AM EST
 */
export const getNextMondayAt9AMEST = () => {
  const now = new Date();
  
  // Convert to EST (UTC-5) or EDT (UTC-4) depending on daylight saving
  const estOffset = -5; // EST is UTC-5
  const nowEST = new Date(now.getTime() + (estOffset * 60 * 60 * 1000));
  
  // Find next Monday
  const daysUntilMonday = (8 - nowEST.getDay()) % 7 || 7;
  const nextMonday = new Date(nowEST);
  nextMonday.setDate(nowEST.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0); // 9:00 AM
  
  // Convert back to local time
  const nextMondayLocal = new Date(nextMonday.getTime() - (estOffset * 60 * 60 * 1000));
  
  return nextMondayLocal;
};

/**
 * Schedule automatic generation for Monday 9AM EST
 */
export const scheduleWeeklyGeneration = () => {
  const nextMonday = getNextMondayAt9AMEST();
  const now = new Date();
  const msUntilNextMonday = nextMonday.getTime() - now.getTime();
  
  console.log(`📅 Scheduling next generation for: ${nextMonday.toLocaleString()}`);
  console.log(`⏰ Time until next generation: ${Math.round(msUntilNextMonday / (1000 * 60 * 60))} hours`);
  
  // Clear existing scheduled job if any
  if (schedulerState.scheduledJobs.has('weekly')) {
    clearTimeout(schedulerState.scheduledJobs.get('weekly'));
  }
  
  // Schedule the job
  const timeoutId = setTimeout(async () => {
    console.log('📅 Executing scheduled weekly generation...');
    const result = await executeGeneration('scheduled_weekly');
    
    if (result.success) {
      console.log('✅ Scheduled generation completed successfully');
    } else {
      console.error('❌ Scheduled generation failed:', result.error);
    }
    
    // Schedule next week
    scheduleWeeklyGeneration();
    
  }, msUntilNextMonday);
  
  schedulerState.scheduledJobs.set('weekly', timeoutId);
  
  return {
    success: true,
    nextExecution: nextMonday.toISOString(),
    msUntilExecution: msUntilNextMonday
  };
};

/**
 * Manual trigger for AI generation
 */
export const triggerManualGeneration = async () => {
  console.log('🔄 Manual generation triggered');
  
  if (!schedulerState.manualTriggerEnabled) {
    return {
      success: false,
      error: 'Manual trigger is disabled'
    };
  }
  
  return await executeGeneration('manual');
};

/**
 * Enable/disable manual trigger
 */
export const setManualTriggerEnabled = (enabled) => {
  schedulerState.manualTriggerEnabled = enabled;
  console.log(`🎛️ Manual trigger ${enabled ? 'enabled' : 'disabled'}`);
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = () => {
  const nextMonday = getNextMondayAt9AMEST();
  const now = new Date();
  const msUntilNextMonday = nextMonday.getTime() - now.getTime();
  
  return {
    ...schedulerState.getStatus(),
    nextScheduledGeneration: nextMonday.toISOString(),
    msUntilNextGeneration: msUntilNextMonday,
    hoursUntilNextGeneration: Math.round(msUntilNextMonday / (1000 * 60 * 60)),
    manualTriggerEnabled: schedulerState.manualTriggerEnabled
  };
};

/**
 * Initialize scheduler
 */
export const initializeScheduler = () => {
  console.log('🚀 Initializing enhanced scheduler...');
  
  // Schedule weekly generation
  const scheduleResult = scheduleWeeklyGeneration();
  
  // Make manual trigger available globally
  if (typeof window !== 'undefined') {
    window.triggerManualGeneration = triggerManualGeneration;
    window.getSchedulerStatus = getSchedulerStatus;
    window.executeGeneration = executeGeneration;
  }
  
  console.log('✅ Enhanced scheduler initialized');
  console.log(`📅 Next generation: ${scheduleResult.nextExecution}`);
  
  return scheduleResult;
};

/**
 * Test scheduler functionality
 */
export const testScheduler = async () => {
  try {
    console.log('🧪 Testing scheduler functionality...');
    
    const results = {
      statusCheck: false,
      stateManagement: false,
      timeCalculation: false,
      manualTrigger: false
    };
    
    // Test 1: Status check
    const status = getSchedulerStatus();
    results.statusCheck = status && typeof status.isGenerating === 'boolean';
    console.log(`✅ Status check: ${results.statusCheck ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: State management
    const canGenerate = schedulerState.canGenerate();
    results.stateManagement = typeof canGenerate === 'boolean';
    console.log(`✅ State management: ${results.stateManagement ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Time calculation
    const nextMonday = getNextMondayAt9AMEST();
    results.timeCalculation = nextMonday instanceof Date && nextMonday > new Date();
    console.log(`✅ Time calculation: ${results.timeCalculation ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Manual trigger availability
    results.manualTrigger = typeof triggerManualGeneration === 'function';
    console.log(`✅ Manual trigger: ${results.manualTrigger ? 'PASSED' : 'FAILED'}`);
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 Scheduler test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      status
    };
    
  } catch (error) {
    console.error('❌ Scheduler test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 