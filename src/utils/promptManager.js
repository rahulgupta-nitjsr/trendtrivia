/**
 * Prompt Manager Utility
 * Easy-to-use functions for managing AI prompts
 */

import { 
  getActivePrompt, 
  getAllPromptsForTopic, 
  createAndActivatePrompt, 
  activatePrompt,
  testPromptRetrieval,
  initializeDefaultPrompts
} from '../services/promptService.js';

/**
 * Test the entire prompt system
 * This function will:
 * 1. Initialize default prompts if needed
 * 2. Test prompt retrieval for all topics
 * 3. Display current active prompts
 */
export const testPromptSystem = async () => {
  console.log('🧪 Testing Prompt Management System...');
  
  try {
    // Step 1: Initialize default prompts
    console.log('📝 Initializing default prompts...');
    await initializeDefaultPrompts();
    
    // Step 2: Test prompt retrieval
    console.log('🔍 Testing prompt retrieval...');
    const testResults = await testPromptRetrieval();
    
    // Step 3: Display current active prompts
    console.log('📋 Current active prompts:');
    for (const [topic, result] of Object.entries(testResults)) {
      if (!result.error) {
        console.log(`  ${topic}: ${result.found ? '✅' : '❌'} (${result.source}, v${result.version}, ${result.length} chars)`);
      }
    }
    
    return {
      success: true,
      message: 'Prompt system is working correctly!',
      results: testResults
    };
    
  } catch (error) {
    console.error('❌ Prompt system test failed:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
};

/**
 * Show all prompts for a topic (for debugging/management)
 * @param {string} topic - Topic to show prompts for
 */
export const showPromptsForTopic = async (topic) => {
  try {
    console.log(`📋 All prompts for ${topic}:`);
    
    const prompts = await getAllPromptsForTopic(topic);
    
    if (prompts.length === 0) {
      console.log('  No prompts found for this topic.');
      return;
    }
    
    prompts.forEach((prompt, index) => {
      const status = prompt.isActive ? '🟢 ACTIVE' : '⚪ INACTIVE';
      const created = prompt.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown';
      
      console.log(`  ${index + 1}. ${status} v${prompt.version} (${created})`);
      console.log(`     ID: ${prompt.id}`);
      console.log(`     Description: ${prompt.description || 'No description'}`);
      console.log(`     Template length: ${prompt.template?.length || 0} characters`);
      console.log('');
    });
    
  } catch (error) {
    console.error(`Error showing prompts for ${topic}:`, error);
  }
};

/**
 * Update prompt for a topic (creates new version and activates it)
 * @param {string} topic - Topic to update prompt for
 * @param {string} newPromptText - New prompt template text
 * @param {string} description - Description of what this prompt does
 * @param {string} version - Version identifier (optional, will auto-increment if not provided)
 */
export const updatePromptForTopic = async (topic, newPromptText, description, version = null) => {
  try {
    console.log(`🔄 Updating prompt for ${topic}...`);
    
    // Auto-generate version if not provided
    if (!version) {
      const existingPrompts = await getAllPromptsForTopic(topic);
      const versions = existingPrompts
        .map(p => parseFloat(p.version))
        .filter(v => !isNaN(v))
        .sort((a, b) => b - a);
      
      const latestVersion = versions.length > 0 ? versions[0] : 1.0;
      version = (latestVersion + 0.1).toFixed(1);
    }
    
    // Create and activate the new prompt
    const promptId = await createAndActivatePrompt(
      topic,
      newPromptText,
      version,
      description,
      'user'
    );
    
    console.log(`✅ Successfully updated prompt for ${topic}`);
    console.log(`   New version: ${version}`);
    console.log(`   Prompt ID: ${promptId}`);
    
    return {
      success: true,
      promptId,
      version,
      topic
    };
    
  } catch (error) {
    console.error(`❌ Failed to update prompt for ${topic}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the current active prompt for a topic (for viewing/editing)
 * @param {string} topic - Topic to get prompt for
 */
export const getCurrentPrompt = async (topic) => {
  try {
    const prompt = await getActivePrompt(topic);
    
    if (!prompt) {
      console.log(`❌ No active prompt found for ${topic}`);
      return null;
    }
    
    console.log(`📄 Current active prompt for ${topic}:`);
    console.log(`   Version: ${prompt.version}`);
    console.log(`   Description: ${prompt.description || 'No description'}`);
    console.log(`   Created: ${prompt.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}`);
    console.log(`   Template length: ${prompt.template?.length || 0} characters`);
    console.log('');
    console.log('📝 Template:');
    console.log(prompt.template);
    
    return prompt;
    
  } catch (error) {
    console.error(`Error getting current prompt for ${topic}:`, error);
    return null;
  }
};

/**
 * Example usage functions (for demonstration)
 */
export const exampleUsage = {
  // Test the system
  test: () => testPromptSystem(),
  
  // View current prompt for technology
  viewTech: () => getCurrentPrompt('technology'),
  
  // View all prompts for sports
  viewAllSports: () => showPromptsForTopic('sports'),
  
  // Update technology prompt with a new version
  updateTech: (newPrompt, description) => updatePromptForTopic('technology', newPrompt, description),
  
  // Update sports prompt with a specific version
  updateSports: (newPrompt, description, version) => updatePromptForTopic('sports', newPrompt, description, version)
};

/**
 * Quick start guide
 */
export const quickStartGuide = () => {
  console.log(`
🚀 Prompt Management Quick Start Guide

1. Test the system:
   import { testPromptSystem } from './src/utils/promptManager.js';
   await testPromptSystem();

2. View current prompt:
   import { getCurrentPrompt } from './src/utils/promptManager.js';
   await getCurrentPrompt('technology');

3. Update a prompt:
   import { updatePromptForTopic } from './src/utils/promptManager.js';
   await updatePromptForTopic('technology', 'Your new prompt here', 'Description');

4. View all prompts for a topic:
   import { showPromptsForTopic } from './src/utils/promptManager.js';
   await showPromptsForTopic('sports');

📝 Your prompts are stored in Firestore and automatically versioned!
   You can modify them anytime without touching the code.
  `);
};

// Auto-display guide when this file is imported
console.log('📚 Prompt Manager loaded! Run quickStartGuide() for help.'); 