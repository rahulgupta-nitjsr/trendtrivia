/**
 * Test Results Checker
 * Monitors and reports on automated test execution
 */

/**
 * Check if Phase 1 tests have completed and report results
 */
export const checkPhase1TestResults = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (window.phase1TestResults) {
        clearInterval(checkInterval);
        
        const results = window.phase1TestResults;
        
        console.log('\n' + '='.repeat(80));
        console.log('🔍 AUTOMATED TEST RESULTS CHECKER');
        console.log('='.repeat(80));
        
        if (results.success) {
          console.log('🎉 SUCCESS: All Phase 1 tests passed!');
          console.log('✅ File-Based Dynamic Prompt System is fully functional');
          console.log('🚀 Ready to proceed to Phase 2');
        } else {
          console.log('❌ FAILURE: Some Phase 1 tests failed');
          console.log('⚠️ Phase 1 needs attention before proceeding to Phase 2');
        }
        
        console.log('\n📊 Test Summary:');
        console.log(`   Total Tests: ${results.summary.totalTests}`);
        console.log(`   Passed: ${results.summary.passed}`);
        console.log(`   Failed: ${results.summary.failed}`);
        console.log(`   Success Rate: ${results.summary.successRate.toFixed(1)}%`);
        console.log(`   Duration: ${results.summary.duration}ms`);
        
        console.log('\n📋 Individual Test Results:');
        results.details.forEach(test => {
          const status = test.status === 'PASS' ? '✅' : '❌';
          console.log(`   ${status} ${test.test}`);
          if (test.status === 'FAIL' && test.details.error) {
            console.log(`      Error: ${test.details.error}`);
          }
        });
        
        console.log('='.repeat(80));
        
        resolve(results);
      }
    }, 1000);
    
    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log('⏰ Timeout: Test results not available after 30 seconds');
      resolve(null);
    }, 30000);
  });
};

/**
 * Auto-check results when this module loads
 */
const autoCheck = async () => {
  console.log('🔄 Waiting for automated test results...');
  
  const results = await checkPhase1TestResults();
  
  if (results) {
    // Make a final determination
    if (results.success) {
      console.log('\n🎯 FINAL DETERMINATION: Phase 1 PASSED - Ready for Phase 2');
      
      // Store the final result
      window.phase1Complete = true;
      window.phase1Status = 'PASSED';
    } else {
      console.log('\n🎯 FINAL DETERMINATION: Phase 1 FAILED - Needs attention');
      
      window.phase1Complete = true;
      window.phase1Status = 'FAILED';
    }
  } else {
    console.log('\n🎯 FINAL DETERMINATION: Unable to determine Phase 1 status');
    window.phase1Complete = false;
    window.phase1Status = 'UNKNOWN';
  }
};

// Start auto-checking after a delay
setTimeout(autoCheck, 5000);

export default checkPhase1TestResults; 