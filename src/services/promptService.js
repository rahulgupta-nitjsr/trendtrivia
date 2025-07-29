/**
 * Prompt Management Service
 * Handles AI prompt templates, versioning, and storage
 */

import { db } from '../config/firebase.js';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';

// Default prompt templates optimized for Perplexity AI
const DEFAULT_PROMPTS = {
  technology: {
    id: 'tech-perplexity-v1',
    version: '1.0',
    description: 'Technology trends and news from the past week',
    template: `Use your real-time web access to generate 10 multiple-choice quiz questions about the most recent technology trends and news from the past week.

IMPORTANT: Search for and use only the latest information from the past 7 days.

Requirements:
- Focus on breaking tech news, product launches, company announcements, AI developments, and industry trends from THIS WEEK
- Use your web search capabilities to find current, factual information
- Mix of difficulty levels: 3 Easy, 4 Medium, 3 Hard
- Each question should have 4 options (A, B, C, D) with only one correct answer
- Include a brief explanation for each correct answer
- Topics can include: AI/ML breakthroughs, cybersecurity incidents, startup funding, big tech company news, new product releases, industry regulations, tech stock movements

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

Return only a valid JSON array of 10 questions. Do not include any text outside the JSON array.`,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  sports: {
    id: 'sports-perplexity-v1',
    version: '1.0',
    description: 'Sports news and events from the past week',
    template: `Use your real-time web access to generate 10 multiple-choice quiz questions about the most recent sports news and events from the past week.

IMPORTANT: Search for and use only the latest sports information from the past 7 days.

Requirements:
- Focus on recent sports events, game results, player transfers, tournaments, and sports industry news from THIS WEEK
- Use your web search capabilities to find current, factual sports information
- Mix of difficulty levels: 3 Easy, 4 Medium, 3 Hard
- Each question should have 4 options (A, B, C, D) with only one correct answer
- Include a brief explanation for each correct answer
- Topics can include: NFL, NBA, MLB, soccer/football, tennis, Olympics, player trades, team news, championships, injury reports, coaching changes

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
  "source": "Recent sports news from [specific source/date]",
  "topic": "Sports"
}

Return only a valid JSON array of 10 questions. Do not include any text outside the JSON array.`,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

/**
 * Get active prompt for a specific topic
 * @param {string} topic - The topic to get prompt for
 * @returns {Object} Prompt object
 */
export const getActivePrompt = async (topic) => {
  try {
    const promptsRef = collection(db, 'prompts');
    const q = query(
      promptsRef,
      where('topic', '==', topic.toLowerCase()),
      where('isActive', '==', true),
      orderBy('version', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    // If no prompt found in Firestore, return default
    return DEFAULT_PROMPTS[topic.toLowerCase()] || null;
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return DEFAULT_PROMPTS[topic.toLowerCase()] || null;
  }
};

/**
 * Get all prompts for a specific topic (including inactive ones)
 * @param {string} topic - The topic to get prompts for
 * @returns {Array} Array of prompt objects
 */
export const getAllPromptsForTopic = async (topic) => {
  try {
    const promptsRef = collection(db, 'prompts');
    const q = query(
      promptsRef,
      where('topic', '==', topic.toLowerCase()),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const prompts = [];
    
    querySnapshot.forEach((doc) => {
      prompts.push({ id: doc.id, ...doc.data() });
    });
    
    return prompts;
  } catch (error) {
    console.error('Error fetching all prompts:', error);
    return [];
  }
};

/**
 * Save a new prompt version
 * @param {string} topic - Topic for the prompt
 * @param {string} template - Prompt template text
 * @param {string} version - Version identifier
 * @param {string} description - Human-readable description
 * @param {string} createdBy - Who created this prompt (optional)
 * @returns {string} Document ID
 */
export const savePrompt = async (topic, template, version, description = '', createdBy = 'system') => {
  try {
    const promptsRef = collection(db, 'prompts');
    const docRef = await addDoc(promptsRef, {
      topic: topic.toLowerCase(),
      template,
      version,
      description,
      isActive: false, // New prompts start as inactive until explicitly activated
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      usageCount: 0,
      successRate: 0
    });
    
    console.log(`Saved new prompt for ${topic} (version ${version})`);
    return docRef.id;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
};

/**
 * Update an existing prompt
 * @param {string} promptId - ID of the prompt to update
 * @param {Object} updates - Fields to update
 * @returns {void}
 */
export const updatePrompt = async (promptId, updates) => {
  try {
    const promptRef = doc(db, 'prompts', promptId);
    await updateDoc(promptRef, {
      ...updates,
      updatedAt: new Date()
    });
    
    console.log(`Updated prompt ${promptId}`);
  } catch (error) {
    console.error('Error updating prompt:', error);
    throw error;
  }
};

/**
 * Activate a specific prompt (and deactivate others for the same topic)
 * @param {string} promptId - ID of the prompt to activate
 * @returns {void}
 */
export const activatePrompt = async (promptId) => {
  try {
    // First, get the prompt to know its topic
    const promptRef = doc(db, 'prompts', promptId);
    const promptDoc = await getDoc(promptRef);
    
    if (!promptDoc.exists()) {
      throw new Error('Prompt not found');
    }
    
    const promptData = promptDoc.data();
    const topic = promptData.topic;
    
    // Deactivate all other prompts for this topic
    const allPrompts = await getAllPromptsForTopic(topic);
    const deactivatePromises = allPrompts
      .filter(p => p.id !== promptId && p.isActive)
      .map(p => updatePrompt(p.id, { isActive: false }));
    
    await Promise.all(deactivatePromises);
    
    // Activate the selected prompt
    await updatePrompt(promptId, { isActive: true });
    
    console.log(`Activated prompt ${promptId} for topic ${topic}`);
  } catch (error) {
    console.error('Error activating prompt:', error);
    throw error;
  }
};

/**
 * Create and activate a new prompt (convenience function)
 * @param {string} topic - Topic for the prompt
 * @param {string} template - Prompt template text
 * @param {string} version - Version identifier
 * @param {string} description - Human-readable description
 * @param {string} createdBy - Who created this prompt (optional)
 * @returns {string} Document ID of the new prompt
 */
export const createAndActivatePrompt = async (topic, template, version, description = '', createdBy = 'user') => {
  try {
    // Save the new prompt
    const promptId = await savePrompt(topic, template, version, description, createdBy);
    
    // Activate it (this will deactivate others for the same topic)
    await activatePrompt(promptId);
    
    console.log(`Created and activated new prompt for ${topic}`);
    return promptId;
  } catch (error) {
    console.error('Error creating and activating prompt:', error);
    throw error;
  }
};

/**
 * Test prompt retrieval for all topics
 * @returns {Object} Test results
 */
export const testPromptRetrieval = async () => {
  try {
    const results = {};
    const topics = ['technology', 'sports'];
    
    for (const topic of topics) {
      const prompt = await getActivePrompt(topic);
      results[topic] = {
        found: !!prompt,
        version: prompt?.version || 'N/A',
        length: prompt?.template?.length || 0,
        source: prompt?.id ? 'Firestore' : 'Default'
      };
    }
    
    console.log('Prompt retrieval test results:', results);
    return results;
  } catch (error) {
    console.error('Error testing prompt retrieval:', error);
    return { error: error.message };
  }
};

/**
 * Initialize default prompts in Firestore
 */
export const initializeDefaultPrompts = async () => {
  try {
    for (const [topic, promptData] of Object.entries(DEFAULT_PROMPTS)) {
      // Check if prompt already exists
      const existing = await getActivePrompt(topic);
      
      if (!existing || !existing.id) {
        // Save default prompt to Firestore
        const promptId = await savePrompt(
          topic, 
          promptData.template, 
          promptData.version, 
          promptData.description
        );
        
        // Activate it since it's the first prompt for this topic
        await activatePrompt(promptId);
        
        console.log(`Initialized default Perplexity AI prompt for ${topic}`);
      }
    }
  } catch (error) {
    console.error('Error initializing default prompts:', error);
  }
}; 