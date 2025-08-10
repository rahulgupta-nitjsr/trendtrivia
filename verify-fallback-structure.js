import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('src/comprehensive-fallback-questions.json', 'utf8'));
  
  console.log('📊 Comprehensive Fallback Dataset Verification');
  console.log('='.repeat(50));
  console.log('Metadata:', data.metadata);
  
  const topics = data.metadata.topics;
  const timeframes = data.metadata.timeframes;
  let totalQuestions = 0;
  let allValid = true;
  
  topics.forEach(topic => {
    console.log(`\n📂 ${topic}:`);
    timeframes.forEach(timeframe => {
      const questions = data.questions[topic]?.[timeframe];
      const count = questions?.length || 0;
      const status = count === 10 ? '✅' : '❌';
      console.log(`  ${status} ${timeframe}: ${count} questions`);
      
      if (count !== 10) {
        allValid = false;
      }
      
      totalQuestions += count;
    });
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`Total questions: ${totalQuestions}`);
  console.log(`Expected: ${topics.length * timeframes.length * 10} (${topics.length} topics × ${timeframes.length} timeframes × 10 questions)`);
  console.log(`Structure valid: ${allValid ? '✅ YES' : '❌ NO'}`);
  
  if (allValid) {
    console.log('\n🎉 Comprehensive fallback dataset is properly structured!');
  } else {
    console.log('\n⚠️ Some topic/timeframe combinations are missing questions!');
  }
  
} catch (error) {
  console.error('❌ Error reading fallback dataset:', error.message);
}
