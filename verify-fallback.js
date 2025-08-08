import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('./src/comprehensive-fallback-questions.json', 'utf8'));
  
  console.log('📊 FALLBACK SYSTEM VERIFICATION');
  console.log('================================');
  
  const topics = data.metadata.topics;
  const timeframes = data.metadata.timeframes;
  let totalCount = 0;
  
  console.log(`\n📋 Metadata:`);
  console.log(`- Total questions: ${data.metadata.totalQuestions}`);
  console.log(`- Topics: ${topics.join(', ')}`);
  console.log(`- Timeframes: ${timeframes.join(', ')}`);
  console.log(`- Questions per topic/timeframe: ${data.metadata.questionsPerTopicTimeframe}`);
  
  console.log(`\n🔍 Question Count by Topic/Timeframe:`);
  
  topics.forEach(topic => {
    timeframes.forEach(timeframe => {
      const questions = data.questions[topic]?.[timeframe] || [];
      console.log(`- ${topic} - ${timeframe}: ${questions.length} questions`);
      totalCount += questions.length;
    });
  });
  
  console.log(`\n📈 Summary:`);
  console.log(`- Expected total: ${data.metadata.totalQuestions}`);
  console.log(`- Actual total: ${totalCount}`);
  console.log(`- Status: ${totalCount === data.metadata.totalQuestions ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (totalCount !== data.metadata.totalQuestions) {
    console.log(`\n❌ MISMATCH: Expected ${data.metadata.totalQuestions} questions but found ${totalCount}`);
  } else {
    console.log(`\n✅ VERIFICATION COMPLETE: All ${totalCount} questions are properly structured!`);
  }
  
} catch (error) {
  console.error('❌ Error reading fallback data:', error.message);
} 