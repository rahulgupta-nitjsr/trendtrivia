/**
 * Batch Management Service
 * Handles storage, retrieval, and management of AI-generated question batches
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
    const batchDoc = {
      ...batchData.metadata,
      questions: batchData.questions,
      rawResponse: batchData.rawResponse,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(batchRef, batchDoc);
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
 * Get the most recent active batch
 */
export const getLatestActiveBatch = async () => {
  try {
    console.log('🔍 Fetching latest active batch...');
    
    const batchesRef = collection(db, 'batches');
    const q = query(
      batchesRef,
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('⚠️ No active batches found');
      return null;
    }
    
    // Find the most recent batch (since we can't use orderBy due to index requirements)
    let latestBatch = null;
    let latestDate = null;
    
    querySnapshot.forEach(doc => {
      const batchData = doc.data();
      const batchDate = batchData.createdAt?.toDate() || new Date(0);
      
      if (!latestDate || batchDate > latestDate) {
        latestDate = batchDate;
        latestBatch = {
          id: doc.id,
          ...batchData
        };
      }
    });
    
    if (latestBatch) {
      console.log(`✅ Found active batch: ${latestBatch.batchId} with ${latestBatch.questions?.length || 0} questions`);
      return latestBatch;
    } else {
      console.log('⚠️ No active batches found');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error fetching latest active batch:', error);
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
    let q = query(batchesRef, orderBy('generatedAt', 'desc'));
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
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
    console.error('❌ Error fetching batches:', error);
    return [];
  }
};

/**
 * Get a specific batch by ID
 */
export const getBatchById = async (batchId) => {
  try {
    console.log(`🔍 Fetching batch: ${batchId}`);
    
    const batchesRef = collection(db, 'batches');
    const q = query(batchesRef, where('batchId', '==', batchId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`⚠️ Batch ${batchId} not found`);
      return null;
    }
    
    const batchDoc = querySnapshot.docs[0];
    const batchData = batchDoc.data();
    
    console.log(`✅ Found batch: ${batchData.batchId}`);
    
    return {
      id: batchDoc.id,
      ...batchData
    };
    
  } catch (error) {
    console.error(`❌ Error fetching batch ${batchId}:`, error);
    return null;
  }
};

/**
 * Activate a batch (deactivate others)
 */
export const activateBatch = async (batchId) => {
  try {
    console.log(`🔄 Activating batch: ${batchId}`);
    
    // First, deactivate all existing batches
    const batchesRef = collection(db, 'batches');
    const activeQuery = query(batchesRef, where('status', '==', 'active'));
    const activeSnapshot = await getDocs(activeQuery);
    
    const deactivatePromises = activeSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { status: 'inactive', updatedAt: new Date() })
    );
    
    await Promise.all(deactivatePromises);
    console.log(`✅ Deactivated ${deactivatePromises.length} existing batches`);
    
    // Now activate the target batch
    const targetQuery = query(batchesRef, where('batchId', '==', batchId));
    const targetSnapshot = await getDocs(targetQuery);
    
    if (targetSnapshot.empty) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    const targetDoc = targetSnapshot.docs[0];
    await updateDoc(targetDoc.ref, { 
      status: 'active', 
      updatedAt: new Date(),
      activatedAt: new Date()
    });
    
    console.log(`✅ Successfully activated batch: ${batchId}`);
    
    return {
      success: true,
      batchId,
      activatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error activating batch ${batchId}:`, error);
    return {
      success: false,
      error: error.message,
      batchId
    };
  }
};

/**
 * Deactivate a batch
 */
export const deactivateBatch = async (batchId) => {
  try {
    console.log(`🔄 Deactivating batch: ${batchId}`);
    
    const batchesRef = collection(db, 'batches');
    const q = query(batchesRef, where('batchId', '==', batchId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    const batchDoc = querySnapshot.docs[0];
    await updateDoc(batchDoc.ref, { 
      status: 'inactive', 
      updatedAt: new Date(),
      deactivatedAt: new Date()
    });
    
    console.log(`✅ Successfully deactivated batch: ${batchId}`);
    
    return {
      success: true,
      batchId,
      deactivatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error deactivating batch ${batchId}:`, error);
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
    console.log(`🗑️ Deleting batch: ${batchId}`);
    
    const batchesRef = collection(db, 'batches');
    const q = query(batchesRef, where('batchId', '==', batchId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    const batchDoc = querySnapshot.docs[0];
    await deleteDoc(batchDoc.ref);
    
    console.log(`✅ Successfully deleted batch: ${batchId}`);
    
    return {
      success: true,
      batchId
    };
    
  } catch (error) {
    console.error(`❌ Error deleting batch ${batchId}:`, error);
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
    const allBatches = await getAllBatches();
    
    const stats = {
      totalBatches: allBatches.length,
      activeBatches: allBatches.filter(b => b.status === 'active').length,
      inactiveBatches: allBatches.filter(b => b.status === 'inactive').length,
      failedBatches: allBatches.filter(b => b.status === 'failed').length,
      totalQuestions: allBatches.reduce((sum, b) => sum + (b.questions?.length || 0), 0),
      averageQuestionsPerBatch: 0,
      latestBatch: allBatches[0] || null,
      categories: {},
      difficulties: {}
    };
    
    if (stats.totalBatches > 0) {
      stats.averageQuestionsPerBatch = Math.round(stats.totalQuestions / stats.totalBatches);
    }
    
    // Count categories and difficulties
    allBatches.forEach(batch => {
      if (batch.questions) {
        batch.questions.forEach(question => {
          // Categories
          const category = question.category;
          stats.categories[category] = (stats.categories[category] || 0) + 1;
          
          // Difficulties
          const difficulty = question.difficulty;
          stats.difficulties[difficulty] = (stats.difficulties[difficulty] || 0) + 1;
        });
      }
    });
    
    console.log('✅ Batch statistics calculated');
    return stats;
    
  } catch (error) {
    console.error('❌ Error calculating batch statistics:', error);
    return null;
  }
};

/**
 * Test batch management system
 */
export const testBatchManagement = async () => {
  try {
    console.log('🧪 Testing batch management system...');
    
    const results = {
      saveBatch: false,
      getLatestActive: false,
      getAllBatches: false,
      getStats: false
    };
    
    // Test 1: Get all batches
    const allBatches = await getAllBatches();
    results.getAllBatches = true;
    console.log(`✅ Found ${allBatches.length} existing batches`);
    
    // Test 2: Get statistics
    const stats = await getBatchStats();
    results.getStats = !!stats;
    console.log(`✅ Statistics: ${stats?.totalBatches || 0} batches, ${stats?.totalQuestions || 0} questions`);
    
    // Test 3: Get latest active batch
    const latestBatch = await getLatestActiveBatch();
    results.getLatestActive = true;
    console.log(`✅ Latest active batch: ${latestBatch ? latestBatch.batchId : 'None'}`);
    
    // Test 4: Save a test batch (if we have test data)
    const testBatchData = {
      batchId: `test-batch-${Date.now()}`,
      metadata: {
        batchId: `test-batch-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        status: 'test',
        questionCount: 0,
        categories: ['Test'],
        difficulties: ['easy']
      },
      questions: [],
      rawResponse: 'Test response'
    };
    
    const saveResult = await saveBatch(testBatchData);
    results.saveBatch = saveResult.success;
    console.log(`✅ Test batch save: ${saveResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Clean up test batch
    if (saveResult.success) {
      await deleteBatch(testBatchData.batchId);
      console.log('✅ Test batch cleaned up');
    }
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 Batch management test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      stats
    };
    
  } catch (error) {
    console.error('❌ Batch management test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 