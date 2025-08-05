import fs from 'fs';

console.log('Testing JSON file read...');

try {
  const data = fs.readFileSync('./src/comprehensive-fallback-questions.json', 'utf8');
  const json = JSON.parse(data);
  console.log('✅ JSON file read successfully!');
  console.log(`📊 Total questions: ${json.metadata.totalQuestions}`);
  console.log(`📋 Topics: ${json.metadata.topics.join(', ')}`);
} catch (error) {
  console.error('❌ Error reading JSON:', error);
} 