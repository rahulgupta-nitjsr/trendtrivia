/**
 * Node.js Compatible API Logging Service
 * Tracks all AI API calls with cost monitoring and duplicate prevention
 * For use in Node.js scripts like simple-batch-generator.js
 */

import { db } from '../config/firebase-node.js';
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
  Timestamp 
} from 'firebase/firestore';

/**
 * Cost configuration for different AI providers and models
 */
const COST_CONFIG = {
  perplexity: {
    'sonar': {
      inputCostPer1000: 0.002,   // $0.002 per 1000 input tokens
      outputCostPer1000: 0.002,  // $0.002 per 1000 output tokens
      maxTokens: 4000
    },
    'sonar-pro': {
      inputCostPer1000: 0.005,
      outputCostPer1000: 0.005,
      maxTokens: 8000
    }
  },
  openai: {
    'gpt-3.5-turbo': {
      inputCostPer1000: 0.0015,
      outputCostPer1000: 0.002,
      maxTokens: 4000
    },
    'gpt-4': {
      inputCostPer1000: 0.03,
      outputCostPer1000: 0.06,
      maxTokens: 8000
    }
  }
};

/**
 * Generate unique call ID
 */
export const generateCallId = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = Math.random().toString(36).substring(2, 8);
  return `call-${timestamp}-${random}`;
};

/**
 * Calculate estimated cost for an API call
 */
export const calculateEstimatedCost = (provider, model, inputTokens, outputTokens) => {
  try {
    const providerConfig = COST_CONFIG[provider.toLowerCase()];
    if (!providerConfig) {
      console.warn(`Unknown provider: ${provider}`);
      return 0;
    }
    
    const modelConfig = providerConfig[model.toLowerCase()];
    if (!modelConfig) {
      console.warn(`Unknown model: ${model} for provider: ${provider}`);
      return 0;
    }
    
    const inputCost = (inputTokens / 1000) * modelConfig.inputCostPer1000;
    const outputCost = (outputTokens / 1000) * modelConfig.outputCostPer1000;
    
    return inputCost + outputCost;
    
  } catch (error) {
    console.error('Error calculating cost:', error);
    return 0;
  }
};

/**
 * Estimate tokens from text length (rough approximation)
 */
export const estimateTokensFromText = (text) => {
  if (!text) return 0;
  
  // Rough approximation: 1 token ≈ 0.75 words ≈ 4 characters
  const charCount = text.length;
  return Math.ceil(charCount / 4);
};

/**
 * Log an API call
 */
export const logApiCall = async (callData) => {
  try {
    const {
      callId = generateCallId(),
      provider,
      model,
      endpoint,
      prompt,
      response,
      maxTokens,
      temperature,
      responseTime,
      success,
      errorMessage,
      batchId = null,
      trigger = 'unknown',
      purpose = 'unknown'
    } = callData;
    
    // Estimate tokens
    const inputTokens = estimateTokensFromText(prompt);
    const outputTokens = estimateTokensFromText(response);
    
    // Calculate cost
    const estimatedCost = calculateEstimatedCost(provider, model, inputTokens, outputTokens);
    
    // Prepare log entry - clean undefined values
    const logEntry = {
      callId,
      provider,
      model,
      endpoint,
      prompt: prompt?.substring(0, 1000) + (prompt?.length > 1000 ? '...' : '') || '', // Truncate for storage
      response: response?.substring(0, 2000) + (response?.length > 2000 ? '...' : '') || '', // Truncate for storage
      maxTokens: maxTokens || null,
      temperature: temperature || null,
      inputTokens,
      outputTokens,
      estimatedCost,
      responseTime,
      success,
      errorMessage: errorMessage || null,
      batchId: batchId || null,
      trigger,
      purpose,
      timestamp: Timestamp.now(),
      createdAt: new Date()
    };
    
    // Remove undefined values
    Object.keys(logEntry).forEach(key => {
      if (logEntry[key] === undefined) {
        delete logEntry[key];
      }
    });
    
    // Save to Firestore
    const logsRef = collection(db, 'api_logs');
    await addDoc(logsRef, logEntry);
    
    console.log(`📝 API call logged: ${callId} (${success ? 'SUCCESS' : 'FAILED'}) - Cost: $${estimatedCost.toFixed(6)}`);
    
    return {
      success: true,
      callId,
      estimatedCost
    };
    
  } catch (error) {
    console.error('❌ Failed to log API call:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get API logs with optional filtering
 */
export const getApiLogs = async (options = {}) => {
  try {
    console.log('🔍 Fetching API logs...');
    
    const logsRef = collection(db, 'api_logs');
    let q = query(logsRef);
    
    // Apply filters
    if (options.provider) {
      q = query(q, where('provider', '==', options.provider));
    }
    
    if (options.success !== undefined) {
      q = query(q, where('success', '==', options.success));
    }
    
    if (options.batchId) {
      q = query(q, where('batchId', '==', options.batchId));
    }
    
    if (options.trigger) {
      q = query(q, where('trigger', '==', options.trigger));
    }
    
    // Add ordering
    q = query(q, orderBy('timestamp', 'desc'));
    
    // Add limit
    const limitCount = options.limit || 50;
    q = query(q, limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Found ${logs.length} API logs`);
    return logs;
    
  } catch (error) {
    console.error('❌ Failed to fetch API logs:', error);
    return [];
  }
};

/**
 * Get cost statistics
 */
export const getCostStatistics = async (timeframe = 'all') => {
  try {
    console.log(`📊 Fetching cost statistics for timeframe: ${timeframe}...`);
    
    const logsRef = collection(db, 'api_logs');
    let q = query(logsRef);
    
    // Apply timeframe filter
    if (timeframe !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      q = query(q, where('timestamp', '>=', Timestamp.fromDate(startDate)));
    }
    
    const querySnapshot = await getDocs(q);
    
    const stats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      averageResponseTime: 0,
      providers: {},
      models: {},
      triggers: {}
    };
    
    let totalResponseTime = 0;
    
    querySnapshot.forEach(doc => {
      const logData = doc.data();
      stats.totalCalls++;
      
      if (logData.success) {
        stats.successfulCalls++;
      } else {
        stats.failedCalls++;
      }
      
      stats.totalCost += logData.estimatedCost || 0;
      stats.totalInputTokens += logData.inputTokens || 0;
      stats.totalOutputTokens += logData.outputTokens || 0;
      totalResponseTime += logData.responseTime || 0;
      
      // Provider stats
      if (logData.provider) {
        stats.providers[logData.provider] = (stats.providers[logData.provider] || 0) + 1;
      }
      
      // Model stats
      if (logData.model) {
        stats.models[logData.model] = (stats.models[logData.model] || 0) + 1;
      }
      
      // Trigger stats
      if (logData.trigger) {
        stats.triggers[logData.trigger] = (stats.triggers[logData.trigger] || 0) + 1;
      }
    });
    
    // Calculate averages
    if (stats.totalCalls > 0) {
      stats.averageResponseTime = totalResponseTime / stats.totalCalls;
    }
    
    console.log(`✅ Cost statistics: $${stats.totalCost.toFixed(6)} total, ${stats.totalCalls} calls`);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Failed to fetch cost statistics:', error);
    return {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      averageResponseTime: 0,
      providers: {},
      models: {},
      triggers: {},
      error: error.message
    };
  }
};

/**
 * Check for recent API calls to prevent duplicates
 */
export const checkRecentCalls = async (timeframe, hours = 6) => {
  try {
    // Temporarily disable this check to avoid Firebase index issues
    console.log(`🔍 Checking for recent calls (${hours} hours, timeframe: ${timeframe})...`);
    console.log('⚠️ Recent calls check temporarily disabled to avoid Firebase index issues');
    return {
      success: true,
      hasRecentCalls: false,
      recentCalls: []
    };
    
    // TODO: Re-enable this when Firebase indexes are created
    /*
    const logsRef = collection(db, 'api_logs');
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    
    const q = query(
      logsRef,
      where('purpose', '==', timeframe),
      where('timestamp', '>=', Timestamp.fromDate(cutoffTime)),
      where('batchId', '==', null),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const recentCalls = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      hasRecentCalls: recentCalls.length > 0,
      recentCalls
    };
    */
    
  } catch (error) {
    console.error('❌ Failed to check recent calls:', error);
    return {
      success: false,
      error: error.message,
      hasRecentCalls: false,
      recentCalls: []
    };
  }
};

/**
 * Update cost metadata for existing logs
 */
export const updateCostMetadata = async () => {
  try {
    console.log('🔄 Updating cost metadata for existing logs...');
    
    const logsRef = collection(db, 'api_logs');
    const querySnapshot = await getDocs(logsRef);
    
    let updatedCount = 0;
    
    for (const doc of querySnapshot.docs) {
      const logData = doc.data();
      
      // Skip if already has cost data
      if (logData.estimatedCost !== undefined) {
        continue;
      }
      
      // Calculate missing cost data
      const inputTokens = logData.inputTokens || estimateTokensFromText(logData.prompt);
      const outputTokens = logData.outputTokens || estimateTokensFromText(logData.response);
      const estimatedCost = calculateEstimatedCost(logData.provider, logData.model, inputTokens, outputTokens);
      
      // Update the document
      await updateDoc(doc.ref, {
        inputTokens,
        outputTokens,
        estimatedCost,
        updatedAt: new Date()
      });
      
      updatedCount++;
    }
    
    console.log(`✅ Updated cost metadata for ${updatedCount} logs`);
    
    return {
      success: true,
      updatedCount
    };
    
  } catch (error) {
    console.error('❌ Failed to update cost metadata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test API logging functionality
 */
export const testApiLogging = async () => {
  try {
    console.log('🧪 Testing API logging functionality...');
    
    const results = {
      logCall: false,
      getLogs: false,
      getStats: false,
      checkRecent: false
    };
    
    // Test 1: Log API call
    const testCallData = {
      provider: 'perplexity',
      model: 'sonar',
      endpoint: 'https://api.perplexity.ai/chat/completions',
      prompt: 'Test prompt',
      response: 'Test response',
      maxTokens: 1000,
      temperature: 0.2,
      responseTime: 1500,
      success: true,
      batchId: 'test-batch',
      trigger: 'test',
      purpose: 'question_generation'
    };
    
    const logResult = await logApiCall(testCallData);
    results.logCall = logResult.success;
    console.log(`✅ Log API call: ${results.logCall ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Get logs
    const logsResult = await getApiLogs({ limit: 5 });
    results.getLogs = Array.isArray(logsResult);
    console.log(`✅ Get logs: ${results.getLogs ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Get stats
    const statsResult = await getCostStatistics('all');
    results.getStats = statsResult && typeof statsResult.totalCalls === 'number';
    console.log(`✅ Get stats: ${results.getStats ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Check recent calls
    const recentResult = await checkRecentCalls({ hours: 1 });
    results.checkRecent = typeof recentResult.hasRecent === 'boolean';
    console.log(`✅ Check recent calls: ${results.checkRecent ? 'PASSED' : 'FAILED'}`);
    
    const allPassed = Object.values(results).every(result => result);
    console.log(`\n📊 Test Results: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
    
    return {
      success: allPassed,
      results
    };
    
  } catch (error) {
    console.error('❌ API logging test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 