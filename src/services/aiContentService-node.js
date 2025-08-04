/**
 * Node.js Compatible AI Content Service
 * Handles AI API calls with logging, cost tracking, and duplicate prevention
 * For use in Node.js scripts like simple-batch-generator.js
 */

import { aiConfig } from '../config/aiConfig-node.js';
import { getValidatedPrompt, getValidTimeframes } from './promptFileService-node.js';
import { logApiCall, checkRecentCalls } from './apiLoggingService-node.js';

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
    
    console.error(`❌ Perplexity AI API call failed (${responseTime}ms):`, error.message);
    throw error;
  }
};

/**
 * Validate a question object structure
 */
export const validateQuestion = (question) => {
  const requiredFields = ['question', 'options', 'answer', 'details'];
  const missingFields = requiredFields.filter(field => !question[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missingFields.join(', ')}`]
    };
  }
  
  if (!Array.isArray(question.options) || question.options.length < 2) {
    return {
      valid: false,
      errors: ['Question must have at least 2 options']
    };
  }
  
  if (!question.options.includes(question.answer)) {
    return {
      valid: false,
      errors: ['Correct answer must be one of the provided options']
    };
  }
  
  return { valid: true };
};

/**
 * Extract partial questions from malformed JSON
 */
const extractPartialQuestions = (jsonString) => {
  const questions = [];
  const questionRegex = /\{[^}]*"question"[^}]*\}/g;
  const matches = jsonString.match(questionRegex);
  
  if (matches) {
    matches.forEach(match => {
      try {
        const question = JSON.parse(match);
        if (validateQuestion(question).valid) {
          questions.push(question);
        }
      } catch (e) {
        console.warn('Failed to parse partial question:', e.message);
      }
    });
  }
  
  return questions;
};

/**
 * Parse AI response and extract questions
 */
export const parseAIResponse = (aiResponse) => {
  try {
    console.log('🔍 Parsing AI response...');
    console.log(`📝 Response length: ${aiResponse.length} characters`);
    console.log(`📄 First 500 chars: ${aiResponse.substring(0, 500)}...`);
    
    // Try to find JSON in the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('❌ No JSON array found in response');
      console.log('🔍 Looking for any JSON structure...');
      
      // Try to find any JSON object
      const objectMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        console.log('📄 Found JSON object instead of array');
        console.log(`📝 Object: ${objectMatch[0].substring(0, 200)}...`);
      }
      
      throw new Error('No JSON array found in response');
    }
    
    const jsonString = jsonMatch[0];
    console.log(`📄 JSON array found, length: ${jsonString.length}`);
    
    const questions = JSON.parse(jsonString);
    
    if (!Array.isArray(questions)) {
      throw new Error('Parsed content is not an array');
    }
    
    console.log(`📊 Parsed ${questions.length} questions from JSON`);
    
    const validQuestions = [];
    const invalidQuestions = [];
    
    questions.forEach((question, index) => {
      const validation = validateQuestion(question);
      if (validation.valid) {
        validQuestions.push(question);
      } else {
        invalidQuestions.push({
          index,
          question,
          errors: validation.errors
        });
      }
    });
    
    console.log(`📊 Parsed ${validQuestions.length} valid questions from AI response`);
    if (invalidQuestions.length > 0) {
      console.warn(`⚠️ Found ${invalidQuestions.length} invalid questions`);
      // Log the first few invalid questions for debugging
      invalidQuestions.slice(0, 3).forEach((invalid, i) => {
        console.log(`❌ Invalid question ${i + 1}:`, invalid.errors);
        console.log(`📝 Question data:`, JSON.stringify(invalid.question, null, 2));
      });
    }
    
    return {
      success: true,
      questions: validQuestions,
      invalidQuestions,
      totalParsed: questions.length,
      validCount: validQuestions.length
    };
    
  } catch (error) {
    console.warn('Failed to parse JSON response, attempting partial extraction...');
    console.error('❌ Parse error:', error.message);
    
    const partialQuestions = extractPartialQuestions(aiResponse);
    
    if (partialQuestions.length > 0) {
      return {
        success: true,
        questions: partialQuestions,
        invalidQuestions: [],
        totalParsed: partialQuestions.length,
        validCount: partialQuestions.length,
        partial: true
      };
    }
    
    return {
      success: false,
      error: `Failed to parse AI response: ${error.message}`,
      rawResponse: aiResponse.substring(0, 500) + '...'
    };
  }
};

/**
 * Generate questions from prompt file
 */
export const generateQuestionsFromFile = async (options = {}) => {
  const batchId = generateBatchId(options.timeframe);
  const startTime = Date.now();
  
  try {
    console.log(`🚀 Starting AI question generation (Batch ID: ${batchId})`);
    
    // Get validated prompt for timeframe
    const promptResult = await getValidatedPrompt(options.timeframe || 'last_week');
    
    if (!promptResult.success) {
      return {
        success: false,
        error: `Failed to get prompt: ${promptResult.error}`,
        batchId
      };
    }
    
    // Check for recent calls to prevent duplicates
    const recentCheck = await checkRecentCalls({
      timeframe: options.timeframe,
      hours: options.duplicatePreventionHours || 6
    });
    
    if (recentCheck.hasRecent) {
      return {
        success: false,
        error: `Recent generation detected (${recentCheck.hoursSinceLast} hours ago)`,
        batchId,
        recentCall: recentCheck.lastCall
      };
    }
    
    // Make AI API call
    const aiResponse = await callPerplexityAI(promptResult.prompt, {
      batchId,
      trigger: options.trigger || 'file_based',
      model: options.model,
      maxTokens: options.maxTokens,
      temperature: options.temperature
    });
    
    // Parse the response
    const parseResult = parseAIResponse(aiResponse);
    
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error,
        batchId,
        rawResponse: parseResult.rawResponse
      };
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Question generation completed in ${duration}ms`);
    console.log(`📊 Generated ${parseResult.validCount} valid questions`);
    
    return {
      success: true,
      batchId,
      questions: parseResult.questions,
      timeframe: options.timeframe || 'last_week',
      metadata: {
        duration,
        totalParsed: parseResult.totalParsed,
        validCount: parseResult.validCount,
        invalidCount: parseResult.invalidQuestions.length,
        partial: parseResult.partial || false,
        trigger: options.trigger || 'file_based',
        model: options.model || aiConfig.model
      }
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Question generation failed after ${duration}ms:`, error.message);
    
    return {
      success: false,
      error: error.message,
      batchId,
      duration
    };
  }
};

/**
 * Generate questions for specific timeframe
 */
export const generateQuestionsForTimeframe = async (timeframe, options = {}) => {
  const validTimeframes = getValidTimeframes();
  
  if (!validTimeframes.includes(timeframe)) {
    return {
      success: false,
      error: `Invalid timeframe: ${timeframe}. Valid options: ${validTimeframes.join(', ')}`
    };
  }
  
  return await generateQuestionsFromFile({
    timeframe,
    ...options
  });
};

/**
 * Get available timeframes
 */
export const getAvailableTimeframes = () => {
  return getValidTimeframes();
};

/**
 * Test AI generation functionality
 */
export const testEnhancedAIGeneration = async () => {
  console.log('🧪 Testing enhanced AI generation...');
  
  try {
    const result = await generateQuestionsFromFile({
      timeframe: 'last_week',
      trigger: 'test'
    });
    
    if (result.success) {
      console.log('✅ AI generation test passed');
      console.log(`📊 Generated ${result.questions.length} questions`);
      return result;
    } else {
      console.error('❌ AI generation test failed:', result.error);
      return result;
    }
  } catch (error) {
    console.error('❌ AI generation test exception:', error.message);
    return { success: false, error: error.message };
  }
}; 