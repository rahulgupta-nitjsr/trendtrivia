/**
 * Node.js compatible test for comprehensive fallback system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the JSON data directly
const fallbackDataPath = path.join(__dirname, 'src', 'comprehensive-fallback-questions.json');
const fallbackData = JSON.parse(fs.readFileSync(fallbackDataPath, 'utf8'));

console.log('🧪 Testing Comprehensive Fallback System...\n');

try {
  // Test 1: Check metadata
  console.log('📊 Checking fallback metadata...');
  console.log(`✅ Total questions: ${fallbackData.metadata.totalQuestions}`);
  console.log(`✅ Topics: ${fallbackData.metadata.topics.join(', ')}`);
  console.log(`✅ Timeframes: ${fallbackData.metadata.timeframes.join(', ')}`);
  console.log(`✅ Questions per topic/timeframe: ${fallbackData.metadata.questionsPerTopicTimeframe}\n`);
  
  // Test 2: Check questions for each topic and timeframe
  const topics = ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'];
  const timeframes = ['last_week', 'last_month', 'last_year'];
  
  for (const topic of topics) {
    for (const timeframe of timeframes) {
      console.log(`🔍 Testing ${topic} - ${timeframe}...`);
      
      const topicQuestions = fallbackData.questions[topic];
      if (!topicQuestions) {
        console.log(`❌ No questions found for topic: ${topic}`);
        continue;
      }
      
      const timeframeQuestions = topicQuestions[timeframe];
      if (!timeframeQuestions) {
        console.log(`❌ No questions found for timeframe: ${timeframe}`);
        continue;
      }
      
      console.log(`✅ Found ${timeframeQuestions.length} questions for ${topic} - ${timeframe}`);
      
      // Check answer distribution
      const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
      timeframeQuestions.forEach(question => {
        const correctAnswer = question.answer;
        const correctIndex = question.options.indexOf(correctAnswer);
        if (correctIndex === 0) answerCounts.A++;
        else if (correctIndex === 1) answerCounts.B++;
        else if (correctIndex === 2) answerCounts.C++;
        else if (correctIndex === 3) answerCounts.D++;
      });
      
      console.log(`📊 Answer distribution: A:${answerCounts.A}, B:${answerCounts.B}, C:${answerCounts.C}, D:${answerCounts.D}`);
    }
  }
  
  console.log('\n🎉 Comprehensive fallback system test completed successfully!');
  console.log(`📈 Total questions available: ${fallbackData.metadata.totalQuestions}`);
  
} catch (error) {
  console.error('❌ Test failed:', error);
} 