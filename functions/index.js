/**
 * Firebase Cloud Functions for TrendTrivia AI Content Generation
 * This runs on Google's servers and handles scheduled generation
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

/**
 * Configuration for AI generation
 */
const AI_CONFIG = {
  apiKey: functions.config().perplexity?.api_key || process.env.PERPLEXITY_API_KEY,
  endpoint: 'https://api.perplexity.ai/chat/completions',
  model: 'sonar',
  maxTokens: 2000,
  temperature: 0.2
};

/**
 * Generate unique batch ID
 */
const generateBatchId = () => {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Call Perplexity AI API
 */
const callPerplexityAI = async (prompt, options = {}) => {
  try {
    console.log('🤖 Calling Perplexity AI API...');
    
    const response = await axios.post(AI_CONFIG.endpoint, {
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature
    }, {
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ AI API call successful');
    return response.data.choices[0].message.content;
    
  } catch (error) {
    console.error('❌ AI API call failed:', error.message);
    throw new Error(`AI API call failed: ${error.message}`);
  }
};

/**
 * Validate individual question
 */
const validateQuestion = (question) => {
  const errors = [];
  
  if (!question.question || typeof question.question !== 'string') {
    errors.push('Missing or invalid question text');
  }
  
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push('Question must have exactly 4 options');
  }
  
  if (!question.answer || !question.options.includes(question.answer)) {
    errors.push('Answer must be one of the options');
  }
  
  if (!question.category || !['Technology', 'Pop Culture', 'Finance', 'Start-Ups'].includes(question.category)) {
    errors.push('Invalid category');
  }
  
  if (!question.difficulty || !['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push('Invalid difficulty level');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Parse AI response and validate questions
 */
const parseAIResponse = (aiResponse) => {
  try {
    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in AI response');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(questions)) {
      throw new Error('AI response is not an array');
    }
    
    if (questions.length !== 40) {
      throw new Error(`Expected 40 questions, got ${questions.length}`);
    }
    
    // Validate each question
    const validQuestions = [];
    const invalidQuestions = [];
    
    questions.forEach((question, index) => {
      const validation = validateQuestion(question);
      if (validation.isValid) {
        validQuestions.push({
          ...question,
          batchId: generateBatchId(),
          createdAt: new Date().toISOString(),
          isActive: true,
          timesUsed: 0,
          correctAnswerRate: 0
        });
      } else {
        invalidQuestions.push({
          index,
          question,
          errors: validation.errors
        });
      }
    });
    
    return {
      success: validQuestions.length > 0,
      validQuestions,
      invalidQuestions,
      validCount: validQuestions.length,
      totalCount: questions.length
    };
    
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

/**
 * Save batch to Firestore
 */
const saveBatch = async (batchData) => {
  try {
    console.log(`💾 Saving batch ${batchData.batchId} to Firestore...`);
    
    const batchRef = db.collection('batches');
    const batchDoc = {
      ...batchData.metadata,
      questions: batchData.questions,
      rawResponse: batchData.rawResponse,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await batchRef.add(batchDoc);
    console.log(`✅ Batch ${batchData.batchId} saved with ID: ${docRef.id}`);
    
    return {
      success: true,
      batchId: batchData.batchId,
      firestoreId: docRef.id,
      questionCount: batchData.questions.length
    };
    
  } catch (error) {
    console.error(`❌ Failed to save batch ${batchData.batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId: batchData.batchId
    };
  }
};

/**
 * Extract and save individual questions
 */
const extractQuestionsFromBatch = async (batchId) => {
  try {
    console.log(`📝 Extracting questions from batch ${batchId}...`);
    
    // Get the batch document
    const batchQuery = await db.collection('batches')
      .where('batchId', '==', batchId)
      .limit(1)
      .get();
    
    if (batchQuery.empty) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    const batchDoc = batchQuery.docs[0];
    const batchData = batchDoc.data();
    
    if (!batchData.questions || !Array.isArray(batchData.questions)) {
      throw new Error('No questions found in batch');
    }
    
    // Save each question individually
    const batch = db.batch();
    let extractedCount = 0;
    
    batchData.questions.forEach(question => {
      const questionRef = db.collection('questions').doc();
      batch.set(questionRef, {
        ...question,
        batchId: batchId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      extractedCount++;
    });
    
    await batch.commit();
    
    // Update batch with extraction status
    await batchDoc.ref.update({
      questionsExtracted: extractedCount,
      extractionCompletedAt: new Date()
    });
    
    console.log(`✅ Extracted ${extractedCount} questions from batch ${batchId}`);
    
    return {
      success: true,
      extractedCount,
      batchId
    };
    
  } catch (error) {
    console.error(`❌ Failed to extract questions from batch ${batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId
    };
  }
};

/**
 * Log API call to Firestore
 */
const logApiCall = async (callData) => {
  try {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.collection('api_logs').add({
      callId,
      timestamp: new Date(),
      provider: 'perplexity',
      model: AI_CONFIG.model,
      promptLength: callData.promptLength || 0,
      tokensUsed: callData.tokensUsed || 0,
      estimatedCost: callData.estimatedCost || 0,
      batchId: callData.batchId,
      purpose: callData.purpose || 'scheduled_generation',
      success: callData.success || false,
      error: callData.error || null
    });
    
    console.log(`📊 API call logged: ${callId}`);
    
  } catch (error) {
    console.error('❌ Failed to log API call:', error);
  }
};

/**
 * Main AI generation function
 */
const executeGeneration = async (trigger = 'scheduled') => {
  const batchId = generateBatchId();
  
  try {
    console.log(`🚀 Starting AI generation (trigger: ${trigger}, batch: ${batchId})`);
    
    // Get the prompt from Firestore or use default
    const promptDoc = await db.collection('prompts')
      .where('topic', '==', 'general')
      .where('isActive', '==', true)
      .limit(1)
      .get();
    
    let promptContent;
    if (!promptDoc.empty) {
      promptContent = promptDoc.docs[0].data().template;
    } else {
      // Fallback prompt
      promptContent = `Generate 40 trivia questions covering Technology, Pop Culture, Finance, and Start-Ups. 
      Each question should have 4 options and be categorized as easy, medium, or hard. 
      Return as JSON array with fields: question, options (array), answer, details, category, difficulty.`;
    }
    
    console.log(`📝 Using prompt (${promptContent.length} characters)`);
    
    // Call AI API
    const aiResponse = await callPerplexityAI(promptContent, {
      batchId,
      trigger,
      purpose: 'scheduled_generation'
    });
    
    console.log(`🤖 AI response received (${aiResponse.length} characters)`);
    
    // Parse and validate response
    const parseResult = parseAIResponse(aiResponse);
    if (!parseResult.success) {
      throw new Error(`Validation failed: ${parseResult.validCount}/40 questions valid`);
    }
    
    // Create batch metadata
    const batchMetadata = {
      batchId,
      generatedAt: new Date().toISOString(),
      promptLength: promptContent.length,
      aiResponseLength: aiResponse.length,
      questionCount: parseResult.validQuestions.length,
      categories: [...new Set(parseResult.validQuestions.map(q => q.category))],
      difficulties: [...new Set(parseResult.validQuestions.map(q => q.difficulty))],
      status: 'generated',
      trigger,
      validCount: parseResult.validCount,
      totalCount: parseResult.totalCount
    };
    
    // Save batch
    const saveResult = await saveBatch({
      batchId,
      questions: parseResult.validQuestions,
      metadata: batchMetadata,
      rawResponse: aiResponse
    });
    
    if (!saveResult.success) {
      throw new Error(`Failed to save batch: ${saveResult.error}`);
    }
    
    // Extract individual questions
    const extractResult = await extractQuestionsFromBatch(batchId);
    
    if (!extractResult.success) {
      console.warn(`⚠️ Failed to extract questions: ${extractResult.error}`);
    }
    
    // Log successful API call
    await logApiCall({
      batchId,
      promptLength: promptContent.length,
      tokensUsed: Math.ceil(aiResponse.length / 4), // Rough estimate
      estimatedCost: 0.01, // Rough estimate
      purpose: 'scheduled_generation',
      success: true
    });
    
    console.log(`✅ Generation completed successfully`);
    console.log(`📊 Generated ${parseResult.validQuestions.length} questions`);
    console.log(`📊 Categories: ${batchMetadata.categories.join(', ')}`);
    console.log(`📊 Difficulties: ${batchMetadata.difficulties.join(', ')}`);
    
    return {
      success: true,
      batchId,
      questionCount: parseResult.validQuestions.length,
      categories: batchMetadata.categories,
      difficulties: batchMetadata.difficulties,
      trigger
    };
    
  } catch (error) {
    console.error(`❌ Generation failed (batch: ${batchId}):`, error);
    
    // Log failed API call
    await logApiCall({
      batchId,
      purpose: 'scheduled_generation',
      success: false,
      error: error.message
    });
    
    return {
      success: false,
      batchId,
      error: error.message,
      trigger
    };
  }
};

/**
 * Scheduled Cloud Function - Runs every Monday at 9 AM EST
 */
exports.scheduledGeneration = functions.pubsub
  .schedule('0 9 * * 1')  // Cron expression: every Monday at 9 AM
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('📅 Scheduled generation triggered');
    
    try {
      const result = await executeGeneration('scheduled_weekly');
      
      if (result.success) {
        console.log('✅ Scheduled generation completed successfully');
        return { success: true, batchId: result.batchId };
      } else {
        console.error('❌ Scheduled generation failed:', result.error);
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      console.error('❌ Scheduled generation error:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * HTTP trigger for manual generation
 */
exports.manualGeneration = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    console.log('🔄 Manual generation triggered via HTTP');
    
    const result = await executeGeneration('manual_http');
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Generation completed successfully',
        batchId: result.batchId,
        questionCount: result.questionCount
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('❌ Manual generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test function for development
 */
exports.testGeneration = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  try {
    console.log('🧪 Test generation triggered');
    
    const result = await executeGeneration('test');
    
    res.status(200).json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}); 