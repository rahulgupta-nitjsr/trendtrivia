#!/usr/bin/env node

/**
 * Demo Batch Question Generation Script
 * 
 * This is a demonstration version that simulates the batch generation process
 * without requiring Firebase connection. Use this to test the reporting format.
 */

// Simulated question data for demo
const demoQuestions = [
  {
    question: "What major tech announcement happened this week?",
    options: ["New AI Model", "Space Launch", "Crypto Boom", "App Update"],
    answer: "New AI Model",
    category: "technology",
    difficulty: "Medium"
  },
  {
    question: "Which celebrity made headlines recently?",
    options: ["Movie Star", "Singer", "Athlete", "Chef"],
    answer: "Movie Star",
    category: "pop culture",
    difficulty: "Easy"
  }
];

// Simulate the randomization function
function randomizeQuestionsArray(questions) {
  console.log(`🎲 Randomizing options for ${questions.length} questions...`);
  
  return questions.map((question, index) => {
    const options = [...question.options];
    // Simple shuffle for demo
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return {
      ...question,
      options,
      randomized: true,
      originalCorrectPosition: question.options.indexOf(question.answer),
      newCorrectPosition: options.indexOf(question.answer)
    };
  });
}

// Simulate answer distribution analysis
function analyzeAnswerDistribution(questions) {
  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  const letters = ['A', 'B', 'C', 'D'];
  
  questions.forEach(question => {
    const correctAnswer = question.answer;
    const correctIndex = question.options.indexOf(correctAnswer);
    if (correctIndex >= 0 && correctIndex < 4) {
      const letter = letters[correctIndex];
      distribution[letter]++;
    }
  });

  const total = questions.length;
  const percentages = {};
  Object.keys(distribution).forEach(letter => {
    percentages[letter] = total > 0 ? ((distribution[letter] / total) * 100).toFixed(1) + '%' : '0%';
  });

  return {
    counts: distribution,
    percentages,
    total,
    isBalanced: true // Demo always shows balanced
  };
}

// Configuration
const CONFIG = {
  timeframes: [
    { name: 'Last Week', id: 'week', pauseMs: 2000 },
    { name: 'Last Month', id: 'month', pauseMs: 3000 },
    { name: 'Last Year', id: 'year', pauseMs: 2000 }
  ],
  totalExpectedQuestions: 40
};

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
    success: true,
    questionsReceived: Math.floor(Math.random() * 10) + 35, // 35-45 questions
    randomizationApplied: true,
    answerDistribution: null,
    errors: [],
    duration: 0
  };

  console.log(`\n🚀 Starting ${timeframe.name} question generation...`);
  console.log(`⏰ Started at: ${result.startTime}`);

  // Simulate processing time
  await sleep(1000 + Math.random() * 2000);

  result.duration = Date.now() - startTime;
  result.endTime = getTimestamp();

  // Simulate randomized questions
  const simulatedQuestions = Array(result.questionsReceived).fill().map((_, i) => ({
    ...demoQuestions[i % demoQuestions.length],
    id: i + 1
  }));

  const randomizedQuestions = randomizeQuestionsArray(simulatedQuestions);
  result.answerDistribution = analyzeAnswerDistribution(randomizedQuestions);

  console.log(`✅ ${timeframe.name} generation successful!`);
  console.log(`📊 Questions received: ${result.questionsReceived}/${CONFIG.totalExpectedQuestions}`);
  console.log(`🎲 Randomization applied: Yes`);
  console.log(`📈 Answer distribution: A:${result.answerDistribution.percentages.A}, B:${result.answerDistribution.percentages.B}, C:${result.answerDistribution.percentages.C}, D:${result.answerDistribution.percentages.D}`);

  return result;
}

function generateReport(results) {
  const totalQuestions = results.reduce((sum, r) => sum + r.questionsReceived, 0);
  const successfulRuns = results.filter(r => r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  let report = '\n' + '='.repeat(80) + '\n';
  report += '📋 DEMO BATCH QUESTION GENERATION REPORT\n';
  report += '='.repeat(80) + '\n';
  report += `⏰ Generated at: ${new Date().toLocaleString()}\n`;
  report += `🎯 Total timeframes processed: ${results.length}\n`;
  report += `✅ Successful generations: ${successfulRuns}/${results.length}\n`;
  report += `📊 Total questions generated: ${totalQuestions}\n`;
  report += `⏱️ Total duration: ${(totalDuration / 1000).toFixed(1)}s\n\n`;

  results.forEach((result, index) => {
    report += `${index + 1}. ${result.timeframe}\n`;
    report += `   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
    report += `   Questions: ${result.questionsReceived}/${CONFIG.totalExpectedQuestions}\n`;
    report += `   Randomization: ${result.randomizationApplied ? '✅ Applied' : '❌ Not applied'}\n`;
    report += `   Duration: ${(result.duration / 1000).toFixed(1)}s\n`;
    report += `   Source: demo_simulation\n`;
    
    if (result.answerDistribution) {
      const dist = result.answerDistribution;
      report += `   Distribution: A:${dist.percentages.A}, B:${dist.percentages.B}, C:${dist.percentages.C}, D:${dist.percentages.D}\n`;
      report += `   Balanced: ${dist.isBalanced ? '✅ Yes' : '❌ No'}\n`;
    }
    
    report += '\n';
  });

  report += '📈 SUMMARY STATISTICS\n';
  report += '-'.repeat(40) + '\n';
  
  const avgQuestions = results.length > 0 ? (totalQuestions / results.length).toFixed(1) : 0;
  const successRate = results.length > 0 ? ((successfulRuns / results.length) * 100).toFixed(1) : 0;
  
  report += `Average questions per timeframe: ${avgQuestions}\n`;
  report += `Success rate: ${successRate}%\n`;
  report += `Total expected questions: ${CONFIG.totalExpectedQuestions * results.length}\n`;
  report += `Total actual questions: ${totalQuestions}\n`;
  report += `Efficiency: ${((totalQuestions / (CONFIG.totalExpectedQuestions * results.length)) * 100).toFixed(1)}%\n\n`;

  report += '💡 DEMO RECOMMENDATIONS\n';
  report += '-'.repeat(40) + '\n';
  report += '✅ This is a demo simulation - all operations successful!\n';
  report += '🎯 In real usage, this would generate actual AI questions.\n';
  report += '📊 Randomization ensures balanced answer distribution.\n';
  
  report += '='.repeat(80) + '\n';

  return report;
}

async function runDemoBatchGeneration() {
  console.log('🎯 DEMO BATCH QUESTION GENERATION STARTING');
  console.log('='.repeat(50));
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`🎯 Processing ${CONFIG.timeframes.length} timeframes (DEMO)`);
  console.log(`📊 Expected questions per timeframe: ${CONFIG.totalExpectedQuestions}`);
  console.log('='.repeat(50));

  const results = [];

  for (let i = 0; i < CONFIG.timeframes.length; i++) {
    const timeframe = CONFIG.timeframes[i];
    
    const result = await generateQuestionsForTimeframe(timeframe);
    results.push(result);

    if (i < CONFIG.timeframes.length - 1) {
      const nextTimeframe = CONFIG.timeframes[i + 1];
      console.log(`\n⏸️ Pausing for ${nextTimeframe.pauseMs / 1000}s before ${nextTimeframe.name}...`);
      await sleep(nextTimeframe.pauseMs);
    }
  }

  const report = generateReport(results);
  console.log(report);

  return {
    success: results.filter(r => r.success).length === results.length,
    results,
    report
  };
}

// Run the demo
runDemoBatchGeneration()
  .then(({ success, results }) => {
    console.log(`\n🎉 Demo batch generation ${success ? 'completed successfully' : 'completed with issues'}`);
    console.log('✅ This demonstrates the reporting format and timing.');
    console.log('💡 Use the real script (generate-questions.js) for actual question generation.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Demo error:', error);
    process.exit(1);
  }); 