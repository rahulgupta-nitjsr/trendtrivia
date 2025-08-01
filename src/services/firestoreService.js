/**
 * Enhanced Firestore Service
 * Handles database operations with batch integration and fallback systems
 */

import { db } from '../config/firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { getQuestionsFromLatestBatch, getActiveQuestions } from './questionExtractionService.js';
import { getLatestActiveBatch, getBatchStats } from './batchService.js';

/**
 * Enhanced question fetching with batch integration and fallback
 */
export const getQuizQuestions = async (options = {}) => {
  try {
    const {
      count = 10,
      category = null,
      difficulty = null,
      timeframe = null,
      preferLatestBatch = true
    } = options;
    
    console.log(`🔍 Fetching ${count} quiz questions (category: ${category}, difficulty: ${difficulty}, timeframe: ${timeframe})`);
    
    let result;
    let source = 'unknown';
    
    if (preferLatestBatch) {
      // Try to get questions from the latest active batch first (with timeframe filter)
      console.log(`🔄 Attempting to get questions from latest batch${timeframe ? ` for timeframe: ${timeframe}` : ''}...`);
      result = await getQuestionsFromLatestBatch(count, { category, timeframe });
      
      if (result.success && result.questions.length > 0) {
        source = timeframe ? `latest_batch_${timeframe}` : 'latest_batch';
        console.log(`✅ Got ${result.questions.length} questions from latest batch${timeframe ? ` (${timeframe})` : ''}`);
      } else {
        console.log('⚠️ No questions from latest batch, falling back to active questions');
        result = await getActiveQuestions({ 
          category, 
          difficulty, 
          timeframe,
          limit: count 
        });
        source = timeframe ? `active_questions_fallback_${timeframe}` : 'active_questions_fallback';
      }
    } else {
      // Directly get active questions
      result = await getActiveQuestions({ 
        category, 
        difficulty, 
        timeframe,
        limit: count 
      });
      source = timeframe ? `active_questions_${timeframe}` : 'active_questions';
    }
    
    if (!result.success || result.questions.length === 0) {
      // Final fallback to legacy static questions
      console.log('🔄 Falling back to legacy static questions...');
      result = await getLegacyQuestions(count);
      source = 'legacy_fallback';
    }
    
    // Add metadata to questions
    const enhancedQuestions = result.questions.map(question => ({
      ...question,
      fetchedAt: new Date().toISOString(),
      source,
      batchInfo: result.batchId || null
    }));
    
    console.log(`✅ Successfully fetched ${enhancedQuestions.length} questions from ${source}`);
    
    return {
      success: true,
      questions: enhancedQuestions,
      count: enhancedQuestions.length,
      source,
      metadata: {
        requestedCount: count,
        actualCount: enhancedQuestions.length,
        category,
        difficulty,
        timeframe,
        fetchedAt: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('❌ Error fetching quiz questions:', error);
    
    // Emergency fallback to hardcoded questions
    const fallbackQuestions = getEmergencyFallbackQuestions(options.count || 10);
    
    return {
      success: false,
      error: error.message,
      questions: fallbackQuestions,
      count: fallbackQuestions.length,
      source: 'emergency_fallback'
    };
  }
};

/**
 * Get questions with batch status indicators
 */
export const getQuestionsWithBatchStatus = async (count = 10) => {
  try {
    console.log('🔍 Fetching questions with batch status indicators...');
    
    // Get latest batch info
    const latestBatch = await getLatestActiveBatch();
    const batchStats = await getBatchStats();
    
    // Get questions
    const questionsResult = await getQuizQuestions({ count });
    
    // Add batch status information
    const batchStatus = {
      hasActiveBatch: !!latestBatch,
      lastGeneratedAt: latestBatch?.generatedAt || null,
      lastActivatedAt: latestBatch?.activatedAt || null,
      currentBatchId: latestBatch?.batchId || null,
      currentBatchQuestionCount: latestBatch?.questionCount || 0,
      totalBatches: batchStats?.totalBatches || 0,
      totalQuestions: batchStats?.totalQuestions || 0,
      systemStatus: latestBatch ? 'active' : 'no_active_batch'
    };
    
    // Calculate freshness
    if (latestBatch?.generatedAt) {
      const generatedTime = new Date(latestBatch.generatedAt);
      const now = new Date();
      const hoursOld = (now - generatedTime) / (1000 * 60 * 60);
      
      batchStatus.hoursOld = Math.round(hoursOld);
      batchStatus.freshness = hoursOld < 24 ? 'fresh' : 
                             hoursOld < 168 ? 'recent' : 'old';
    }
    
    return {
      ...questionsResult,
      batchStatus
    };
    
  } catch (error) {
    console.error('❌ Error fetching questions with batch status:', error);
    
    // Fallback without batch status
    const fallbackResult = await getQuizQuestions({ count });
    return {
      ...fallbackResult,
      batchStatus: {
        hasActiveBatch: false,
        systemStatus: 'error',
        error: error.message
      }
    };
  }
};

/**
 * Legacy question fetching (for backward compatibility)
 */
export const getLegacyQuestions = async (count = 10) => {
  try {
    console.log(`🔍 Fetching ${count} legacy questions...`);
    
    const questionsRef = collection(db, 'questions');
    const q = query(
      questionsRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const questions = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        question: data.question,
        options: data.options,
        answer: data.answer,
        details: data.details || data.explanation,
        category: data.category || data.topic,
        difficulty: data.difficulty
      });
    });
    
    console.log(`✅ Found ${questions.length} legacy questions`);
    
    return {
      success: true,
      questions,
      count: questions.length
    };
    
  } catch (error) {
    console.error('❌ Error fetching legacy questions:', error);
    return {
      success: false,
      error: error.message,
      questions: []
    };
  }
};

/**
 * Emergency fallback questions (hardcoded)
 */
export const getEmergencyFallbackQuestions = (count = 10) => {
  const fallbackQuestions = [
    {
      id: 'fallback-1',
      question: 'What does "AI" stand for in technology?',
      options: ['Artificial Intelligence', 'Automated Integration', 'Advanced Interface', 'Algorithmic Innovation'],
      answer: 'Artificial Intelligence',
      details: 'AI stands for Artificial Intelligence, referring to computer systems that can perform tasks typically requiring human intelligence.',
      category: 'Technology',
      difficulty: 'easy'
    },
    {
      id: 'fallback-2',
      question: 'Which company developed the iPhone?',
      options: ['Google', 'Microsoft', 'Apple', 'Samsung'],
      answer: 'Apple',
      details: 'Apple Inc. developed and released the first iPhone in 2007, revolutionizing the smartphone industry.',
      category: 'Technology',
      difficulty: 'easy'
    },
    {
      id: 'fallback-3',
      question: 'What is the most popular programming language for web development?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      answer: 'JavaScript',
      details: 'JavaScript is the most widely used programming language for web development, running in browsers and servers.',
      category: 'Technology',
      difficulty: 'medium'
    },
    {
      id: 'fallback-4',
      question: 'Which social media platform was founded by Mark Zuckerberg?',
      options: ['Twitter', 'Instagram', 'Facebook', 'LinkedIn'],
      answer: 'Facebook',
      details: 'Facebook was founded by Mark Zuckerberg in 2004 while he was a student at Harvard University.',
      category: 'Pop Culture',
      difficulty: 'easy'
    },
    {
      id: 'fallback-5',
      question: 'What does "IPO" stand for in finance?',
      options: ['Initial Public Offering', 'International Portfolio Option', 'Investment Protection Order', 'Integrated Profit Operation'],
      answer: 'Initial Public Offering',
      details: 'IPO stands for Initial Public Offering, the process by which a private company offers shares to the public for the first time.',
      category: 'Finance',
      difficulty: 'medium'
    }
  ];
  
  return fallbackQuestions.slice(0, count);
};

/**
 * Add a new question to the database
 */
export const addQuestion = async (questionData) => {
  try {
    console.log('➕ Adding new question to database...');
    
    const questionsRef = collection(db, 'questions');
    const docRef = await addDoc(questionsRef, {
      ...questionData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      timesUsed: 0,
      correctAnswerRate: 0
    });
    
    console.log(`✅ Question added with ID: ${docRef.id}`);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Error adding question:', error);
    throw error;
  }
};

/**
 * Update system metadata
 */
export const updateSystemMetadata = async (metadata) => {
  try {
    console.log('🔄 Updating system metadata...');
    
    const metadataRef = doc(db, 'system_metadata', 'config');
    await updateDoc(metadataRef, {
      ...metadata,
      updatedAt: new Date()
    });
    
    console.log('✅ System metadata updated');
    
  } catch (error) {
    console.error('❌ Error updating system metadata:', error);
    throw error;
  }
};

/**
 * Get system metadata
 */
export const getSystemMetadata = async () => {
  try {
    console.log('🔍 Fetching system metadata...');
    
    const metadataRef = doc(db, 'system_metadata', 'config');
    const docSnap = await getDoc(metadataRef);
    
    if (docSnap.exists()) {
      console.log('✅ System metadata retrieved');
      return docSnap.data();
    } else {
      console.log('⚠️ No system metadata found');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error fetching system metadata:', error);
    return null;
  }
};

/**
 * Get comprehensive system status
 */
export const getSystemStatus = async () => {
  try {
    console.log('📊 Getting comprehensive system status...');
    
    const [
      metadata,
      batchStats,
      latestBatch
    ] = await Promise.all([
      getSystemMetadata(),
      getBatchStats(),
      getLatestActiveBatch()
    ]);
    
    const status = {
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        totalQuestions: batchStats?.totalQuestions || 0,
        totalBatches: batchStats?.totalBatches || 0,
        activeBatches: batchStats?.activeBatches || 0
      },
      currentBatch: latestBatch ? {
        id: latestBatch.batchId,
        generatedAt: latestBatch.generatedAt,
        questionCount: latestBatch.questionCount,
        status: latestBatch.status
      } : null,
      system: {
        lastUpdate: metadata?.lastGenerationAt || null,
        totalGenerations: metadata?.totalGenerations || 0,
        systemStatus: metadata?.systemStatus || 'unknown'
      },
      health: 'healthy'
    };
    
    // Determine overall health
    if (!latestBatch) {
      status.health = 'warning';
      status.warnings = ['No active batch found'];
    } else if (batchStats?.totalQuestions === 0) {
      status.health = 'error';
      status.errors = ['No questions available'];
    }
    
    console.log(`✅ System status: ${status.health}`);
    
    return {
      success: true,
      status
    };
    
  } catch (error) {
    console.error('❌ Error getting system status:', error);
    
    return {
      success: false,
      error: error.message,
      status: {
        timestamp: new Date().toISOString(),
        health: 'error',
        errors: [error.message]
      }
    };
  }
};

/**
 * Test enhanced Firestore service
 */
export const testEnhancedFirestoreService = async () => {
  try {
    console.log('🧪 Testing enhanced Firestore service...');
    
    const results = {
      getQuizQuestions: false,
      getWithBatchStatus: false,
      getSystemStatus: false,
      legacyFallback: false
    };
    
    // Test 1: Get quiz questions
    const quizResult = await getQuizQuestions({ count: 5 });
    results.getQuizQuestions = quizResult.success;
    console.log(`✅ Get quiz questions: ${results.getQuizQuestions ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Get questions with batch status
    const batchStatusResult = await getQuestionsWithBatchStatus(3);
    results.getWithBatchStatus = batchStatusResult.success;
    console.log(`✅ Get with batch status: ${results.getWithBatchStatus ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Get system status
    const statusResult = await getSystemStatus();
    results.getSystemStatus = statusResult.success;
    console.log(`✅ Get system status: ${results.getSystemStatus ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Legacy fallback
    const legacyResult = await getLegacyQuestions(2);
    results.legacyFallback = legacyResult.success;
    console.log(`✅ Legacy fallback: ${results.legacyFallback ? 'PASSED' : 'FAILED'}`);
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 Enhanced Firestore service test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      questionCount: quizResult.questions?.length || 0,
      systemHealth: statusResult.status?.health || 'unknown'
    };
    
  } catch (error) {
    console.error('❌ Enhanced Firestore service test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 