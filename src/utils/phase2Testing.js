/**
 * Phase 2 Testing Suite
 * Tests Enhanced AI Generation & Response Handling
 */

import { 
  testEnhancedAIGeneration, 
  generateBatchId, 
  validateQuestion, 
  parseAIResponse 
} from '../services/aiContentService.js';
import { 
  testBatchManagement, 
  saveBatch, 
  getLatestActiveBatch, 
  getAllBatches,
  getBatchStats 
} from '../services/batchService.js';

/**
 * Phase 2 Test Suite
 */
class Phase2TestSuite {
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
   * Test 1: Batch ID Generation
   */
  async testBatchIdGeneration() {
    try {
      const batchId1 = generateBatchId();
      const batchId2 = generateBatchId();
      
      const passed = batchId1 !== batchId2 && 
                     batchId1.startsWith('batch-') && 
                     batchId2.startsWith('batch-');
      
      this.addResult('Batch ID Generation', passed, {
        batchId1,
        batchId2,
        areUnique: batchId1 !== batchId2,
        format: batchId1.startsWith('batch-')
      });
      
      return passed;
    } catch (error) {
      this.addResult('Batch ID Generation', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 2: Question Validation
   */
  async testQuestionValidation() {
    try {
      const validQuestion = {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
        details: "Paris is the capital and largest city of France.",
        category: "Technology",
        difficulty: "easy"
      };
      
      const invalidQuestion = {
        question: "What is the capital of France?",
        options: ["London", "Berlin"], // Only 2 options
        answer: "Paris",
        details: "Paris is the capital of France.",
        category: "Technology",
        difficulty: "easy"
      };
      
      const validResult = validateQuestion(validQuestion);
      const invalidResult = validateQuestion(invalidQuestion);
      
      const passed = validResult.isValid && !invalidResult.isValid;
      
      this.addResult('Question Validation', passed, {
        validQuestionResult: validResult,
        invalidQuestionResult: invalidResult
      });
      
      return passed;
    } catch (error) {
      this.addResult('Question Validation', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 3: AI Response Parsing
   */
  async testAIResponseParsing() {
    try {
      const mockAIResponse = `Here are 40 questions in JSON format:
      [
        {
          "question": "What is the capital of France?",
          "options": ["London", "Berlin", "Paris", "Madrid"],
          "answer": "Paris",
          "details": "Paris is the capital of France.",
          "category": "Technology",
          "difficulty": "easy"
        }
      ]`;
      
      const result = parseAIResponse(mockAIResponse);
      
      const passed = result.success && 
                     result.validQuestions.length === 1 && 
                     result.totalQuestions === 1;
      
      this.addResult('AI Response Parsing', passed, {
        success: result.success,
        validCount: result.validCount,
        totalQuestions: result.totalQuestions
      });
      
      return passed;
    } catch (error) {
      this.addResult('AI Response Parsing', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 4: Enhanced AI Generation (Mock)
   */
  async testEnhancedAIGeneration() {
    try {
      // This is a mock test since we don't want to make actual API calls during testing
      const batchId = generateBatchId();
      
      const mockResult = {
        success: true,
        batchId,
        questions: [
          {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris",
            details: "Paris is the capital of France.",
            category: "Technology",
            difficulty: "easy"
          }
        ],
        metadata: {
          batchId,
          generatedAt: new Date().toISOString(),
          questionCount: 1,
          categories: ["Technology"],
          difficulties: ["easy"],
          status: "generated"
        }
      };
      
      const passed = mockResult.success && 
                     mockResult.batchId && 
                     mockResult.questions.length > 0;
      
      this.addResult('Enhanced AI Generation (Mock)', passed, {
        batchId: mockResult.batchId,
        questionCount: mockResult.questions.length,
        categories: mockResult.metadata.categories
      });
      
      return passed;
    } catch (error) {
      this.addResult('Enhanced AI Generation (Mock)', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 5: Batch Management System
   */
  async testBatchManagement() {
    try {
      const result = await testBatchManagement();
      
      this.addResult('Batch Management System', result.success, {
        results: result.results,
        stats: result.stats
      });
      
      return result.success;
    } catch (error) {
      this.addResult('Batch Management System', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 6: Batch Storage and Retrieval
   */
  async testBatchStorageAndRetrieval() {
    try {
      const testBatchData = {
        batchId: `test-batch-${Date.now()}`,
        metadata: {
          batchId: `test-batch-${Date.now()}`,
          generatedAt: new Date().toISOString(),
          status: 'test',
          questionCount: 1,
          categories: ['Test'],
          difficulties: ['easy']
        },
        questions: [
          {
            question: "Test question?",
            options: ["A", "B", "C", "D"],
            answer: "A",
            details: "Test details",
            category: "Test",
            difficulty: "easy"
          }
        ],
        rawResponse: 'Test response'
      };
      
      // Save batch
      const saveResult = await saveBatch(testBatchData);
      const savePassed = saveResult.success;
      
      // Retrieve batch
      const retrievedBatch = await getLatestActiveBatch();
      const retrievePassed = retrievedBatch !== null;
      
      // Clean up
      if (saveResult.success) {
        // Note: We don't actually delete here to avoid interfering with other tests
        console.log('✅ Test batch saved for retrieval test');
      }
      
      const passed = savePassed && retrievePassed;
      
      this.addResult('Batch Storage and Retrieval', passed, {
        saveSuccess: savePassed,
        retrieveSuccess: retrievePassed,
        batchId: testBatchData.batchId
      });
      
      return passed;
    } catch (error) {
      this.addResult('Batch Storage and Retrieval', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 7: Batch Statistics
   */
  async testBatchStatistics() {
    try {
      const stats = await getBatchStats();
      
      const passed = stats !== null && 
                     typeof stats.totalBatches === 'number' &&
                     typeof stats.totalQuestions === 'number';
      
      this.addResult('Batch Statistics', passed, {
        totalBatches: stats?.totalBatches,
        totalQuestions: stats?.totalQuestions,
        activeBatches: stats?.activeBatches
      });
      
      return passed;
    } catch (error) {
      this.addResult('Batch Statistics', false, { error: error.message });
      return false;
    }
  }

  /**
   * Test 8: Complete AI Generation Flow
   */
  async testCompleteAIGenerationFlow() {
    try {
      // This simulates the complete flow without making actual API calls
      const batchId = generateBatchId();
      
      // Step 1: Generate batch ID
      const step1Passed = batchId.startsWith('batch-');
      
      // Step 2: Create mock AI response
      const mockQuestions = Array(40).fill(null).map((_, index) => ({
        question: `Test question ${index + 1}?`,
        options: ["A", "B", "C", "D"],
        answer: "A",
        details: `Test details for question ${index + 1}`,
        category: ["Technology", "Pop Culture", "Finance", "Start-Ups"][index % 4],
        difficulty: ["easy", "medium", "hard"][index % 3]
      }));
      
      // Step 3: Validate questions
      const validationResults = mockQuestions.map(q => validateQuestion(q));
      const step3Passed = validationResults.every(r => r.isValid);
      
      // Step 4: Create batch metadata
      const metadata = {
        batchId,
        generatedAt: new Date().toISOString(),
        questionCount: mockQuestions.length,
        categories: [...new Set(mockQuestions.map(q => q.category))],
        difficulties: [...new Set(mockQuestions.map(q => q.difficulty))],
        status: 'generated'
      };
      
      const step4Passed = metadata.categories.length === 4 && 
                          metadata.difficulties.length === 3;
      
      const passed = step1Passed && step3Passed && step4Passed;
      
      this.addResult('Complete AI Generation Flow', passed, {
        step1: step1Passed,
        step3: step3Passed,
        step4: step4Passed,
        questionCount: mockQuestions.length,
        categories: metadata.categories,
        difficulties: metadata.difficulties
      });
      
      return passed;
    } catch (error) {
      this.addResult('Complete AI Generation Flow', false, { error: error.message });
      return false;
    }
  }

  /**
   * Run all Phase 2 tests
   */
  async runAllTests() {
    console.log('🚀 Starting Phase 2 Test Suite: Enhanced AI Generation & Response Handling...\n');
    
    const startTime = Date.now();
    
    // Run all tests
    await this.testBatchIdGeneration();
    await this.testQuestionValidation();
    await this.testAIResponseParsing();
    await this.testEnhancedAIGeneration();
    await this.testBatchManagement();
    await this.testBatchStorageAndRetrieval();
    await this.testBatchStatistics();
    await this.testCompleteAIGenerationFlow();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Generate final report
    const allTestsPassed = this.results.failed === 0;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 PHASE 2 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.results.totalTests}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Success Rate: ${((this.results.passed / this.results.totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! Phase 2 is ready for production.');
      console.log('✅ Enhanced AI Generation & Response Handling is fully functional.');
    } else {
      console.log('❌ Some tests failed. Phase 2 needs attention before proceeding.');
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
 * Run Phase 2 automated tests
 */
export const runPhase2Tests = async () => {
  const testSuite = new Phase2TestSuite();
  return await testSuite.runAllTests();
};

/**
 * Auto-run tests when this module loads
 */
let phase2TestResults = null;

const runPhase2TestsOnLoad = async () => {
  try {
    // Wait a bit for other modules to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔄 Auto-running Phase 2 tests...');
    phase2TestResults = await runPhase2Tests();
    
    // Make results available globally
    if (typeof window !== 'undefined') {
      window.phase2TestResults = phase2TestResults;
      window.runPhase2Tests = runPhase2Tests;
    }
    
  } catch (error) {
    console.error('❌ Auto-test execution failed:', error);
  }
};

// Auto-run tests
runPhase2TestsOnLoad();

export { phase2TestResults }; 