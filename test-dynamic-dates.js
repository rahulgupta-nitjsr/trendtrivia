/**
 * Test Dynamic Date Injection
 * Verifies that prompts are properly enhanced with dynamic date context
 */

import { readPromptFromFile, calculateDateRange } from './src/services/promptFileService-node.js';

async function testDynamicDateInjection() {
  console.log('🧪 Testing Dynamic Date Injection...\n');
  
  const timeframes = ['last_week', 'last_month', 'last_year', 'default'];
  
  for (const timeframe of timeframes) {
    console.log(`📅 Testing timeframe: ${timeframe}`);
    
    try {
      // Test date range calculation
      const dateRange = calculateDateRange(timeframe);
      console.log(`   📊 Date Range: ${dateRange.startDate} to ${dateRange.endDate}`);
      console.log(`   📊 Days Back: ${dateRange.daysBack}`);
      console.log(`   📊 Description: ${dateRange.description}`);
      
      // Test prompt reading with date injection
      const prompt = await readPromptFromFile(timeframe);
      
      // Check if dynamic date context was injected
      const hasDynamicContext = prompt.includes('DYNAMIC TIME CONTEXT - INJECTED');
      const hasCurrentDate = prompt.includes(dateRange.today);
      const hasDateRange = prompt.includes(dateRange.startDate) && prompt.includes(dateRange.endDate);
      
      console.log(`   ✅ Dynamic Context Injected: ${hasDynamicContext}`);
      console.log(`   ✅ Current Date Present: ${hasCurrentDate}`);
      console.log(`   ✅ Date Range Present: ${hasDateRange}`);
      console.log(`   📝 Prompt Length: ${prompt.length} characters`);
      
      // Show a snippet of the injected content
      const contextMatch = prompt.match(/### 📅 DYNAMIC TIME CONTEXT - INJECTED:[\s\S]*?(?=## 🏷️|### 🏷️|## 🎯|### 🎯)/);
      if (contextMatch) {
        console.log(`   📋 Injected Context Preview:`);
        console.log(`      ${contextMatch[0].split('\n').slice(0, 5).join('\n      ')}...`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ Error testing ${timeframe}:`, error.message);
      console.log('');
    }
  }
  
  console.log('✅ Dynamic Date Injection Test Complete!');
}

// Run the test
testDynamicDateInjection().catch(console.error);
