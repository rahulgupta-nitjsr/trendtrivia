/**
 * Test Comprehensive Fallback System
 * Verifies that the 120-question fallback system works correctly
 */

import { getComprehensiveFallbackQuestions, getFallbackStatistics, testComprehensiveFallbackService } from './src/services/comprehensiveFallbackService.js';

async function testComprehensiveFallback() {
  console.log('🧪 Testing Comprehensive Fallback System...\n');
  
  try {
    // Test 1: Get statistics
    console.log('📊 Getting fallback statistics...');
    const stats = await getFallbackStatistics();
    console.log(`✅ Total questions: ${stats.statistics?.totalQuestions}`);
    console.log(`✅ Topics: ${stats.statistics?.topics.join(', ')}`);
    console.log(`✅ Timeframes: ${stats.statistics?.timeframes.join(', ')}`);
    console.log(`✅ Questions per topic/timeframe: ${stats.statistics?.questionsPerTopicTimeframe}\n`);
    
    // Test 2: Get questions for each topic and timeframe
    const topics = ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'];
    const timeframes = ['last_week', 'last_month', 'last_year'];
    
    for (const topic of topics) {
      for (const timeframe of timeframes) {
        console.log(`🔍 Testing ${topic} - ${timeframe}...`);
        const result = await getComprehensiveFallbackQuestions(topic, timeframe, 10);
        
        if (result.success) {
          console.log(`✅ Got ${result.questions.length} questions for ${topic} - ${timeframe}`);
          console.log(`📊 Answer distribution: A:${result.answerDistribution.percentages.A}%, B:${result.answerDistribution.percentages.B}%, C:${result.answerDistribution.percentages.C}%, D:${result.answerDistribution.percentages.D}%`);
        } else {
          console.log(`❌ Failed to get questions for ${topic} - ${timeframe}: ${result.error}`);
        }
      }
    }
    
    // Test 3: Run comprehensive service test
    console.log('\n🧪 Running comprehensive service test...');
    const serviceTest = await testComprehensiveFallbackService();
    console.log(`✅ Service test: ${serviceTest.success ? 'PASSED' : 'FAILED'}`);
    
    console.log('\n🎉 Comprehensive fallback system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testComprehensiveFallback(); 