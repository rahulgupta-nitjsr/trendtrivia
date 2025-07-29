/**
 * Automated Testing System
 * Runs all Phase 1 tests programmatically and reports results
 */

import { testPromptFileReading, getValidatedPrompt, validatePrompt } from '../services/promptFileService.js';
import { testFileBAsedGeneration } from '../services/aiContentService.js';

/**
 * Test Suite for Phase 1: File-Based Dynamic Prompt System
 */
class Phase1TestSuite {
  constructor() {
    this.results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      details: []
    };
  }

  /**
   * Add test result
   */
  addResult(testName, passed, details = {}) {
    this.results.totalTests++;
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    
    this.results.details.push({
      test: testName,
      status: passed ? 'PASS' : 'FAIL',
      timestamp: new Date().toISOString(),
      details
    });
    
    console.log(`${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
    if (!passed && details.error) {
      console.error('   Error:', details.error);
    }
  }

  /**
   * Test 1: Prompt File Reading
   */
  async testPromptFileReading() {
    try {
      const result = await testPromptFileReading();
      this.addResult('Prompt File Reading', result.success, result);
      return result.success;
    } catch (error) {
      this.addResult('Prompt File Reading', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 2: Prompt Content Validation
   */
  async testPromptValidation() {
    try {
      const prompt = await getValidatedPrompt();
      const validationResult = validatePrompt(prompt);
      
      const passed = validationResult.isValid && 
                     validationResult.details.topicsFound.length === 4 &&
                     prompt.length > 1000;
      
      this.addResult('Prompt Content Validation', passed, {
        promptLength: prompt.length,
        topicsFound: validationResult.details.topicsFound.length,
        validationErrors: validationResult.errors,
        validationWarnings: validationResult.warnings
      });
      
      return passed;
    } catch (error) {
      this.addResult('Prompt Content Validation', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 3: Required Topics Verification
   */
  async testRequiredTopics() {
    try {
      const prompt = await getValidatedPrompt();
      const requiredTopics = ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'];
      const foundTopics = requiredTopics.filter(topic => prompt.includes(topic));
      
      const passed = foundTopics.length === 4;
      
      this.addResult('Required Topics Verification', passed, {
        requiredTopics,
        foundTopics,
        missingTopics: requiredTopics.filter(topic => !foundTopics.includes(topic))
      });
      
      return passed;
    } catch (error) {
      this.addResult('Required Topics Verification', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 4: AI Generation Readiness
   */
  async testAIGenerationReadiness() {
    try {
      const result = await testFileBAsedGeneration();
      
      this.addResult('AI Generation Readiness', result.success, {
        promptLength: result.promptLength,
        promptValid: result.promptValid,
        readyForGeneration: result.readyForGeneration
      });
      
      return result.success;
    } catch (error) {
      this.addResult('AI Generation Readiness', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 5: File Accessibility
   */
  async testFileAccessibility() {
    try {
      const response = await fetch('/ai_components/ai_generation_prompt.md');
      const passed = response.ok && response.status === 200;
      
      this.addResult('File Accessibility', passed, {
        status: response.status,
        statusText: response.statusText,
        contentLength: passed ? (await response.text()).length : 0
      });
      
      return passed;
    } catch (error) {
      this.addResult('File Accessibility', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 6: Prompt Structure Validation
   */
  async testPromptStructure() {
    try {
      const prompt = await getValidatedPrompt();
      
      const requiredElements = ['JSON', 'question', 'options', 'answer', 'details', 'category', 'difficulty'];
      const foundElements = requiredElements.filter(element => 
        prompt.toLowerCase().includes(element.toLowerCase())
      );
      
      const hasQuantitySpec = prompt.includes('10') || prompt.includes('ten');
      const hasTotalSpec = prompt.includes('40') || prompt.includes('forty');
      
      const passed = foundElements.length === requiredElements.length && 
                     hasQuantitySpec && 
                     hasTotalSpec;
      
      this.addResult('Prompt Structure Validation', passed, {
        requiredElements,
        foundElements,
        missingElements: requiredElements.filter(e => !foundElements.includes(e)),
        hasQuantitySpec,
        hasTotalSpec
      });
      
      return passed;
    } catch (error) {
      this.addResult('Prompt Structure Validation', false, { error: error.message });
      return false;
    }
  }

  /**
   * Run all Phase 1 tests
   */
  async runAllTests() {
    console.log('🚀 Starting Automated Phase 1 Test Suite...\n');
    
    const startTime = Date.now();
    
    // Run all tests
    await this.testFileAccessibility();
    await this.testPromptFileReading();
    await this.testPromptValidation();
    await this.testRequiredTopics();
    await this.testPromptStructure();
    await this.testAIGenerationReadiness();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Generate final report
    const allTestsPassed = this.results.failed === 0;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 PHASE 1 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.results.totalTests}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Success Rate: ${((this.results.passed / this.results.totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! Phase 1 is ready for production.');
      console.log('✅ File-Based Dynamic Prompt System is fully functional.');
    } else {
      console.log('❌ Some tests failed. Phase 1 needs attention before proceeding.');
      console.log('\nFailed Tests:');
      this.results.details
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.test}: ${test.details.error || 'Unknown error'}`);
        });
    }
    
    console.log('\n📋 Detailed Test Results:');
    this.results.details.forEach(test => {
      console.log(`  ${test.status === 'PASS' ? '✅' : '❌'} ${test.test}`);
    });
    
    return {
      success: allTestsPassed,
      summary: {
        totalTests: this.results.totalTests,
        passed: this.results.passed,
        failed: this.results.failed,
        duration,
        successRate: (this.results.passed / this.results.totalTests) * 100
      },
      details: this.results.details
    };
  }
}

/**
 * Run Phase 1 automated tests
 */
export const runPhase1Tests = async () => {
  const testSuite = new Phase1TestSuite();
  return await testSuite.runAllTests();
};

/**
 * Auto-run tests when this module loads (for immediate feedback)
 */
let testResults = null;

const runTestsOnLoad = async () => {
  try {
    // Wait a bit for other modules to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔄 Auto-running Phase 1 tests...');
    testResults = await runPhase1Tests();
    
    // Make results available globally
    if (typeof window !== 'undefined') {
      window.phase1TestResults = testResults;
      window.runPhase1Tests = runPhase1Tests;
    }
    
  } catch (error) {
    console.error('❌ Auto-test execution failed:', error);
  }
};

// Auto-run tests
runTestsOnLoad();

export { testResults }; 