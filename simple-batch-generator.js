#!/usr/bin/env node

/**
 * Simple Batch Question Generator
 * 
 * Uses existing functions: generateLastWeekQuestions, generateLastMonthQuestions, generateLastYearQuestions
 * Runs them sequentially with pauses and creates a report.
 */

// Load environment variables first
import { config } from 'dotenv';
config();

// Now import the Node.js-compatible service
import { triggerLocalManualGenerationForTimeframe } from './src/services/localSchedulerService-node.js';

// Configuration
const TIMEFRAMES = [
  { name: 'Last Week', id: 'last_week', pauseMs: 5000 },
  { name: 'Last Month', id: 'last_month', pauseMs: 10000 },
  { name: 'Last Year', id: 'last_year', pauseMs: 15000 }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTimestamp() {
  return new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

async function generateQuestionsForTimeframe(timeframe) {
  const startTime = Date.now();
  const result = {
    timeframe: timeframe.name,
    timeframeId: timeframe.id,
    startTime: getTimestamp(),
    success: false,
    questionsReceived: 0,
    errors: [],
    duration: 0
  };

  console.log(`\n🚀 Starting ${timeframe.name} question generation...`);
  console.log(`⏰ Started at: ${result.startTime}`);

  try {
    // Use your existing function
    const generationResult = await triggerLocalManualGenerationForTimeframe(timeframe.id);
    
    result.duration = Date.now() - startTime;
    result.endTime = getTimestamp();

    if (generationResult && generationResult.success) {
      result.success = true;
      result.questionsReceived = generationResult.questionsGenerated || 0;
      result.source = 'local_scheduler';
      result.metadata = generationResult;

      console.log(`✅ ${timeframe.name} generation successful!`);
      console.log(`📊 Questions generated: ${result.questionsReceived}`);
      console.log(`🎲 Randomization: Applied automatically`);
    } else {
      result.errors.push(`Generation failed: ${generationResult?.error || 'Unknown error'}`);
      console.log(`❌ ${timeframe.name} generation failed:`, generationResult?.error);
    }

  } catch (error) {
    result.duration = Date.now() - startTime;
    result.endTime = getTimestamp();
    result.errors.push(`Exception: ${error.message}`);
    console.log(`❌ ${timeframe.name} generation exception:`, error.message);
  }

  return result;
}

function generateReport(results) {
  const totalQuestions = results.reduce((sum, r) => sum + r.questionsReceived, 0);
  const successfulRuns = results.filter(r => r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  let report = '\n' + '='.repeat(80) + '\n';
  report += '📋 SIMPLE BATCH QUESTION GENERATION REPORT\n';
  report += '='.repeat(80) + '\n';
  report += `⏰ Generated at: ${new Date().toLocaleString()}\n`;
  report += `🎯 Total timeframes processed: ${results.length}\n`;
  report += `✅ Successful generations: ${successfulRuns}/${results.length}\n`;
  report += `📊 Total questions generated: ${totalQuestions}\n`;
  report += `⏱️ Total duration: ${(totalDuration / 1000).toFixed(1)}s\n\n`;

  results.forEach((result, index) => {
    report += `${index + 1}. ${result.timeframe}\n`;
    report += `   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
    report += `   Questions: ${result.questionsReceived}\n`;
    report += `   Duration: ${(result.duration / 1000).toFixed(1)}s\n`;
    report += `   Source: ${result.source || 'Unknown'}\n`;
    
    if (result.errors.length > 0) {
      report += `   Errors: ${result.errors.join(', ')}\n`;
    }
    
    report += '\n';
  });

  report += '📈 SUMMARY\n';
  report += '-'.repeat(40) + '\n';
  report += `Success rate: ${((successfulRuns / results.length) * 100).toFixed(1)}%\n`;
  report += `Total questions: ${totalQuestions}\n`;
  report += `Average per timeframe: ${(totalQuestions / results.length).toFixed(1)}\n`;
  
  if (successfulRuns === results.length) {
    report += '✅ All timeframes generated successfully!\n';
  } else {
    report += `⚠️ ${results.length - successfulRuns} timeframe(s) failed.\n`;
  }
  
  report += '='.repeat(80) + '\n';

  return report;
}

async function runSimpleBatchGeneration() {
  console.log('🎯 SIMPLE BATCH QUESTION GENERATION STARTING');
  console.log('='.repeat(50));
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`🎯 Processing ${TIMEFRAMES.length} timeframes`);
  console.log('='.repeat(50));

  const results = [];

  for (let i = 0; i < TIMEFRAMES.length; i++) {
    const timeframe = TIMEFRAMES[i];
    
    const result = await generateQuestionsForTimeframe(timeframe);
    results.push(result);

    if (i < TIMEFRAMES.length - 1) {
      const nextTimeframe = TIMEFRAMES[i + 1];
      console.log(`\n⏸️ Pausing for ${nextTimeframe.pauseMs / 1000}s before ${nextTimeframe.name}...`);
      await sleep(nextTimeframe.pauseMs);
    }
  }

  const report = generateReport(results);
  console.log(report);

  // Save report to file
  const reportFileName = `simple-batch-report-${new Date().toISOString().split('T')[0]}.txt`;
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

// Run the batch generation
runSimpleBatchGeneration()
  .then(({ success, results }) => {
    console.log(`\n🎉 Simple batch generation ${success ? 'completed successfully' : 'completed with issues'}`);
    
    if (success) {
      console.log('✅ All timeframes processed successfully!');
    } else {
      console.log('⚠️ Some timeframes had issues. Check the report above for details.');
    }
    
    console.log('\n📄 A detailed report has been saved to a file for your reference.');
    
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Fatal error in batch generation:', error);
    process.exit(1);
  }); 