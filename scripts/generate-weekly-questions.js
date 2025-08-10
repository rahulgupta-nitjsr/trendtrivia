#!/usr/bin/env node

/**
 * Weekly AI Question Generation Script
 * 
 * This script runs weekly (Monday 9AM EST) to generate fresh trivia questions
 * using the Perplexity AI API and stores them in Firebase Firestore.
 * 
 * Features:
 * - Generates questions for 3 timeframes (last_week, last_month, last_year)
 * - Flexible validation (30+ questions per timeframe, not strict 10 per topic)
 * - Smart retry logic for network errors only
 * - Email notifications with detailed breakdown
 * - Archive management (keeps 4 weeks of questions)
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { generateQuestionsForTimeframe } from '../src/services/aiContentService-node.js';
import { initializeFirebaseNode, storeQuestionsInBatch, archiveOldBatches, activateBatch } from '../src/services/batchService-node.js';
import { sendEmailNotification } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  timeframes: process.env.TIMEFRAMES?.split(',') || ['last_week', 'last_month', 'last_year'],
  forceRegenerate: process.env.FORCE_REGENERATE === 'true',
  triggerSource: process.env.TRIGGER_SOURCE || 'manual',
  emailRecipient: process.env.EMAIL_RECIPIENT || 'rahulgupta.nitjsr@gmail.com',
  minQuestionsPerTimeframe: 30,
  maxRetries: 1, // Smart retry: only for network errors
  retryDelayMs: 2 * 60 * 1000, // 2 minutes
  archiveAfterWeeks: 4
};

// Logging setup
const logFile = join(__dirname, `../logs/weekly-generation-${new Date().toISOString().split('T')[0]}.log`);
const logDir = dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + '\n');
}

function logError(message, error) {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${message}`;
  if (error) {
    errorMessage += `\n${error.stack || error.message || error}`;
  }
  console.error(errorMessage);
  fs.appendFileSync(logFile, errorMessage + '\n');
}

/**
 * Smart retry logic - only retry network/timeout errors
 */
function shouldRetry(error) {
  const networkErrors = [
    'ECONNRESET',
    'ENOTFOUND', 
    'ECONNREFUSED',
    'ETIMEDOUT',
    'timeout',
    'network',
    'fetch failed'
  ];
  
  const errorMessage = (error.message || error.toString()).toLowerCase();
  return networkErrors.some(networkError => errorMessage.includes(networkError));
}

/**
 * Generate questions for a specific timeframe with retry logic
 */
async function generateWithRetry(timeframe, attempt = 1) {
  try {
    log(`🚀 Generating questions for ${timeframe} (attempt ${attempt}/${CONFIG.maxRetries + 1})`);
    
    const result = await generateQuestionsForTimeframe(timeframe, {
      forcereGenerate: CONFIG.forceRegenerate,
      trigger: `weekly_${CONFIG.triggerSource}`,
      duplicatePreventionHours: CONFIG.forceRegenerate ? 0 : 6
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    log(`✅ Successfully generated ${result.questions.length} questions for ${timeframe}`);
    return result;
    
  } catch (error) {
    logError(`Failed to generate questions for ${timeframe} (attempt ${attempt})`, error);
    
    // Check if we should retry
    if (attempt <= CONFIG.maxRetries && shouldRetry(error)) {
      log(`🔄 Retrying ${timeframe} after ${CONFIG.retryDelayMs / 1000} seconds (network error detected)`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelayMs));
      return generateWithRetry(timeframe, attempt + 1);
    }
    
    // Don't retry for API quota, auth errors, or after max retries
    log(`❌ Not retrying ${timeframe}: ${shouldRetry(error) ? 'Max retries reached' : 'Non-network error'}`);
    return {
      success: false,
      error: error.message,
      timeframe,
      attempts: attempt
    };
  }
}

/**
 * Analyze question distribution by topic and timeframe
 */
function analyzeQuestionDistribution(results) {
  const analysis = {
    totalQuestions: 0,
    byTimeframe: {},
    byTopic: {
      'Technology': { total: 0, byTimeframe: {} },
      'Pop Culture': { total: 0, byTimeframe: {} },
      'Finance': { total: 0, byTimeframe: {} },
      'Start-Ups': { total: 0, byTimeframe: {} }
    },
    successfulTimeframes: 0,
    failedTimeframes: []
  };
  
  for (const result of results) {
    if (result.success && result.questions) {
      analysis.successfulTimeframes++;
      analysis.byTimeframe[result.metadata.timeframe] = result.questions.length;
      analysis.totalQuestions += result.questions.length;
      
      // Count by topic
      for (const question of result.questions) {
        const topic = question.category;
        if (analysis.byTopic[topic]) {
          analysis.byTopic[topic].total++;
          if (!analysis.byTopic[topic].byTimeframe[result.metadata.timeframe]) {
            analysis.byTopic[topic].byTimeframe[result.metadata.timeframe] = 0;
          }
          analysis.byTopic[topic].byTimeframe[result.metadata.timeframe]++;
        }
      }
    } else {
      analysis.failedTimeframes.push({
        timeframe: result.timeframe,
        error: result.error
      });
    }
  }
  
  return analysis;
}

/**
 * Main generation function
 */
async function runWeeklyGeneration() {
  const startTime = Date.now();
  log('🚀 Starting Weekly AI Question Generation');
  log(`📋 Configuration: ${JSON.stringify(CONFIG, null, 2)}`);
  
  try {
    // Initialize Firebase
    log('🔥 Initializing Firebase...');
    await initializeFirebaseNode();
    log('✅ Firebase initialized successfully');
    
    // Generate questions for all timeframes
    const results = [];
    
    for (const timeframe of CONFIG.timeframes) {
      const result = await generateWithRetry(timeframe);
      results.push(result);
      
      // Small delay between timeframes to avoid rate limiting
      if (timeframe !== CONFIG.timeframes[CONFIG.timeframes.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Analyze results
    const analysis = analyzeQuestionDistribution(results);
    log(`📊 Generation Analysis: ${JSON.stringify(analysis, null, 2)}`);
    
    // Determine overall success
    const minSuccessfulTimeframes = 2; // At least 2 out of 3 timeframes must succeed
    const isSuccess = analysis.successfulTimeframes >= minSuccessfulTimeframes;
    
    if (!isSuccess) {
      throw new Error(`Insufficient successful generations: ${analysis.successfulTimeframes}/${CONFIG.timeframes.length} timeframes succeeded (minimum ${minSuccessfulTimeframes} required)`);
    }
    
    // Store successful results in Firebase
    const storedBatches = [];
    for (const result of results) {
      if (result.success && result.questions && result.questions.length >= CONFIG.minQuestionsPerTimeframe) {
        try {
          log(`💾 Storing ${result.questions.length} questions for ${result.metadata.timeframe}...`);
          
          const batchId = await storeQuestionsInBatch(
            result.questions,
            result.metadata.timeframe,
            {
              ...result.metadata,
              generationType: 'weekly_automated',
              triggerSource: CONFIG.triggerSource,
              analysis: analysis.byTopic
            }
          );
          
          storedBatches.push({
            batchId,
            timeframe: result.metadata.timeframe,
            questionCount: result.questions.length
          });
          
          log(`✅ Stored batch ${batchId} for ${result.metadata.timeframe}`);
          
        } catch (error) {
          logError(`Failed to store batch for ${result.metadata.timeframe}`, error);
        }
      }
    }
    
    // Activate new batches
    for (const batch of storedBatches) {
      try {
        await activateBatch(batch.batchId, batch.timeframe);
        log(`🟢 Activated batch ${batch.batchId} for ${batch.timeframe}`);
      } catch (error) {
        logError(`Failed to activate batch ${batch.batchId}`, error);
      }
    }
    
    // Archive old batches (older than 4 weeks)
    try {
      log('🗄️ Archiving old batches...');
      const archiveResult = await archiveOldBatches(CONFIG.archiveAfterWeeks);
      log(`✅ Archived ${archiveResult.archivedCount} old batches`);
    } catch (error) {
      logError('Failed to archive old batches', error);
    }
    
    // Send success notification
    const duration = (Date.now() - startTime) / 1000;
    await sendEmailNotification({
      recipient: CONFIG.emailRecipient,
      success: true,
      analysis,
      results,
      storedBatches,
      duration,
      triggerSource: CONFIG.triggerSource,
      logFile
    });
    
    log(`🎉 Weekly generation completed successfully in ${duration.toFixed(1)} seconds`);
    log(`📊 Final Summary: ${analysis.totalQuestions} questions generated across ${analysis.successfulTimeframes} timeframes`);
    
    // Exit with success
    process.exit(0);
    
  } catch (error) {
    logError('Weekly generation failed', error);
    
    // Send failure notification
    const duration = (Date.now() - startTime) / 1000;
    try {
      await sendEmailNotification({
        recipient: CONFIG.emailRecipient,
        success: false,
        error: error.message,
        results: results || [],
        duration,
        triggerSource: CONFIG.triggerSource,
        logFile
      });
    } catch (emailError) {
      logError('Failed to send failure notification', emailError);
    }
    
    // Exit with error
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception:', error);
  process.exit(1);
});

// Run the generation
if (import.meta.url === `file://${process.argv[1]}`) {
  runWeeklyGeneration();
}

export { runWeeklyGeneration, analyzeQuestionDistribution };
