/**
 * Test Prompts - Browser-compatible version
 * Use this in your browser console or add to a component
 */

import { 
  testPromptSystem, 
  getCurrentPrompt, 
  updatePromptForTopic, 
  showPromptsForTopic 
} from './promptManager.js';

/**
 * Run all prompt tests in the browser
 */
export const runPromptTests = async () => {
  console.log('🚀 Starting Prompt System Tests...');
  
  try {
    // Test 1: Initialize and test the system
    console.log('\n=== Test 1: System Initialization ===');
    const systemTest = await testPromptSystem();
    console.log('System test result:', systemTest);
    
    // Test 2: Get current prompts
    console.log('\n=== Test 2: Current Active Prompts ===');
    const techPrompt = await getCurrentPrompt('technology');
    const sportsPrompt = await getCurrentPrompt('sports');
    
    // Test 3: Show all prompts for a topic
    console.log('\n=== Test 3: All Prompts for Technology ===');
    await showPromptsForTopic('technology');
    
    console.log('\n✅ All tests completed successfully!');
    return { success: true, message: 'All prompt tests passed!' };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Example: Update a prompt
 */
export const exampleUpdatePrompt = async () => {
  const newTechPrompt = `
Use your real-time web access to generate 10 multiple-choice quiz questions about the most recent technology trends and news from the past week.

UPDATED VERSION - Now includes more focus on AI and emerging technologies!

IMPORTANT: Search for and use only the latest information from the past 7 days.

Requirements:
- Focus on breaking tech news, AI breakthroughs, product launches, company announcements, and industry trends from THIS WEEK
- Special emphasis on AI/ML developments, blockchain, cybersecurity, and startup news
- Use your web search capabilities to find current, factual information
- Mix of difficulty levels: 3 Easy, 4 Medium, 3 Hard
- Each question should have 4 options (A, B, C, D) with only one correct answer
- Include a brief explanation for each correct answer

Format each question as JSON:
{
  "question": "Question text here?",
  "options": [
    {"id": "A", "text": "Option A", "isCorrect": false},
    {"id": "B", "text": "Option B", "isCorrect": true},
    {"id": "C", "text": "Option C", "isCorrect": false},
    {"id": "D", "text": "Option D", "isCorrect": false}
  ],
  "difficulty": "Easy|Medium|Hard",
  "explanation": "Brief explanation of why this answer is correct",
  "source": "Recent tech news from [specific source/date]",
  "topic": "Technology"
}

Return only a valid JSON array of 10 questions. Do not include any text outside the JSON array.
  `.trim();
  
  const result = await updatePromptForTopic(
    'technology',
    newTechPrompt,
    'Updated version with more AI focus and better structure'
  );
  
  console.log('Update result:', result);
  return result;
};

// Make functions available globally for easy testing
if (typeof window !== 'undefined') {
  window.promptTests = {
    runAll: runPromptTests,
    updateExample: exampleUpdatePrompt,
    getCurrentPrompt,
    updatePrompt: updatePromptForTopic,
    showAllPrompts: showPromptsForTopic
  };
  
  console.log(`
🧪 Prompt Testing Tools Loaded!

Available in browser console:
- promptTests.runAll() - Run all tests
- promptTests.getCurrentPrompt('technology') - View current prompt
- promptTests.updatePrompt('topic', 'newPrompt', 'description') - Update a prompt
- promptTests.showAllPrompts('technology') - Show all prompts for topic
- promptTests.updateExample() - Example prompt update

Try: promptTests.runAll()
  `);
} 