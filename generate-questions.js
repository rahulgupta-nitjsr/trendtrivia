#!/usr/bin/env node

/**
 * CLI Script for Batch Question Generation
 * 
 * Usage:
 *   node generate-questions.js
 * 
 * This script triggers question generation for all timeframes
 * with detailed reporting and automatic pauses.
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

// Check for required environment variables
function checkEnvironment() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Please create a .env file with your Firebase configuration.');
    console.error('📖 See BATCH_GENERATION_README.md for setup instructions.');
    process.exit(1);
  }
}

// Check environment before importing
checkEnvironment();

import { runBatchQuestionGeneration } from './src/utils/batchQuestionGenerator.js';

console.log('🎯 TRENDTRIVIA BATCH QUESTION GENERATOR');
console.log('='.repeat(50));
console.log('This script will generate questions for:');
console.log('• Last Week (5s pause)');
console.log('• Last Month (10s pause)');
console.log('• Last Year (15s pause)');
console.log('='.repeat(50));
console.log('');

// Run the batch generation
runBatchQuestionGeneration()
  .then(({ success, results, report }) => {
    console.log(`\n🎉 Batch generation ${success ? 'completed successfully' : 'completed with issues'}`);
    
    if (success) {
      console.log('✅ All timeframes processed successfully!');
    } else {
      console.log('⚠️ Some timeframes had issues. Check the report above for details.');
    }
    
    console.log('\n📄 A detailed report has been saved to a file for your reference.');
    console.log('💡 You can now use these questions in your TrendTrivia app!');
    
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Fatal error in batch generation:', error);
    console.error('Please check your configuration and try again.');
    process.exit(1);
  }); 