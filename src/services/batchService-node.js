/**
 * Node.js Compatible Batch Management Service
 * Handles storage, retrieval, and management of AI-generated question batches
 * For use in Node.js scripts like simple-batch-generator.js
 */

import { db } from '../config/firebase-node.js';
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
  limit,
  deleteDoc 
} from 'firebase/firestore';

/**
 * Save a complete AI generation batch to Firestore
 */
export const saveBatch = async (batchData) => {
  try {
    console.log(`💾 Saving batch ${batchData.batchId} to Firestore...`);
    
    const batchRef = collection(db, 'batches');
    
    // Clean the data to remove undefined values
    const cleanMetadata = {};
    if (batchData.metadata) {
      Object.keys(batchData.metadata).forEach(key => {
        if (batchData.metadata[key] !== undefined) {
          cleanMetadata[key] = batchData.metadata[key];
        }
      });
    }
    
    const batchDoc = {
      // Ensure we persist identifiers used by activation queries
      batchId: batchData.batchId,
      timeframe: batchData.timeframe || cleanMetadata.timeframe || 'unknown',
      // Activation-related defaults
      isActive: false,
      status: cleanMetadata.status || 'generated',
      ...cleanMetadata,
      questions: batchData.questions || [],
      rawResponse: batchData.rawResponse || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(batchRef, batchDoc);
    console.log(`✅ Batch ${batchData.batchId} saved with ID: ${docRef.id}`);
    
    return {
      success: true,
      batchId: batchData.batchId,
      firestoreId: docRef.id,
      questionCount: batchData.questions?.length || 0
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
 * Get the latest active batch for a timeframe
 */
export const getLatestActiveBatch = async (timeframe) => {
  try {
    const batchesRef = collection(db, 'batches');
    
    // Simple query without complex filters to avoid index issues
    const q = query(
      batchesRef,
      where('timeframe', '==', timeframe),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const batchDoc = querySnapshot.docs[0];
    return {
      id: batchDoc.id,
      ...batchDoc.data()
    };
    
  } catch (error) {
    console.error('❌ Failed to get latest active batch:', error);
    
    // If it's an index error, return null gracefully
    if (error.code === 'failed-precondition') {
      console.warn('⚠️ Firebase index not available, skipping batch lookup');
      return null;
    }
    
    return null;
  }
};

/**
 * Get all batches with optional filtering
 */
export const getAllBatches = async (filters = {}) => {
  try {
    console.log('🔍 Fetching all batches...');
    
    const batchesRef = collection(db, 'batches');
    let q = query(batchesRef);
    
    // Apply filters
    if (filters.timeframe) {
      q = query(q, where('timeframe', '==', filters.timeframe));
    }
    
    if (filters.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    
    // Add ordering
    q = query(q, orderBy('createdAt', 'desc'));
    
    // Add limit if specified
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const batches = [];
    
    querySnapshot.forEach(doc => {
      batches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Found ${batches.length} batches`);
    return batches;
    
  } catch (error) {
    console.error('❌ Failed to fetch batches:', error);
    return [];
  }
};

/**
 * Get a specific batch by ID
 */
export const getBatchById = async (batchId) => {
  try {
    console.log(`🔍 Fetching batch: ${batchId}...`);
    
    const batchRef = doc(db, 'batches', batchId);
    const batchDoc = await getDoc(batchRef);
    
    if (!batchDoc.exists()) {
      console.log(`⚠️ Batch ${batchId} not found`);
      return null;
    }
    
    console.log(`✅ Found batch: ${batchId}`);
    return {
      id: batchDoc.id,
      ...batchDoc.data()
    };
    
  } catch (error) {
    console.error(`❌ Failed to fetch batch ${batchId}:`, error);
    return null;
  }
};

/**
 * Activate a batch (deactivate all others)
 */
export const activateBatch = async (batchId) => {
  try {
    console.log(`🔄 Activating batch: ${batchId}...`);
    
    // First, deactivate all other batches
    const batchesRef = collection(db, 'batches');
    const activeQuery = query(batchesRef, where('isActive', '==', true));
    const activeSnapshot = await getDocs(activeQuery);
    
    const deactivatePromises = activeSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isActive: false, updatedAt: new Date() })
    );
    
    await Promise.all(deactivatePromises);
    console.log(`✅ Deactivated ${activeSnapshot.docs.length} other batches`);
    
    // Now activate the specified batch
    const batchRef = doc(db, 'batches', batchId);
    await updateDoc(batchRef, { 
      isActive: true, 
      updatedAt: new Date(),
      activatedAt: new Date()
    });
    
    console.log(`✅ Batch ${batchId} activated successfully`);
    
    return {
      success: true,
      batchId,
      deactivatedCount: activeSnapshot.docs.length
    };
    
  } catch (error) {
    console.error(`❌ Failed to activate batch ${batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId
    };
  }
};

/**
 * Activate a batch for a specific timeframe
 */
export const activateBatchForTimeframe = async (batchId, timeframe) => {
  try {
    console.log(`🔄 Activating batch ${batchId} for timeframe: ${timeframe}...`);
    
    // First, deactivate all other batches for this timeframe
    const batchesRef = collection(db, 'batches');
    const activeQuery = query(
      batchesRef, 
      where('isActive', '==', true),
      where('timeframe', '==', timeframe)
    );
    const activeSnapshot = await getDocs(activeQuery);
    
    const deactivatePromises = activeSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isActive: false, updatedAt: new Date() })
    );
    
    await Promise.all(deactivatePromises);
    console.log(`✅ Deactivated ${activeSnapshot.docs.length} other batches for timeframe: ${timeframe}`);
    
    // Retry mechanism to find the batch (Firestore eventual consistency)
    let batchDoc = null;
    let retryCount = 0;
    const maxRetries = 5; // Increased retries
    const retryDelay = 2000; // Increased delay to 2 seconds
    
    while (!batchDoc && retryCount < maxRetries) {
      try {
        // Find the batch document by batchId (not document ID)
        const batchQuery = query(batchesRef, where('batchId', '==', batchId));
        const batchSnapshot = await getDocs(batchQuery);
        
        if (!batchSnapshot.empty) {
          batchDoc = batchSnapshot.docs[0];
          console.log(`✅ Found batch ${batchId} on attempt ${retryCount + 1}`);
          break;
        }
        
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`⏳ Batch ${batchId} not found, retrying in ${retryDelay}ms (attempt ${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      } catch (queryError) {
        console.warn(`⚠️ Query error on attempt ${retryCount + 1}:`, queryError.message);
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
    
    if (!batchDoc) {
      throw new Error(`Batch ${batchId} not found in Firestore after ${maxRetries} attempts`);
    }
    
    // Now activate the specified batch using the correct document ID
    await updateDoc(batchDoc.ref, { 
      isActive: true, 
      updatedAt: new Date(),
      activatedAt: new Date(),
      timeframe
    });
    
    console.log(`✅ Batch ${batchId} activated for timeframe: ${timeframe}`);
    
    return {
      success: true,
      batchId,
      timeframe,
      deactivatedCount: activeSnapshot.docs.length,
      retryCount
    };
    
  } catch (error) {
    console.error(`❌ Failed to activate batch ${batchId} for timeframe ${timeframe}:`, error);
    return {
      success: false,
      error: error.message,
      batchId,
      timeframe
    };
  }
};

/**
 * Deactivate a batch
 */
export const deactivateBatch = async (batchId) => {
  try {
    console.log(`🔄 Deactivating batch: ${batchId}...`);
    
    const batchRef = doc(db, 'batches', batchId);
    await updateDoc(batchRef, { 
      isActive: false, 
      updatedAt: new Date(),
      deactivatedAt: new Date()
    });
    
    console.log(`✅ Batch ${batchId} deactivated successfully`);
    
    return {
      success: true,
      batchId
    };
    
  } catch (error) {
    console.error(`❌ Failed to deactivate batch ${batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId
    };
  }
};

/**
 * Delete a batch
 */
export const deleteBatch = async (batchId) => {
  try {
    console.log(`🗑️ Deleting batch: ${batchId}...`);
    
    const batchRef = doc(db, 'batches', batchId);
    await deleteDoc(batchRef);
    
    console.log(`✅ Batch ${batchId} deleted successfully`);
    
    return {
      success: true,
      batchId
    };
    
  } catch (error) {
    console.error(`❌ Failed to delete batch ${batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId
    };
  }
};

/**
 * Get batch statistics
 */
export const getBatchStats = async () => {
  try {
    console.log('📊 Fetching batch statistics...');
    
    const batchesRef = collection(db, 'batches');
    const querySnapshot = await getDocs(batchesRef);
    
    const stats = {
      totalBatches: 0,
      activeBatches: 0,
      totalQuestions: 0,
      timeframes: {},
      recentBatches: []
    };
    
    querySnapshot.forEach(doc => {
      const batchData = doc.data();
      stats.totalBatches++;
      
      if (batchData.isActive) {
        stats.activeBatches++;
      }
      
      if (batchData.questions) {
        stats.totalQuestions += batchData.questions.length;
      }
      
      if (batchData.timeframe) {
        stats.timeframes[batchData.timeframe] = (stats.timeframes[batchData.timeframe] || 0) + 1;
      }
      
      // Track recent batches (last 5)
      if (batchData.createdAt) {
        stats.recentBatches.push({
          id: doc.id,
          batchId: batchData.batchId,
          timeframe: batchData.timeframe,
          questionCount: batchData.questions?.length || 0,
          createdAt: batchData.createdAt,
          isActive: batchData.isActive
        });
      }
    });
    
    // Sort recent batches by creation date
    stats.recentBatches.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    stats.recentBatches = stats.recentBatches.slice(0, 5);
    
    console.log(`✅ Batch statistics: ${stats.totalBatches} total, ${stats.activeBatches} active, ${stats.totalQuestions} questions`);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Failed to fetch batch statistics:', error);
    return {
      totalBatches: 0,
      activeBatches: 0,
      totalQuestions: 0,
      timeframes: {},
      recentBatches: [],
      error: error.message
    };
  }
};

/**
 * Test batch management functionality
 */
/**
 * Archive old batches older than specified weeks
 */
export const archiveOldBatches = async (weeksOld = 4) => {
  try {
    console.log(`🗄️ Archiving batches older than ${weeksOld} weeks...`);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (weeksOld * 7));
    
    const batchesRef = collection(db, 'batches');
    const oldBatchesQuery = query(
      batchesRef,
      where('createdAt', '<', cutoffDate),
      where('isActive', '==', false)
    );
    
    const snapshot = await getDocs(oldBatchesQuery);
    let archivedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      try {
        await updateDoc(docSnapshot.ref, {
          archived: true,
          archivedAt: new Date(),
          updatedAt: new Date()
        });
        archivedCount++;
      } catch (error) {
        console.error(`Failed to archive batch ${docSnapshot.id}:`, error);
      }
    }
    
    console.log(`✅ Archived ${archivedCount} old batches`);
    return {
      success: true,
      archivedCount,
      cutoffDate
    };
    
  } catch (error) {
    console.error('❌ Archive operation failed:', error);
    return {
      success: false,
      error: error.message,
      archivedCount: 0
    };
  }
};

/**
 * Initialize Firebase for Node.js environment
 */
export const initializeFirebaseNode = async () => {
  try {
    // Firebase is already initialized in firebase-node.js
    // Just verify the connection
    const testQuery = query(collection(db, 'batches'), limit(1));
    await getDocs(testQuery);
    console.log('✅ Firebase Node.js connection verified');
    return { success: true };
  } catch (error) {
    console.error('❌ Firebase Node.js initialization failed:', error);
    throw error;
  }
};

/**
 * Store questions in a batch (alias for saveBatch for compatibility)
 */
export const storeQuestionsInBatch = async (questions, timeframe, metadata = {}) => {
  const batchData = {
    batchId: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timeframe,
    questions,
    metadata: {
      ...metadata,
      timeframe,
      questionCount: questions.length,
      createdAt: new Date()
    }
  };
  
  const result = await saveBatch(batchData);
  return result.success ? batchData.batchId : null;
};

export const testBatchManagement = async () => {
  try {
    console.log('🧪 Testing batch management functionality...');
    
    const results = {
      saveBatch: false,
      getLatestActive: false,
      getAllBatches: false,
      getBatchById: false,
      activateBatch: false,
      getStats: false
    };
    
    // Test 1: Save batch
    const testBatch = {
      batchId: 'test-batch-' + Date.now(),
      questions: [
        {
          question: 'Test question?',
          options: ['A', 'B', 'C'],
          correctAnswer: 'A',
          explanation: 'Test explanation'
        }
      ],
      metadata: {
        timeframe: 'last_week',
        trigger: 'test',
        model: 'test-model'
      }
    };
    
    const saveResult = await saveBatch(testBatch);
    results.saveBatch = saveResult.success;
    console.log(`✅ Save batch: ${results.saveBatch ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Get latest active
    const latestResult = await getLatestActiveBatch();
    results.getLatestActive = latestResult !== null;
    console.log(`✅ Get latest active: ${results.getLatestActive ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Get all batches
    const allBatches = await getAllBatches();
    results.getAllBatches = Array.isArray(allBatches);
    console.log(`✅ Get all batches: ${results.getAllBatches ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Get batch by ID
    if (saveResult.success) {
      const batchResult = await getBatchById(saveResult.firestoreId);
      results.getBatchById = batchResult !== null;
      console.log(`✅ Get batch by ID: ${results.getBatchById ? 'PASSED' : 'FAILED'}`);
    }
    
    // Test 5: Activate batch
    if (saveResult.success) {
      const activateResult = await activateBatch(saveResult.firestoreId);
      results.activateBatch = activateResult.success;
      console.log(`✅ Activate batch: ${results.activateBatch ? 'PASSED' : 'FAILED'}`);
    }
    
    // Test 6: Get stats
    const statsResult = await getBatchStats();
    results.getStats = statsResult && typeof statsResult.totalBatches === 'number';
    console.log(`✅ Get stats: ${results.getStats ? 'PASSED' : 'FAILED'}`);
    
    const allPassed = Object.values(results).every(result => result);
    console.log(`\n📊 Test Results: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
    
    return {
      success: allPassed,
      results
    };
    
  } catch (error) {
    console.error('❌ Batch management test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 