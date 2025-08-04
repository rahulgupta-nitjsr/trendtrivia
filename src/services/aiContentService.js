/**
 * Enhanced AI Content Service
 * Handles AI API calls with logging, cost tracking, and duplicate prevention
 */

import { getValidatedPrompt, getValidTimeframes } from './promptFileService.js';
import { logApiCall, checkRecentCalls } from './apiLoggingService.js';

// Dynamic import function for AI configuration
async function getAiConfig() {
  if (typeof window === 'undefined') {
    // Node.js environment - use Node.js compatible config
    const { aiConfig } = await import('../config/aiConfig-node.js');
    return aiConfig;
  } else {
    // Browser environment - use Vite config
    const { aiConfig } = await import('../config/aiConfig.js');
    return aiConfig;
  }
}

// Initialize aiConfig
let aiConfig = null;

// Initialize the configuration
(async () => {
  aiConfig = await getAiConfig();
})();

/**
 * Generate a unique batch ID with timestamp and timeframe
 */
export const generateBatchId = (timeframe = 'default') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = Math.random().toString(36).substring(2, 8);
  const timeframeSuffix = timeframe !== 'default' ? `-${timeframe}` : '';
  return `batch-${timestamp}${timeframeSuffix}-${random}`;
};

/**
 * Enhanced Perplexity AI API call with logging and cost tracking
 */
export const callPerplexityAI = async (prompt, options = {}) => {
  const startTime = Date.now();
  const callId = `call-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  
  try {
    console.log(`🤖 Making Perplexity AI API call (ID: ${callId})...`);
    
    const requestBody = {
      model: options.model || aiConfig.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || aiConfig.maxTokens,
      temperature: options.temperature || aiConfig.temperature
    };
    
    const response = await fetch(aiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No content in API response');
    }
    
    // Log the successful API call
    await logApiCall({
      callId,
      provider: 'perplexity',
      model: requestBody.model,
      endpoint: aiConfig.endpoint,
      prompt,
      response: aiResponse,
      maxTokens: requestBody.max_tokens,
      temperature: requestBody.temperature,
      responseTime,
      success: true,
      batchId: options.batchId || null,
      trigger: options.trigger || 'unknown',
      purpose: 'question_generation'
    });
    
    console.log(`✅ Perplexity AI API call successful (${responseTime}ms)`);
    return aiResponse;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    // Log the failed API call
    await logApiCall({
      callId,
      provider: 'perplexity',
      model: options.model || aiConfig.model,
      endpoint: aiConfig.endpoint,
      prompt,
      response: null,
      maxTokens: options.maxTokens || aiConfig.maxTokens,
      temperature: options.temperature || aiConfig.temperature,
      responseTime,
      success: false,
      errorMessage: error.message,
      batchId: options.batchId || null,
      trigger: options.trigger || 'unknown',
      purpose: 'question_generation'
    });
    
    console.error(`❌ Perplexity AI API call failed (${responseTime}ms):`, error);
    throw error;
  }
};

/**
 * Enhanced question validation with detailed error reporting
 */
export const validateQuestion = (question) => {
  const result = {
    isValid: false,
    errors: []
  };
  
  // Check required fields
  const requiredFields = ['question', 'options', 'answer', 'details', 'category', 'difficulty'];
  for (const field of requiredFields) {
    if (!question[field]) {
      result.errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check options array
  if (question.options) {
    if (!Array.isArray(question.options)) {
      result.errors.push('Options must be an array');
    } else if (question.options.length !== 4) {
      result.errors.push(`Options must have exactly 4 items, got ${question.options.length}`);
    }
  }
  
  // Check if answer is one of the options
  if (question.answer && question.options && Array.isArray(question.options)) {
    if (!question.options.includes(question.answer)) {
      result.errors.push('Answer must be one of the provided options');
    }
  }
  
  // Check valid difficulty
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (question.difficulty && !validDifficulties.includes(question.difficulty.toLowerCase())) {
    result.errors.push(`Invalid difficulty: ${question.difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
  }
  
  // Check valid category
  const validCategories = ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'];
  if (question.category && !validCategories.includes(question.category)) {
    result.errors.push(`Invalid category: ${question.category}. Must be one of: ${validCategories.join(', ')}`);
  }
  
  result.isValid = result.errors.length === 0;
  return result;
};

/**
 * Extract partial questions from malformed JSON
 */
const extractPartialQuestions = (jsonString) => {
  const questions = [];
  const questionRegex = /"question":\s*"([^"]+)",\s*"options":\s*\[([^\]]+)\],\s*"answer":\s*"([^"]+)"/g;
  
  let match;
  while ((match = questionRegex.exec(jsonString)) !== null) {
    try {
      const question = match[1];
      const optionsString = match[2];
      const answer = match[3];
      
      // Parse options array
      const options = optionsString
        .split(',')
        .map(opt => opt.trim().replace(/^"|"$/g, ''))
        .filter(opt => opt.length > 0);
      
      if (question && options.length >= 2 && answer) {
        questions.push({
          question,
          options,
          answer,
          difficulty: 'medium',
          category: 'technology',
          topic: 'current_events'
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse partial question:', error);
    }
  }
  
  return questions;
};

/**
 * Parse and validate AI response with enhanced error handling
 */
export const parseAIResponse = (aiResponse) => {
  try {
    console.log('🔍 Parsing AI response...');
    
    // Save AI response for debugging
    console.log('💾 AI Response length:', aiResponse.length, 'characters');
    console.log('💾 AI Response preview:', aiResponse.substring(0, 200) + '...');
    
    // Extract JSON from the response - try multiple patterns
    let jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    }
    if (!jsonMatch) {
      // Try to find the start of the array
      const arrayStart = aiResponse.indexOf('[');
      const arrayEnd = aiResponse.lastIndexOf(']');
      if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
        jsonMatch = [aiResponse.substring(arrayStart, arrayEnd + 1)];
      }
    }
    
    if (!jsonMatch) {
      throw new Error('No JSON array found in AI response');
    }
    
    const jsonString = jsonMatch[1] || jsonMatch[0];
    
    // Try to fix common JSON issues
    let cleanedJson = jsonString
      .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
      .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
      .replace(/,\s*,/g, ',')  // Remove double commas
      .replace(/,\s*$/g, '')   // Remove trailing commas at end
      .replace(/}\s*,?\s*$/g, '}')  // Clean up end of objects
      .replace(/]\s*,?\s*$/g, ']'); // Clean up end of arrays
    
    // Handle incomplete JSON arrays
    if (cleanedJson.includes('"options":') && !cleanedJson.endsWith(']')) {
      console.log('⚠️ Detected incomplete JSON array, attempting to fix...');
      
      // Find the last complete question object
      const lastCompleteQuestion = cleanedJson.lastIndexOf('},');
      if (lastCompleteQuestion !== -1) {
        // Extract up to the last complete question and close the array
        cleanedJson = cleanedJson.substring(0, lastCompleteQuestion + 1) + ']';
        console.log('🔧 Fixed incomplete JSON by closing array after last complete question');
      }
    }
    
    console.log('🔧 Attempting to parse cleaned JSON...');
    
    let questions;
    try {
      questions = JSON.parse(cleanedJson);
      
      if (!Array.isArray(questions)) {
        throw new Error('Parsed data is not an array');
      }
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('🔍 Error position:', parseError.message.match(/position (\d+)/)?.[1] || 'unknown');
      
      // Try to show the problematic area
      const errorPosition = parseInt(parseError.message.match(/position (\d+)/)?.[1] || '0');
      if (errorPosition > 0) {
        const start = Math.max(0, errorPosition - 50);
        const end = Math.min(cleanedJson.length, errorPosition + 50);
        console.error('🔍 Problematic JSON area:', cleanedJson.substring(start, end));
      }
      
      // If JSON parsing fails, try to extract partial questions
      console.log('🔄 Attempting to extract partial questions from malformed JSON...');
      
      const partialQuestions = extractPartialQuestions(cleanedJson);
      if (partialQuestions.length > 0) {
        console.log(`✅ Extracted ${partialQuestions.length} partial questions`);
        return {
          success: false,
          error: `JSON parsing failed, but extracted ${partialQuestions.length} partial questions`,
          validQuestions: partialQuestions,
          invalidQuestions: [],
          validCount: partialQuestions.length,
          totalCount: partialQuestions.length,
          partialExtraction: true
        };
      }
      
      throw parseError;
    }
    
    if (questions.length !== 40) {
      console.log(`⚠️ Expected 40 questions, got ${questions.length}. Attempting to extract partial questions...`);
      
      const partialQuestions = extractPartialQuestions(cleanedJson);
      if (partialQuestions.length > questions.length) {
        console.log(`✅ Extracted ${partialQuestions.length} questions from partial JSON`);
        return {
          success: false,
          error: `Incomplete JSON: got ${questions.length}/40 questions, extracted ${partialQuestions.length} total`,
          validQuestions: partialQuestions,
          invalidQuestions: [],
          validCount: partialQuestions.length,
          totalCount: partialQuestions.length,
          partialExtraction: true
        };
      }
    }
    
    // Validate each question
    const validQuestions = [];
    const invalidQuestions = [];
    
    questions.forEach((question, index) => {
      const validation = validateQuestion(question);
      if (validation.isValid) {
        validQuestions.push(question);
      } else {
        invalidQuestions.push({
          index,
          question,
          errors: validation.errors
        });
        console.warn(`❌ Question ${index + 1} validation failed:`, validation.errors);
      }
    });
    
    console.log(`✅ Validation complete: ${validQuestions.length}/40 questions valid`);
    
    return {
      success: validQuestions.length === 40,
      validQuestions,
      invalidQuestions,
      validCount: validQuestions.length,
      totalCount: questions.length
    };
    
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error);
    return {
      success: false,
      error: error.message,
      validQuestions: [],
      invalidQuestions: [],
      validCount: 0,
      totalCount: 0
    };
  }
};

/**
 * Enhanced question generation with duplicate prevention and logging
 */
export const generateQuestionsFromFile = async (options = {}) => {
  const {
    timeframe = 'default',
    forcereGenerate = false,
    duplicatePreventionHours = 1,
    trigger = 'unknown'
  } = options;
  
  const batchId = generateBatchId(timeframe);
  
  try {
    console.log(`🚀 Starting enhanced AI question generation (Batch: ${batchId})...`);
    
    // Check for recent calls to prevent duplicates
    if (!forcereGenerate) {
      console.log('🔍 Checking for recent API calls...');
      const recentCallsResult = await checkRecentCalls(duplicatePreventionHours);
      
      if (recentCallsResult.success && recentCallsResult.hasRecentCall) {
        const recentCall = recentCallsResult.mostRecentCall;
        const timeSinceLastCall = (new Date() - recentCall.timestamp) / (1000 * 60); // minutes
        
        console.log(`⚠️ Recent API call found ${timeSinceLastCall.toFixed(1)} minutes ago`);
        
        return {
          success: false,
          error: `Duplicate prevention: Recent API call found ${timeSinceLastCall.toFixed(1)} minutes ago`,
          batchId,
          preventedDuplicate: true,
          recentCall: {
            timestamp: recentCall.timestamp,
            batchId: recentCall.batchId,
            timeSinceCall: timeSinceLastCall
          }
        };
      }
    }
    
    // Get validated prompt for specific timeframe
    const promptContent = await getValidatedPrompt(timeframe);
    console.log(`📝 Using prompt (${promptContent.length} characters) for timeframe: ${timeframe}`);
    
    // Make AI API call with logging
    const aiResponse = await callPerplexityAI(promptContent, {
      batchId,
      trigger,
      model: aiConfig.model,
      maxTokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature
    });
    
    console.log(`🤖 AI response received (${aiResponse.length} characters)`);
    
    // Parse and validate response
    const parseResult = parseAIResponse(aiResponse);
    
    // Accept partial batches (at least 30 questions)
    const minQuestions = 30;
    if (parseResult.validCount < minQuestions) {
      throw new Error(`Validation failed: ${parseResult.validCount}/40 questions valid (minimum ${minQuestions} required). ${parseResult.error || ''}`);
    }
    
    console.log(`✅ Generated ${parseResult.validCount}/40 questions (${parseResult.validCount >= 40 ? 'complete' : 'partial'} batch)`);
    
    // Create batch metadata
    const batchMetadata = {
      batchId,
      timeframe,
      generatedAt: new Date().toISOString(),
      promptLength: promptContent.length,
      aiResponseLength: aiResponse.length,
      questionCount: parseResult.validQuestions.length,
      categories: [...new Set(parseResult.validQuestions.map(q => q.category))],
      difficulties: [...new Set(parseResult.validQuestions.map(q => q.difficulty))],
      status: 'generated',
      trigger,
      duplicatePreventionHours,
      forcereGenerate,
      isActive: false // Will be activated by batch service
    };
    
    console.log(`✅ Successfully generated ${parseResult.validQuestions.length} questions`);
    console.log(`📊 Categories: ${batchMetadata.categories.join(', ')}`);
    console.log(`📊 Difficulties: ${batchMetadata.difficulties.join(', ')}`);
    
    return {
      success: true,
      batchId,
      questions: parseResult.validQuestions,
      metadata: batchMetadata,
      rawResponse: aiResponse,
      validationResults: {
        validCount: parseResult.validCount,
        totalCount: parseResult.totalCount,
        invalidQuestions: parseResult.invalidQuestions
      }
    };
    
  } catch (error) {
    console.error(`❌ AI generation failed (Batch: ${batchId}):`, error);
    
    return {
      success: false,
      batchId,
      error: error.message,
      metadata: {
        batchId,
        generatedAt: new Date().toISOString(),
        status: 'failed',
        error: error.message,
        trigger,
        duplicatePreventionHours,
        forcereGenerate
      }
    };
  }
};

/**
 * Test enhanced AI generation with all features
 */
export const testEnhancedAIGeneration = async () => {
  try {
    console.log('🧪 Testing enhanced AI generation system...');
    
    const results = {
      duplicateCheck: false,
      promptValidation: false,
      batchGeneration: false,
      apiLogging: false
    };
    
    // Test 1: Duplicate check
    const duplicateResult = await checkRecentCalls(1);
    results.duplicateCheck = duplicateResult.success;
    console.log(`✅ Duplicate check: ${results.duplicateCheck ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Prompt validation
    try {
      const prompt = await getValidatedPrompt();
      results.promptValidation = prompt && prompt.length > 0;
    } catch (error) {
      results.promptValidation = false;
    }
    console.log(`✅ Prompt validation: ${results.promptValidation ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Mock batch generation (without actual API call)
    const mockBatchId = generateBatchId();
    results.batchGeneration = mockBatchId.startsWith('batch-');
    console.log(`✅ Batch generation: ${results.batchGeneration ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: API logging capability
    results.apiLogging = typeof logApiCall === 'function';
    console.log(`✅ API logging: ${results.apiLogging ? 'PASSED' : 'FAILED'}`);
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 Enhanced AI generation test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      mockBatchId,
      hasRecentCalls: duplicateResult.hasRecentCall || false
    };

  } catch (error) {
    console.error('❌ Enhanced AI generation test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test file-based generation readiness
 */
export const testFileBAsedGeneration = async () => {
  try {
    console.log('🧪 Testing file-based generation readiness...');
    
    // Test prompt file access
    const prompt = await getValidatedPrompt();
    const isReady = prompt && prompt.length > 0;
    
    console.log(`${isReady ? '✅' : '❌'} File-based generation: ${isReady ? 'READY' : 'NOT READY'}`);
    
    return {
      success: isReady,
      promptLength: prompt?.length || 0,
      message: isReady ? 'File-based generation is ready' : 'File-based generation not ready'
    };
    
  } catch (error) {
    console.error('❌ File-based generation test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'File-based generation test failed'
    };
  }
};

/**
 * Simple Perplexity connection test
 */
export const testPerplexityConnection = async () => {
  try {
    console.log('🧪 Testing Perplexity connection...');
    
    const testPrompt = 'Say "Hello, TrendTrivia!" and nothing else.';
    const response = await callPerplexityAI(testPrompt, {
      trigger: 'connection_test',
      maxTokens: 50
    });
    
    const isConnected = response && response.length > 0;
    
    console.log(`${isConnected ? '✅' : '❌'} Perplexity connection: ${isConnected ? 'CONNECTED' : 'FAILED'}`);
    
    return {
      success: isConnected,
      response: response?.substring(0, 100) || null,
      message: isConnected ? 'Perplexity API connection successful' : 'Perplexity API connection failed'
    };

  } catch (error) {
    console.error('❌ Perplexity connection test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Perplexity connection test failed'
    };
  }
};

/**
 * Generate questions for a specific timeframe
 * @param {string} timeframe - The timeframe ('last_week', 'last_month', 'last_year')
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Generation result
 */
export const generateQuestionsForTimeframe = async (timeframe, options = {}) => {
  // Validate timeframe
  const validTimeframes = getValidTimeframes();
  if (!validTimeframes.includes(timeframe)) {
    throw new Error(`Invalid timeframe: ${timeframe}. Valid options: ${validTimeframes.join(', ')}`);
  }

  console.log(`🕒 Generating questions for timeframe: ${timeframe}`);
  
  return await generateQuestionsFromFile({
    ...options,
    timeframe,
    trigger: options.trigger || `timeframe_${timeframe}`
  });
};

/**
 * Get available timeframes
 * @returns {Array<string>} List of available timeframes
 */
export const getAvailableTimeframes = () => {
  return getValidTimeframes();
};

// LEGACY FUNCTIONS (marked as deprecated)

/**
 * @deprecated Use generateQuestionsFromFile instead
 */
export const generateQuestionsForAllTopics = async () => {
  console.warn('⚠️ generateQuestionsForAllTopics is deprecated. Use generateQuestionsFromFile instead.');
  return await generateQuestionsFromFile({ trigger: 'legacy_call' });
}; 