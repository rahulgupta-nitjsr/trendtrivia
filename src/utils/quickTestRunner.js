/**
 * Quick Test Runner
 * Executes tests immediately and provides instant feedback
 */

import { runComprehensiveTests } from './comprehensiveTestRunner.js';

/**
 * Quick test execution with immediate results
 */
export const runQuickTests = async () => {
  console.log('⚡ QUICK TEST EXECUTION STARTING...');
  console.log('='.repeat(60));
  
  try {
    const results = await runComprehensiveTests();
    
    // Quick summary
    console.log('\n⚡ QUICK TEST SUMMARY:');
    console.log('='.repeat(60));
    
    if (results.overall.success) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log(`✅ ${results.overall.passed}/${results.overall.totalTests} tests passed`);
      console.log('🚀 Ready for Phase 3');
    } else {
      console.log('❌ SOME TESTS FAILED');
      console.log(`⚠️ ${results.overall.failed}/${results.overall.totalTests} tests failed`);
      
      if (results.phase1 && !results.phase1.success) {
        console.log('   Phase 1 issues detected');
      }
      if (results.phase2 && !results.phase2.success) {
        console.log('   Phase 2 issues detected');
      }
    }
    
    console.log(`⏱️ Total duration: ${results.overall.duration}ms`);
    console.log('='.repeat(60));
    
    // Make results available globally
    if (typeof window !== 'undefined') {
      window.quickTestResults = results;
      window.runQuickTests = runQuickTests;
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Quick test execution failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Execute tests immediately
 */
const executeQuickTests = async () => {
  // Wait a bit for other modules to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔄 Executing quick tests...');
  await runQuickTests();
};

// Execute immediately
executeQuickTests();

export default runQuickTests; 