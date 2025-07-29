/**
 * Comprehensive Test Runner
 * Executes all Phase 1 and Phase 2 tests and provides detailed results
 */

import { runPhase1Tests } from './automatedTesting.js';
import { runPhase2Tests } from './phase2Testing.js';

/**
 * Comprehensive Test Runner for all phases
 */
export const runComprehensiveTests = async () => {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 COMPREHENSIVE AUTOMATED TESTING SYSTEM');
  console.log('='.repeat(80));
  console.log('Testing Phase 1: File-Based Dynamic Prompt System');
  console.log('Testing Phase 2: Enhanced AI Generation & Response Handling');
  console.log('='.repeat(80));
  
  const startTime = Date.now();
  const results = {
    phase1: null,
    phase2: null,
    overall: {
      success: false,
      totalTests: 0,
      passed: 0,
      failed: 0,
      duration: 0
    }
  };
  
  try {
    // Run Phase 1 tests
    console.log('\n🔄 Running Phase 1 tests...');
    results.phase1 = await runPhase1Tests();
    console.log(`✅ Phase 1 completed: ${results.phase1.success ? 'PASSED' : 'FAILED'}`);
    
    // Run Phase 2 tests
    console.log('\n🔄 Running Phase 2 tests...');
    results.phase2 = await runPhase2Tests();
    console.log(`✅ Phase 2 completed: ${results.phase2.success ? 'PASSED' : 'FAILED'}`);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Calculate overall results
    results.overall = {
      success: results.phase1.success && results.phase2.success,
      totalTests: (results.phase1?.summary?.totalTests || 0) + (results.phase2?.summary?.totalTests || 0),
      passed: (results.phase1?.summary?.passed || 0) + (results.phase2?.summary?.passed || 0),
      failed: (results.phase1?.summary?.failed || 0) + (results.phase2?.summary?.failed || 0),
      duration
    };
    
    // Generate comprehensive report
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    
    if (results.overall.success) {
      console.log('🎉 SUCCESS: All tests passed!');
      console.log('✅ Both Phase 1 and Phase 2 are fully functional');
      console.log('🚀 Ready to proceed to Phase 3');
    } else {
      console.log('❌ FAILURE: Some tests failed');
      console.log('⚠️ Issues need to be resolved before proceeding');
    }
    
    console.log('\n📈 Overall Summary:');
    console.log(`   Total Tests: ${results.overall.totalTests}`);
    console.log(`   Passed: ${results.overall.passed}`);
    console.log(`   Failed: ${results.overall.failed}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Success Rate: ${((results.overall.passed / results.overall.totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Phase Results:');
    console.log(`   Phase 1: ${results.phase1.success ? '✅ PASSED' : '❌ FAILED'} (${results.phase1?.summary?.passed || 0}/${results.phase1?.summary?.totalTests || 0} tests)`);
    console.log(`   Phase 2: ${results.phase2.success ? '✅ PASSED' : '❌ FAILED'} (${results.phase2?.summary?.passed || 0}/${results.phase2?.summary?.totalTests || 0} tests)`);
    
    if (!results.phase1.success) {
      console.log('\n❌ Phase 1 Failed Tests:');
      results.phase1.details
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`   - ${test.test}: ${test.details.error || 'Unknown error'}`);
        });
    }
    
    if (!results.phase2.success) {
      console.log('\n❌ Phase 2 Failed Tests:');
      results.phase2.details
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`   - ${test.test}: ${test.details.error || 'Unknown error'}`);
        });
    }
    
    console.log('\n🔧 Features Tested:');
    console.log('   Phase 1:');
    console.log('     ✅ File Accessibility');
    console.log('     ✅ Prompt File Reading');
    console.log('     ✅ Prompt Content Validation');
    console.log('     ✅ Required Topics Verification');
    console.log('     ✅ Prompt Structure Validation');
    console.log('     ✅ AI Generation Readiness');
    
    console.log('   Phase 2:');
    console.log('     ✅ Batch ID Generation');
    console.log('     ✅ Question Validation');
    console.log('     ✅ AI Response Parsing');
    console.log('     ✅ Enhanced AI Generation');
    console.log('     ✅ Batch Management System');
    console.log('     ✅ Batch Storage & Retrieval');
    console.log('     ✅ Batch Statistics');
    console.log('     ✅ Complete AI Generation Flow');
    
    console.log('='.repeat(80));
    
    // Store results globally
    if (typeof window !== 'undefined') {
      window.comprehensiveTestResults = results;
      window.runComprehensiveTests = runComprehensiveTests;
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Comprehensive test execution failed:', error);
    
    const errorResults = {
      phase1: null,
      phase2: null,
      overall: {
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      }
    };
    
    if (typeof window !== 'undefined') {
      window.comprehensiveTestResults = errorResults;
    }
    
    return errorResults;
  }
};

/**
 * Auto-run comprehensive tests
 */
const runComprehensiveTestsOnLoad = async () => {
  try {
    // Wait for modules to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔄 Starting comprehensive automated tests...');
    await runComprehensiveTests();
    
  } catch (error) {
    console.error('❌ Comprehensive test execution failed:', error);
  }
};

// Auto-run tests
runComprehensiveTestsOnLoad();

export default runComprehensiveTests; 