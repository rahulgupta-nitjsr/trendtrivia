/**
 * Batch Question Generator Script
 * 
 * This script triggers question generation for all timeframes (last week, last month, last year)
 * with appropriate pauses and detailed reporting.
 * 
 * Features:
 * - Sequential execution with configurable pauses
 * - Detailed success/failure reporting
 * - Question count tracking
 * - Randomization validation
 * - Easy-to-read output formatting
 */

import { getQuizQuestions } from '../services/firestoreService.js';
import { analyzeAnswerDistribution } from './questionRandomizer.js';
import '../config/firebase-node.js'; // Load Node.js compatible Firebase config

// Configuration
const CONFIG = {
  timeframes: [
    { name: 'Last Week', id: 'week', pauseMs: 5000 },
    { name: 'Last Month', id: 'month', pauseMs: 10000 },
    { name: 'Last Year', id: 'year', pauseMs: 15000 }
  ],
  categories: ['technology', 'pop culture', 'finance', 'start-ups'],
  questionsPerCategory: 10,
  totalExpectedQuestions: 40
};

/**
 * Sleep function for pauses between operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format timestamp for logging
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  return new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Generate questions for a specific timeframe
 * @param {Object} timeframe - Timeframe configuration
 * @returns {Object} Generation result with details
 */
async function generateQuestionsForTimeframe(timeframe) {
  const startTime = Date.now();
  const result = {
    timeframe: timeframe.name,
    timeframeId: timeframe.id,
    startTime: getTimestamp(),
    success: false,
    questionsReceived: 0,
    categoriesProcessed: 0,
    randomizationApplied: false,
    answerDistribution: null,
    errors: [],
    duration: 0
  };

  console.log(`\n🚀 Starting ${timeframe.name} question generation...`);
  console.log(`⏰ Started at: ${result.startTime}`);

  try {
    // Fetch questions for this timeframe
    const fetchResult = await getQuizQuestions({
      count: CONFIG.totalExpectedQuestions,
      timeframe: timeframe.id,
      preferLatestBatch: true
    });

    result.duration = Date.now() - startTime;
    result.endTime = getTimestamp();

    if (fetchResult.success && fetchResult.questions) {
      result.success = true;
      result.questionsReceived = fetchResult.questions.length;
      result.randomizationApplied = fetchResult.randomizationApplied || false;
      result.answerDistribution = fetchResult.answerDistribution;
      result.source = fetchResult.source;
      result.metadata = fetchResult.metadata;

      console.log(`✅ ${timeframe.name} generation successful!`);
      console.log(`📊 Questions received: ${result.questionsReceived}/${CONFIG.totalExpectedQuestions}`);
      console.log(`🎲 Randomization applied: ${result.randomizationApplied ? 'Yes' : 'No'}`);
      
      if (result.answerDistribution) {
        console.log(`📈 Answer distribution: A:${result.answerDistribution.percentages.A}, B:${result.answerDistribution.percentages.B}, C:${result.answerDistribution.percentages.C}, D:${result.answerDistribution.percentages.D}`);
      }

    } else {
      result.errors.push(`Fetch failed: ${fetchResult.error || 'Unknown error'}`);
      console.log(`❌ ${timeframe.name} generation failed:`, fetchResult.error);
    }

  } catch (error) {
    result.duration = Date.now() - startTime;
    result.endTime = getTimestamp();
    result.errors.push(`Exception: ${error.message}`);
    console.log(`❌ ${timeframe.name} generation exception:`, error.message);
  }

  return result;
}

/**
 * Generate a detailed report of all operations
 * @param {Array} results - Array of generation results
 * @returns {string} Formatted report
 */
function generateReport(results) {
  const totalQuestions = results.reduce((sum, r) => sum + r.questionsReceived, 0);
  const successfulRuns = results.filter(r => r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  let report = '\n' + '='.repeat(80) + '\n';
  report += '📋 BATCH QUESTION GENERATION REPORT\n';
  report += '='.repeat(80) + '\n';
  report += `⏰ Generated at: ${new Date().toLocaleString()}\n`;
  report += `🎯 Total timeframes processed: ${results.length}\n`;
  report += `✅ Successful generations: ${successfulRuns}/${results.length}\n`;
  report += `📊 Total questions generated: ${totalQuestions}\n`;
  report += `⏱️ Total duration: ${(totalDuration / 1000).toFixed(1)}s\n\n`;

  // Detailed results for each timeframe
  results.forEach((result, index) => {
    report += `${index + 1}. ${result.timeframe}\n`;
    report += `   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
    report += `   Questions: ${result.questionsReceived}/${CONFIG.totalExpectedQuestions}\n`;
    report += `   Randomization: ${result.randomizationApplied ? '✅ Applied' : '❌ Not applied'}\n`;
    report += `   Duration: ${(result.duration / 1000).toFixed(1)}s\n`;
    report += `   Source: ${result.source || 'Unknown'}\n`;
    
    if (result.answerDistribution) {
      const dist = result.answerDistribution;
      report += `   Distribution: A:${dist.percentages.A}, B:${dist.percentages.B}, C:${dist.percentages.C}, D:${dist.percentages.D}\n`;
      report += `   Balanced: ${dist.isBalanced ? '✅ Yes' : '❌ No'}\n`;
    }
    
    if (result.errors.length > 0) {
      report += `   Errors: ${result.errors.join(', ')}\n`;
    }
    
    report += '\n';
  });

  // Summary statistics
  report += '📈 SUMMARY STATISTICS\n';
  report += '-'.repeat(40) + '\n';
  
  const avgQuestions = results.length > 0 ? (totalQuestions / results.length).toFixed(1) : 0;
  const successRate = results.length > 0 ? ((successfulRuns / results.length) * 100).toFixed(1) : 0;
  
  report += `Average questions per timeframe: ${avgQuestions}\n`;
  report += `Success rate: ${successRate}%\n`;
  report += `Total expected questions: ${CONFIG.totalExpectedQuestions * results.length}\n`;
  report += `Total actual questions: ${totalQuestions}\n`;
  report += `Efficiency: ${((totalQuestions / (CONFIG.totalExpectedQuestions * results.length)) * 100).toFixed(1)}%\n\n`;

  // Recommendations
  report += '💡 RECOMMENDATIONS\n';
  report += '-'.repeat(40) + '\n';
  
  if (successfulRuns === results.length) {
    report += '✅ All timeframes generated successfully!\n';
  } else {
    report += `⚠️ ${results.length - successfulRuns} timeframe(s) failed. Check logs for details.\n`;
  }
  
  if (totalQuestions < CONFIG.totalExpectedQuestions * results.length) {
    report += '⚠️ Some timeframes received fewer questions than expected.\n';
  }
  
  const unbalancedResults = results.filter(r => r.answerDistribution && !r.answerDistribution.isBalanced);
  if (unbalancedResults.length > 0) {
    report += `⚠️ ${unbalancedResults.length} timeframe(s) have unbalanced answer distributions.\n`;
  }
  
  report += '='.repeat(80) + '\n';

  return report;
}

/**
 * Main function to run batch question generation
 */
export async function runBatchQuestionGeneration() {
  console.log('🎯 BATCH QUESTION GENERATION STARTING');
  console.log('='.repeat(50));
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`🎯 Processing ${CONFIG.timeframes.length} timeframes`);
  console.log(`📊 Expected questions per timeframe: ${CONFIG.totalExpectedQuestions}`);
  console.log('='.repeat(50));

  const results = [];

  for (let i = 0; i < CONFIG.timeframes.length; i++) {
    const timeframe = CONFIG.timeframes[i];
    
    // Generate questions for this timeframe
    const result = await generateQuestionsForTimeframe(timeframe);
    results.push(result);

    // Add pause between timeframes (except for the last one)
    if (i < CONFIG.timeframes.length - 1) {
      const nextTimeframe = CONFIG.timeframes[i + 1];
      console.log(`\n⏸️ Pausing for ${nextTimeframe.pauseMs / 1000}s before ${nextTimeframe.name}...`);
      await sleep(nextTimeframe.pauseMs);
    }
  }

  // Generate and display final report
  const report = generateReport(results);
  console.log(report);

  // Save report to file for easy access
  const reportFileName = `question-generation-report-${new Date().toISOString().split('T')[0]}.txt`;
  try {
    const fs = await import('fs');
    fs.writeFileSync(reportFileName, report);
    console.log(`📄 Report saved to: ${reportFileName}`);
  } catch (error) {
    console.log('⚠️ Could not save report to file:', error.message);
  }

  return {
    success: results.filter(r => r.success).length === results.length,
    results,
    report
  };
}

/**
 * CLI entry point for direct script execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  runBatchQuestionGeneration()
    .then(({ success, results }) => {
      console.log(`\n🎉 Batch generation ${success ? 'completed successfully' : 'completed with issues'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Fatal error in batch generation:', error);
      process.exit(1);
    });
}

export default runBatchQuestionGeneration; 