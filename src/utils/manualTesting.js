/**
 * Manual Testing Utility for TrendTrivia
 * Access testing functions through browser console without automatic execution
 */

import { testFirestoreConnection } from './firestoreTest';
import { testPerplexityConnection } from '../services/aiContentService';
import { initializeLocalScheduler } from '../services/localSchedulerService';
import { seedFirestore, checkFirestoreData } from './seedFirestore';

/**
 * Manual Testing Interface
 * Available in browser console as window.TrendTriviaTests
 */
const manualTests = {
  // Core service tests
  async testFirebase() {
    console.log('🔥 Testing Firebase connection...');
    await testFirestoreConnection();
  },

  async testPerplexity() {
    console.log('🤖 Testing Perplexity AI connection...');
    await testPerplexityConnection();
  },

  async initScheduler() {
    console.log('📅 Initializing local scheduler...');
    initializeLocalScheduler();
  },

  // Firestore data management
  async checkData() {
    console.log('📊 Checking Firestore data...');
    return await checkFirestoreData();
  },

  async seedData() {
    console.log('🌱 Seeding Firestore with sample questions...');
    return await seedFirestore();
  },

  // Run all core tests
  async runCoreTests() {
    console.log('🧪 Running all core tests...');
    await this.testFirebase();
    await this.testPerplexity();
    await this.initScheduler();
    console.log('✅ Core tests completed');
  },

  // Full setup for development
  async setupDev() {
    console.log('🚀 Setting up development environment...');
    await this.testFirebase();
    const dataCheck = await this.checkData();
    if (!dataCheck.hasData) {
      console.log('📝 No data found, seeding Firestore...');
      await this.seedData();
    }
    console.log('✅ Development setup completed');
  },

  // Help function
  help() {
    console.log(`
🧪 TrendTrivia Manual Testing

Available commands:
- TrendTriviaTests.testFirebase()     - Test Firebase connection
- TrendTriviaTests.testPerplexity()   - Test Perplexity AI connection  
- TrendTriviaTests.initScheduler()    - Initialize local scheduler
- TrendTriviaTests.checkData()        - Check Firestore data
- TrendTriviaTests.seedData()         - Seed Firestore with sample questions
- TrendTriviaTests.runCoreTests()     - Run all core tests
- TrendTriviaTests.setupDev()         - Full development setup
- TrendTriviaTests.help()             - Show this help

Example: TrendTriviaTests.setupDev()
    `);
  }
};

// Make available globally for manual access
if (typeof window !== 'undefined') {
  window.TrendTriviaTests = manualTests;
  console.log('🧪 Manual testing available! Run: TrendTriviaTests.help()');
}

export default manualTests; 