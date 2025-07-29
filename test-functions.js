/**
 * Test script for Firebase Cloud Functions
 * Run this after deployment to verify everything works
 */

const testFunctions = async () => {
  console.log('🧪 Testing Firebase Cloud Functions...');
  
  try {
    // Test the manual generation function
    const response = await fetch('http://localhost:5001/trendtrivia-9019c/us-central1/testGeneration');
    const result = await response.json();
    
    console.log('✅ Test function response:', result);
    
    if (result.success) {
      console.log('🎉 Functions are working correctly!');
    } else {
      console.log('❌ Function test failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing functions:', error.message);
    console.log('💡 Make sure the Firebase emulator is running: firebase emulators:start --only functions');
  }
};

// Run test if this script is executed directly
if (typeof window === 'undefined') {
  testFunctions();
}

module.exports = { testFunctions }; 