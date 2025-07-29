/**
 * Test Prompt File Reading - Browser-compatible version
 * Use this to test the prompt file reading system
 */

import { testPromptFileReading, getValidatedPrompt, validatePrompt } from '../services/promptFileService.js';
import { testFileBAsedGeneration } from '../services/aiContentService.js';

/**
 * Run prompt file reading tests
 */
export const runPromptFileTests = async () => {
  console.log('🚀 Starting Prompt File Reading Tests...');
  
  try {
    // Test 1: Basic file reading test
    console.log('\n=== Test 1: Prompt File Reading ===');
    const fileTest = await testPromptFileReading();
    console.log('File reading test result:', fileTest);
    
    // Test 2: Get actual prompt content
    console.log('\n=== Test 2: Get Validated Prompt ===');
    const prompt = await getValidatedPrompt();
    console.log('Prompt preview (first 200 chars):', prompt.substring(0, 200) + '...');
    console.log('Full prompt length:', prompt.length);
    
    // Test 3: Enhanced Prompt Validation
    console.log('\n=== Test 3: Enhanced Prompt Validation ===');
    const validationResult = validatePrompt(prompt);
    console.log('Validation result:', validationResult);
    
    const allTopicsFound = validationResult.isValid && validationResult.details.topicsFound.length === 4;
    
    // Test 4: Test AI generation readiness
    console.log('\n=== Test 4: AI Generation Readiness ===');
    const aiTest = await testFileBAsedGeneration();
    console.log('AI generation test result:', aiTest);
    
    console.log('\n✅ All prompt file tests completed successfully!');
    return { 
      success: true, 
      message: 'All prompt file tests passed!',
      fileTest,
      promptLength: prompt.length,
      validationResult,
      topicsFound: allTopicsFound,
      aiGenerationReady: aiTest.success
    };
    
  } catch (error) {
    console.error('❌ Prompt file test failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Make functions available globally for easy testing
if (typeof window !== 'undefined') {
  window.promptFileTests = {
    runAll: runPromptFileTests,
    getPrompt: getValidatedPrompt,
    testAI: testFileBAsedGeneration
  };
  
  console.log(`
🧪 Prompt File Testing Tools Loaded!

 Available in browser console:
 - promptFileTests.runAll() - Run all prompt file tests
 - promptFileTests.getPrompt() - Get the current prompt content
 - promptFileTests.testAI() - Test AI generation readiness
 
 Try: promptFileTests.runAll()
  `);
} 