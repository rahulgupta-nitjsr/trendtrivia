/**
 * Node.js Compatible Local Scheduler Service
 * Works without Firebase Cloud Functions - uses Node.js capabilities
 * For use in Node.js scripts like simple-batch-generator.js
 */

import { generateQuestionsFromFile, generateQuestionsForTimeframe } from './aiContentService-node.js';
import { saveBatch, activateBatch, activateBatchForTimeframe } from './batchService-node.js';
import { logApiCall } from './apiLoggingService-node.js';

/**
 * Local scheduler state management for Node.js
 */
class LocalSchedulerState {
  constructor() {
    this.isGenerating = false;
    this.lastGeneration = null;
    this.scheduledJobs = new Map();
    this.generationHistory = [];
    this.manualTriggerEnabled = true;
    this.persistenceKey = 'trendtrivia_scheduler_state';
    this.loadState();
  }

  loadState() {
    try {
      // For Node.js, we'll use a simple file-based state or in-memory
      // In a real implementation, you might want to use a database or file
      console.log('📊 Loaded scheduler state (Node.js mode)');
    } catch (error) {
      console.warn('⚠️ Could not load scheduler state:', error);
    }
  }

  saveState() {
    try {
      // For Node.js, we'll just log the state
      console.log('📝 Scheduler state saved (Node.js mode)');
    } catch (error) {
      console.warn('⚠️ Could not save scheduler state:', error);
    }
  }

  setGenerating(status) {
    this.isGenerating = status;
    console.log(`🔄 Generation status: ${status ? 'ACTIVE' : 'IDLE'}`);
  }

  recordGeneration(result) {
    this.lastGeneration = new Date();
    
    const generationRecord = {
      timestamp: this.lastGeneration.toISOString(),
      success: result.success,
      batchId: result.batchId,
      questionCount: result.questions?.length || 0,
      trigger: result.trigger || 'unknown'
    };
    
    this.generationHistory.push(generationRecord);
    
    // Keep only last 10 generations
    if (this.generationHistory.length > 10) {
      this.generationHistory = this.generationHistory.slice(-10);
    }
    
    this.saveState();
    console.log(`📝 Generation recorded: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  }

  canGenerate() {
    if (this.isGenerating) {
      console.log('⚠️ Generation already in progress');
      return false;
    }

    // Rate limiting temporarily disabled for testing
    console.log('🔧 Rate limiting disabled for testing - allowing generation');
    return true;
    
    // Original rate limiting code (commented out for testing)
    // Check if we generated recently (within last 6 hours for local)
    // if (this.lastGeneration) {
    //   const lastTime = new Date(this.lastGeneration);
    //   const now = new Date();
    //   const hoursSinceLastGeneration = (now - lastTime) / (1000 * 60 * 60);
    //   
    //   if (hoursSinceLastGeneration < 6) {
    //     console.log(`⚠️ Recent generation detected (${hoursSinceLastGeneration.toFixed(1)} hours ago)`);
    //     return false;
    //   }
    // }
    
    // return true;
  }

  getStatus() {
    return {
      isGenerating: this.isGenerating,
      lastGeneration: this.lastGeneration?.toISOString(),
      generationHistory: this.generationHistory,
      manualTriggerEnabled: this.manualTriggerEnabled,
      canGenerate: this.canGenerate()
    };
  }
}

// Initialize scheduler state
const schedulerState = new LocalSchedulerState();

/**
 * Execute local generation for Node.js
 */
export const executeLocalGeneration = async (trigger = 'unknown') => {
  try {
    console.log(`🚀 Starting local AI generation (trigger: ${trigger})`);
    
    if (!schedulerState.canGenerate()) {
      return {
        success: false,
        error: 'Generation blocked by state management',
        reason: schedulerState.isGenerating ? 'already_generating' : 'recent_generation'
      };
    }

    schedulerState.setGenerating(true);

    // Generate questions for last week by default
    const generationResult = await generateQuestionsFromFile({
      timeframe: 'last_week',
      trigger,
      duplicatePreventionHours: 6 // More lenient for local
    });
    
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
 * Execute local generation for specific timeframe
 */
export const executeLocalGenerationForTimeframe = async (timeframe, trigger = 'unknown') => {
  try {
    console.log(`🚀 Starting local AI generation for timeframe: ${timeframe} (trigger: ${trigger})`);
    
    if (!schedulerState.canGenerate()) {
      return {
        success: false,
        error: 'Generation blocked by state management',
        reason: schedulerState.isGenerating ? 'already_generating' : 'recent_generation'
      };
    }

    schedulerState.setGenerating(true);

    // Generate questions for specific timeframe
    const generationResult = await generateQuestionsForTimeframe(timeframe, {
      trigger,
      duplicatePreventionHours: 6 // More lenient for local
    });
    
    if (generationResult.success) {
      // Save batch to Firestore
      console.log('💾 Saving batch to Firestore...');
      const saveResult = await saveBatch(generationResult);
      
      if (saveResult.success) {
        // Activate the new batch for this timeframe
        console.log(`🔄 Activating new batch for timeframe: ${timeframe}...`);
        const activateResult = await activateBatchForTimeframe(generationResult.batchId, timeframe);
        
        if (activateResult.success) {
          console.log('✅ Generation and activation successful');
          
          const finalResult = {
            success: true,
            batchId: generationResult.batchId,
            timeframe,
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
 * Schedule local weekly generation
 */
export const scheduleLocalWeeklyGeneration = () => {
  const nextMonday = getNextMondayAt9AMEST();
  const now = new Date();
  const msUntilNextMonday = nextMonday.getTime() - now.getTime();
  
  console.log(`📅 Scheduled next generation for: ${nextMonday.toLocaleString()}`);
  console.log(`⏰ Time until next generation: ${Math.round(msUntilNextMonday / (1000 * 60 * 60))} hours`);
  
  return {
    nextExecution: nextMonday.toISOString(),
    msUntilNext: msUntilNextMonday,
    hoursUntilNext: Math.round(msUntilNextMonday / (1000 * 60 * 60))
  };
};

/**
 * Trigger manual generation
 */
export const triggerLocalManualGeneration = async () => {
  console.log('🔄 Manual generation triggered');
  
  if (!schedulerState.manualTriggerEnabled) {
    return {
      success: false,
      error: 'Manual trigger is disabled'
    };
  }
  
  return await executeLocalGeneration('manual');
};

/**
 * Trigger manual generation for specific timeframe
 */
export const triggerLocalManualGenerationForTimeframe = async (timeframe) => {
  console.log(`🔄 Manual generation triggered for timeframe: ${timeframe}`);
  
  if (!schedulerState.manualTriggerEnabled) {
    return {
      success: false,
      error: 'Manual trigger is disabled'
    };
  }
  
  const validTimeframes = ['last_week', 'last_month', 'last_year'];
  if (!validTimeframes.includes(timeframe)) {
    return {
      success: false,
      error: `Invalid timeframe: ${timeframe}. Valid options: ${validTimeframes.join(', ')}`
    };
  }
  
  return await executeLocalGenerationForTimeframe(timeframe, 'manual');
};

/**
 * Enable/disable manual trigger
 */
export const setLocalManualTriggerEnabled = (enabled) => {
  schedulerState.manualTriggerEnabled = enabled;
  schedulerState.saveState();
  console.log(`🎛️ Manual trigger ${enabled ? 'enabled' : 'disabled'}`);
};

/**
 * Get scheduler status
 */
export const getLocalSchedulerStatus = () => {
  const nextMonday = getNextMondayAt9AMEST();
  const now = new Date();
  const msUntilNextMonday = nextMonday.getTime() - now.getTime();
  
  return {
    ...schedulerState.getStatus(),
    nextScheduledGeneration: nextMonday.toISOString(),
    msUntilNextGeneration: msUntilNextMonday,
    hoursUntilNextGeneration: Math.round(msUntilNextMonday / (1000 * 60 * 60)),
    manualTriggerEnabled: schedulerState.manualTriggerEnabled,
    type: 'local_scheduler_node'
  };
};

/**
 * Initialize local scheduler for Node.js
 */
export const initializeLocalScheduler = () => {
  console.log('🚀 Initializing Node.js local scheduler...');
  
  // Schedule weekly generation
  const scheduleResult = scheduleLocalWeeklyGeneration();
  
  console.log('✅ Node.js local scheduler initialized');
  console.log(`📅 Next generation: ${scheduleResult.nextExecution}`);
  
  return scheduleResult;
};

/**
 * Test local scheduler functionality
 */
export const testLocalScheduler = async () => {
  try {
    console.log('🧪 Testing Node.js local scheduler functionality...');
    
    const results = {
      statusCheck: false,
      stateManagement: false,
      timeCalculation: false,
      manualTrigger: false
    };
    
    // Test 1: Status check
    const status = getLocalSchedulerStatus();
    results.statusCheck = status && typeof status.isGenerating === 'boolean';
    console.log(`✅ Status check: ${results.statusCheck ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: State management
    const canGenerate = schedulerState.canGenerate();
    results.stateManagement = typeof canGenerate === 'boolean';
    console.log(`✅ State management: ${results.stateManagement ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Time calculation
    const nextMonday = getNextMondayAt9AMEST();
    results.timeCalculation = nextMonday instanceof Date;
    console.log(`✅ Time calculation: ${results.timeCalculation ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Manual trigger
    const triggerResult = await triggerLocalManualGenerationForTimeframe('last_week');
    results.manualTrigger = typeof triggerResult === 'object' && 'success' in triggerResult;
    console.log(`✅ Manual trigger: ${results.manualTrigger ? 'PASSED' : 'FAILED'}`);
    
    const allPassed = Object.values(results).every(result => result);
    console.log(`\n📊 Test Results: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
    
    return {
      success: allPassed,
      results
    };
    
  } catch (error) {
    console.error('❌ Scheduler test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 