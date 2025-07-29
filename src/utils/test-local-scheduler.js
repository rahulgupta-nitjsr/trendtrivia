/**
 * Test script for Local Scheduler
 * Run this in browser console to test the local scheduler
 */

const testLocalScheduler = async () => {
  console.log('🧪 Testing Local Scheduler...');
  
  try {
    // Test 1: Check if functions are available
    const functionsAvailable = {
      triggerLocalManualGeneration: typeof window.triggerLocalManualGeneration === 'function',
      getLocalSchedulerStatus: typeof window.getLocalSchedulerStatus === 'function',
      executeLocalGeneration: typeof window.executeLocalGeneration === 'function',
      setLocalManualTriggerEnabled: typeof window.setLocalManualTriggerEnabled === 'function'
    };
    
    console.log('✅ Functions available:', functionsAvailable);
    
    // Test 2: Check initial status
    const status = window.getLocalSchedulerStatus();
    console.log('📊 Initial status:', status);
    
    // Test 3: Check localStorage state
    const localStorageState = localStorage.getItem('trendtrivia_scheduler_state');
    console.log('💾 localStorage state:', localStorageState ? JSON.parse(localStorageState) : 'None');
    
    // Test 4: Test manual trigger (if not recently generated)
    if (status.canGenerate) {
      console.log('🔄 Testing manual generation...');
      const result = await window.triggerLocalManualGeneration();
      console.log('📝 Manual generation result:', result);
    } else {
      console.log('⏸️ Skipping manual generation test (recent generation detected)');
    }
    
    console.log('🎉 Local scheduler test completed!');
    
    return {
      success: true,
      functionsAvailable,
      status,
      localStorageState: localStorageState ? JSON.parse(localStorageState) : null
    };
    
  } catch (error) {
    console.error('❌ Local scheduler test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run test if this script is executed directly
if (typeof window !== 'undefined') {
  // Make test available globally
  window.testLocalScheduler = testLocalScheduler;
  console.log('🧪 Local scheduler test loaded. Run: window.testLocalScheduler()');
}

export { testLocalScheduler }; 