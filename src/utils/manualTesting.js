/**
 * Manual Testing Utility for TrendTrivia
 * Access testing functions through browser console without automatic execution
 */

import { testFirestoreConnection } from './firestoreTest';
import { testPerplexityConnection, generateQuestionsForTimeframe } from '../services/aiContentService';
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

  // AI Generation triggers
  async generateLastMonth() {
    console.log('📅 Generating questions for last month...');
    try {
      const result = await generateQuestionsForTimeframe('last_month', {
        trigger: 'manual_last_month',
        batchId: `manual-${Date.now()}`
      });
      console.log('✅ Last month generation completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Last month generation failed:', error);
      throw error;
    }
  },

  async generateLastWeek() {
    console.log('📅 Generating questions for last week...');
    try {
      const result = await generateQuestionsForTimeframe('last_week', {
        trigger: 'manual_last_week',
        batchId: `manual-${Date.now()}`
      });
      console.log('✅ Last week generation completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Last week generation failed:', error);
      throw error;
    }
  },

  async generateLastYear() {
    console.log('📅 Generating questions for last year...');
    try {
      const result = await generateQuestionsForTimeframe('last_year', {
        trigger: 'manual_last_year',
        batchId: `manual-${Date.now()}`
      });
      console.log('✅ Last year generation completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Last year generation failed:', error);
      throw error;
    }
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

🤖 AI Generation Commands:
- TrendTriviaTests.generateLastMonth() - Generate questions for last month
- TrendTriviaTests.generateLastWeek()  - Generate questions for last week  
- TrendTriviaTests.generateLastYear()  - Generate questions for last year

- TrendTriviaTests.help()             - Show this help

Examples: 
  TrendTriviaTests.setupDev()
  TrendTriviaTests.generateLastMonth()
    `);
  }
};

// Make available globally for manual access
if (typeof window !== 'undefined') {
  window.TrendTriviaTests = manualTests;
  
  // Add quick global functions for common operations
  window.generateLastMonthQuestions = () => manualTests.generateLastMonth();
  window.generateLastWeekQuestions = () => manualTests.generateLastWeek();
  window.generateLastYearQuestions = () => manualTests.generateLastYear();
  
  console.log('🧪 Manual testing available! Run: TrendTriviaTests.help()');
  console.log('🚀 Quick commands: generateLastMonthQuestions(), generateLastWeekQuestions(), generateLastYearQuestions()');
}

export default manualTests; 