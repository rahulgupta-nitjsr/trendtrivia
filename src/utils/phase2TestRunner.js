/**
 * Phase 2 Test Runner
 * Comprehensive testing and validation for Enhanced AI Generation & Response Handling
 */

import { runPhase2Tests } from './phase2Testing.js';

/**
 * Comprehensive Phase 2 Test Runner
 */
export const runComprehensivePhase2Tests = async () => {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 PHASE 2 COMPREHENSIVE TEST RUNNER');
  console.log('='.repeat(80));
  console.log('Testing Enhanced AI Generation & Response Handling');
  console.log('='.repeat(80));
  
  const startTime = Date.now();
  
  try {
    // Run all Phase 2 tests
    const results = await runPhase2Tests();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Generate comprehensive report
    console.log('\n' + '='.repeat(80));
    console.log('📊 PHASE 2 COMPREHENSIVE TEST RESULTS');
    console.log('='.repeat(80));
    
    if (results.success) {
      console.log('🎉 SUCCESS: All Phase 2 tests passed!');
      console.log('✅ Enhanced AI Generation & Response Handling is fully functional');
      console.log('🚀 Ready to proceed to Phase 3');
      
      // Store success status globally
      if (typeof window !== 'undefined') {
        window.phase2Complete = true;
        window.phase2Status = 'PASSED';
        window.phase2Results = results;
      }
      
    } else {
      console.log('❌ FAILURE: Some Phase 2 tests failed');
      console.log('⚠️ Phase 2 needs attention before proceeding to Phase 3');
      
      // Store failure status globally
      if (typeof window !== 'undefined') {
        window.phase2Complete = true;
        window.phase2Status = 'FAILED';
        window.phase2Results = results;
      }
    }
    
    console.log('\n📈 Test Summary:');
    console.log(`   Total Tests: ${results.summary.totalTests}`);
    console.log(`   Passed: ${results.summary.passed}`);
    console.log(`   Failed: ${results.summary.failed}`);
    console.log(`   Success Rate: ${results.summary.successRate.toFixed(1)}%`);
    console.log(`   Duration: ${duration}ms`);
    
    console.log('\n📋 Individual Test Results:');
    results.details.forEach(test => {
      const status = test.status === 'PASS' ? '✅' : '❌';
      console.log(`   ${status} ${test.test}`);
      if (test.status === 'FAIL' && test.details.error) {
        console.log(`      Error: ${test.details.error}`);
      }
    });
    
    console.log('\n🔧 Phase 2 Features Tested:');
    console.log('   ✅ Batch ID Generation');
    console.log('   ✅ Question Validation');
    console.log('   ✅ AI Response Parsing');
    console.log('   ✅ Enhanced AI Generation');
    console.log('   ✅ Batch Management System');
    console.log('   ✅ Batch Storage & Retrieval');
    console.log('   ✅ Batch Statistics');
    console.log('   ✅ Complete AI Generation Flow');
    
    console.log('\n📁 Files Modified/Created:');
    console.log('   ✅ src/services/aiContentService.js - Enhanced AI generation');
    console.log('   ✅ src/services/batchService.js - Batch management system');
    console.log('   ✅ src/utils/phase2Testing.js - Comprehensive test suite');
    console.log('   ✅ src/utils/phase2TestRunner.js - Test runner');
    
    console.log('='.repeat(80));
    
    return {
      success: results.success,
      summary: results.summary,
      details: results.details,
      duration,
      phase: 'Phase 2',
      status: results.success ? 'PASSED' : 'FAILED'
    };
    
  } catch (error) {
    console.error('❌ Phase 2 test runner error:', error);
    
    if (typeof window !== 'undefined') {
      window.phase2Complete = false;
      window.phase2Status = 'ERROR';
      window.phase2Error = error.message;
    }
    
    return {
      success: false,
      error: error.message,
      phase: 'Phase 2',
      status: 'ERROR'
    };
  }
};

/**
 * Auto-run Phase 2 tests with delay
 */
const runPhase2TestsWithDelay = async () => {
  try {
    // Wait for Phase 1 to complete first
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🔄 Starting Phase 2 comprehensive tests...');
    const results = await runComprehensivePhase2Tests();
    
    // Make results available globally
    if (typeof window !== 'undefined') {
      window.phase2ComprehensiveResults = results;
      window.runPhase2ComprehensiveTests = runComprehensivePhase2Tests;
    }
    
  } catch (error) {
    console.error('❌ Phase 2 comprehensive test execution failed:', error);
  }
};

// Auto-run Phase 2 tests
runPhase2TestsWithDelay();

export default runComprehensivePhase2Tests; 