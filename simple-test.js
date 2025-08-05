/**
 * Simple test to check JSON import
 */

import fallbackData from './src/comprehensive-fallback-questions.json' assert { type: 'json' };

console.log('✅ JSON import successful!');
console.log(`📊 Total questions: ${fallbackData.metadata.totalQuestions}`);
console.log(`📋 Topics: ${fallbackData.metadata.topics.join(', ')}`);
console.log(`⏰ Timeframes: ${fallbackData.metadata.timeframes.join(', ')}`); 