/**
 * Question Extraction Service
 * Converts batch questions to individual question documents
 */

import { db } from '../config/firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  increment,
  getDoc
} from 'firebase/firestore';
import { getBatchById } from './batchService.js';

/**
 * Extract questions from a batch and save as individual documents
 */
export const extractQuestionsFromBatch = async (batchId) => {
  try {
    console.log(`📤 Extracting questions from batch: ${batchId}`);
    
    // Get the batch data
    const batch = await getBatchById(batchId);
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    if (!batch.questions || batch.questions.length === 0) {
      throw new Error(`Batch ${batchId} has no questions to extract`);
    }
    
    const questionsRef = collection(db, 'questions');
    const firestoreBatch = writeBatch(db);
    const extractedQuestions = [];
    const currentTime = new Date();
    
    // Process each question in the batch
    for (let i = 0; i < batch.questions.length; i++) {
      const question = batch.questions[i];
      
      // Create individual question document
      const questionDoc = {
        // Question content
        question: question.question,
        options: question.options,
        answer: question.answer,
        details: question.details,
        category: question.category,
        difficulty: question.difficulty,
        
        // Metadata
        createdAt: currentTime,
        updatedAt: currentTime,
        
        // Source tracking
        source: 'AI-generated',
        batchId: batchId,
        promptUsed: batch.promptSource || 'file-based-prompt',
        
        // Usage statistics
        timesUsed: 0,
        correctAnswerRate: 0,
        
        // Status
        isActive: true,
        isValidated: true, // Assume batch questions are pre-validated
        
        // Batch context
        batchIndex: i,
        extractedAt: currentTime
      };
      
      // Add to batch write
      const questionDocRef = doc(questionsRef);
      firestoreBatch.set(questionDocRef, questionDoc);
      
      extractedQuestions.push({
        id: questionDocRef.id,
        ...questionDoc
      });
    }
    
    // Execute batch write
    await firestoreBatch.commit();
    
    // Update batch to mark questions as extracted
    const batchRef = doc(db, 'batches', batch.id);
    await updateDoc(batchRef, {
      questionsExtracted: batch.questions.length,
      extractedAt: currentTime,
      updatedAt: currentTime
    });
    
    console.log(`✅ Extracted ${extractedQuestions.length} questions from batch ${batchId}`);
    
    return {
      success: true,
      batchId,
      extractedCount: extractedQuestions.length,
      questions: extractedQuestions
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
 * Get active questions for quiz use
 */
export const getActiveQuestions = async (options = {}) => {
  try {
    const {
      category = null,
      difficulty = null,
      limit: questionLimit = 10,
      excludeUsed = false
    } = options;
    
    console.log(`🔍 Fetching active questions (category: ${category}, difficulty: ${difficulty}, limit: ${questionLimit})`);
    
    const questionsRef = collection(db, 'questions');
    let q = query(
      questionsRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    // Apply filters
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }
    
    if (excludeUsed) {
      q = query(q, where('timesUsed', '==', 0));
    }
    
    if (questionLimit) {
      q = query(q, limit(questionLimit));
    }
    
    const querySnapshot = await getDocs(q);
    const questions = [];
    
    querySnapshot.forEach(doc => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Found ${questions.length} active questions`);
    
    return {
      success: true,
      questions,
      count: questions.length,
      filters: { category, difficulty, limit: questionLimit, excludeUsed }
    };
    
  } catch (error) {
    console.error('❌ Error fetching active questions:', error);
    return {
      success: false,
      error: error.message,
      questions: []
    };
  }
};

/**
 * Get questions from the latest active batch
 */
export const getQuestionsFromLatestBatch = async (count = 10, options = {}) => {
  try {
    const { category = null } = options;
    console.log(`🔍 Fetching ${count} questions from latest active batch (category: ${category})`);
    
    // First, get the latest active batch directly
    const { getLatestActiveBatch } = await import('./batchService.js');
    const latestBatch = await getLatestActiveBatch();
    
    if (!latestBatch || !latestBatch.questions || latestBatch.questions.length === 0) {
      console.log('⚠️ No active batch found or batch has no questions');
      return await getActiveQuestions({ category, limit: count });
    }
    
    console.log(`📦 Found active batch: ${latestBatch.batchId} with ${latestBatch.questions.length} questions`);
    
    // Filter questions by category if specified
    let availableQuestions = latestBatch.questions;
    if (category) {
      availableQuestions = latestBatch.questions.filter(q => 
        q.category && q.category.toLowerCase() === category.toLowerCase()
      );
      console.log(`🔍 Filtered to ${availableQuestions.length} questions for category: ${category}`);
    }
    
    if (availableQuestions.length === 0) {
      console.log(`⚠️ No questions found for category: ${category}, falling back to active questions`);
      return await getActiveQuestions({ category, limit: count });
    }
    
    // Take the requested number of questions
    const selectedQuestions = availableQuestions.slice(0, count);
    
    // Add metadata to questions
    const questionsWithMetadata = selectedQuestions.map((question, index) => ({
      id: `batch-${latestBatch.batchId}-${index}`,
      ...question,
      source: 'active_batch',
      batchId: latestBatch.batchId,
      fetchedAt: new Date().toISOString()
    }));
    
    console.log(`✅ Returning ${questionsWithMetadata.length} questions from active batch`);
    
    return {
      success: true,
      questions: questionsWithMetadata,
      count: questionsWithMetadata.length,
      source: 'latest_batch',
      batchId: latestBatch.batchId
    };
    
  } catch (error) {
    console.error('❌ Error fetching questions from latest batch:', error);
    
    // Fallback to any active questions
    console.log('🔄 Falling back to active questions from database...');
    return await getActiveQuestions({ category: options.category, limit: count });
  }
};

/**
 * Update question usage statistics
 */
export const updateQuestionUsage = async (questionId, wasCorrect = null) => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    const updateData = {
      timesUsed: increment(1),
      updatedAt: new Date()
    };
    
    // Update correct answer rate if provided
    if (wasCorrect !== null) {
      // This is a simplified approach - in production, you'd want more sophisticated tracking
      const questionDoc = await getDoc(questionRef);
      if (questionDoc.exists()) {
        const data = questionDoc.data();
        const currentRate = data.correctAnswerRate || 0;
        const currentUses = data.timesUsed || 0;
        
        // Calculate new rate
        const newRate = ((currentRate * currentUses) + (wasCorrect ? 1 : 0)) / (currentUses + 1);
        updateData.correctAnswerRate = newRate;
      }
    }
    
    await updateDoc(questionRef, updateData);
    
    return {
      success: true,
      questionId,
      wasCorrect
    };
    
  } catch (error) {
    console.error(`❌ Error updating question usage for ${questionId}:`, error);
    return {
      success: false,
      error: error.message,
      questionId
    };
  }
};

/**
 * Deactivate questions from a specific batch
 */
export const deactivateQuestionsFromBatch = async (batchId) => {
  try {
    console.log(`🔄 Deactivating questions from batch: ${batchId}`);
    
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, where('batchId', '==', batchId));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    let updateCount = 0;
    
    querySnapshot.forEach(doc => {
      batch.update(doc.ref, {
        isActive: false,
        deactivatedAt: new Date(),
        updatedAt: new Date()
      });
      updateCount++;
    });
    
    await batch.commit();
    
    console.log(`✅ Deactivated ${updateCount} questions from batch ${batchId}`);
    
    return {
      success: true,
      batchId,
      deactivatedCount: updateCount
    };
    
  } catch (error) {
    console.error(`❌ Error deactivating questions from batch ${batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId
    };
  }
};

/**
 * Get question statistics
 */
export const getQuestionStats = async () => {
  try {
    console.log('📊 Calculating question statistics...');
    
    const questionsRef = collection(db, 'questions');
    const allQuestionsSnapshot = await getDocs(questionsRef);
    
    const stats = {
      totalQuestions: 0,
      activeQuestions: 0,
      inactiveQuestions: 0,
      categories: {},
      difficulties: {},
      sources: {},
      averageUsage: 0,
      averageCorrectRate: 0
    };
    
    let totalUsage = 0;
    let totalCorrectRate = 0;
    let questionsWithUsage = 0;
    
    allQuestionsSnapshot.forEach(doc => {
      const data = doc.data();
      stats.totalQuestions++;
      
      if (data.isActive) {
        stats.activeQuestions++;
      } else {
        stats.inactiveQuestions++;
      }
      
      // Category stats
      const category = data.category || 'Unknown';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
      
      // Difficulty stats
      const difficulty = data.difficulty || 'Unknown';
      stats.difficulties[difficulty] = (stats.difficulties[difficulty] || 0) + 1;
      
      // Source stats
      const source = data.source || 'Unknown';
      stats.sources[source] = (stats.sources[source] || 0) + 1;
      
      // Usage stats
      if (data.timesUsed > 0) {
        totalUsage += data.timesUsed;
        totalCorrectRate += data.correctAnswerRate || 0;
        questionsWithUsage++;
      }
    });
    
    // Calculate averages
    if (questionsWithUsage > 0) {
      stats.averageUsage = totalUsage / questionsWithUsage;
      stats.averageCorrectRate = totalCorrectRate / questionsWithUsage;
    }
    
    console.log('✅ Question statistics calculated');
    
    return {
      success: true,
      stats
    };
    
  } catch (error) {
    console.error('❌ Error calculating question statistics:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test question extraction system
 */
export const testQuestionExtraction = async () => {
  try {
    console.log('🧪 Testing question extraction system...');
    
    const results = {
      getActiveQuestions: false,
      getQuestionStats: false,
      getFromLatestBatch: false
    };
    
    // Test 1: Get active questions
    const activeResult = await getActiveQuestions({ limit: 5 });
    results.getActiveQuestions = activeResult.success;
    console.log(`✅ Get active questions: ${results.getActiveQuestions ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Get question stats
    const statsResult = await getQuestionStats();
    results.getQuestionStats = statsResult.success;
    console.log(`✅ Get question stats: ${results.getQuestionStats ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Get from latest batch
    const latestResult = await getQuestionsFromLatestBatch(3);
    results.getFromLatestBatch = latestResult.success;
    console.log(`✅ Get from latest batch: ${results.getFromLatestBatch ? 'PASSED' : 'FAILED'}`);
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 Question extraction test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      activeQuestions: activeResult.count || 0,
      totalQuestions: statsResult.stats?.totalQuestions || 0
    };
    
  } catch (error) {
    console.error('❌ Question extraction test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 