/**
 * API Logging Service
 * Tracks all AI API calls with cost monitoring and duplicate prevention
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
    const callId = callData.callId || generateCallId();
    
    // Calculate costs if not provided
    let estimatedCost = callData.estimatedCost;
    if (!estimatedCost && callData.provider && callData.model) {
      const inputTokens = callData.inputTokens || estimateTokensFromText(callData.prompt);
      const outputTokens = callData.outputTokens || estimateTokensFromText(callData.response);
      estimatedCost = calculateEstimatedCost(callData.provider, callData.model, inputTokens, outputTokens);
    }
    
    const logEntry = {
      // Call identification
      callId,
      timestamp: new Date(),
      
      // API details
      endpoint: callData.endpoint || '',
      method: callData.method || 'POST',
      provider: callData.provider || 'unknown',
      model: callData.model || 'unknown',
      
      // Request details
      promptLength: callData.prompt?.length || 0,
      maxTokens: callData.maxTokens || 0,
      temperature: callData.temperature || 0,
      
      // Response details
      responseLength: callData.response?.length || 0,
      tokensUsed: callData.tokensUsed || callData.outputTokens || 0,
      responseTime: callData.responseTime || 0,
      
      // Cost tracking
      estimatedCost: estimatedCost || 0,
      costPerToken: estimatedCost && callData.tokensUsed ? 
        estimatedCost / callData.tokensUsed : 0,
      
      // Context
      batchId: callData.batchId || null,
      trigger: callData.trigger || 'unknown',
      purpose: callData.purpose || 'question_generation',
      
      // Status
      success: callData.success !== false,
      errorMessage: callData.errorMessage || null,
      retryCount: callData.retryCount || 0,
      
      // Additional metadata
      inputTokens: callData.inputTokens || estimateTokensFromText(callData.prompt),
      outputTokens: callData.outputTokens || estimateTokensFromText(callData.response)
    };
    
    const apiLogsRef = collection(db, 'api_logs');
    const docRef = await addDoc(apiLogsRef, logEntry);
    
    console.log(`📊 API call logged: ${callId} (Cost: $${estimatedCost.toFixed(4)})`);
    
    return {
      success: true,
      callId,
      logId: docRef.id,
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
 * Get API call logs with filtering
 */
export const getApiLogs = async (options = {}) => {
  try {
    const {
      limit: logLimit = 50,
      provider = null,
      batchId = null,
      success = null,
      startDate = null,
      endDate = null
    } = options;
    
    console.log(`🔍 Fetching API logs (limit: ${logLimit})`);
    
    const apiLogsRef = collection(db, 'api_logs');
    let q = query(
      apiLogsRef,
      orderBy('timestamp', 'desc'),
      limit(logLimit)
    );
    
    // Apply filters
    if (provider) {
      q = query(q, where('provider', '==', provider));
    }
    
    if (batchId) {
      q = query(q, where('batchId', '==', batchId));
    }
    
    if (success !== null) {
      q = query(q, where('success', '==', success));
    }
    
    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      
      // Apply date filters (client-side for now)
      if (startDate && data.timestamp.toDate() < startDate) return;
      if (endDate && data.timestamp.toDate() > endDate) return;
      
      logs.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate()
      });
    });
    
    console.log(`✅ Found ${logs.length} API logs`);
    
    return {
      success: true,
      logs,
      count: logs.length
    };
    
  } catch (error) {
    console.error('❌ Error fetching API logs:', error);
    return {
      success: false,
      error: error.message,
      logs: []
    };
  }
};

/**
 * Get cost statistics
 */
export const getCostStatistics = async (timeframe = 'all') => {
  try {
    console.log(`📊 Calculating cost statistics (timeframe: ${timeframe})`);
    
    // Get all logs for calculation
    const logsResult = await getApiLogs({ limit: 1000 });
    if (!logsResult.success) {
      throw new Error('Failed to fetch logs for statistics');
    }
    
    const logs = logsResult.logs;
    const now = new Date();
    
    // Filter by timeframe
    let filteredLogs = logs;
    if (timeframe !== 'all') {
      const cutoffDate = new Date();
      switch (timeframe) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filteredLogs = logs.filter(log => log.timestamp >= cutoffDate);
    }
    
    // Calculate statistics
    const stats = {
      timeframe,
      totalCalls: filteredLogs.length,
      successfulCalls: filteredLogs.filter(log => log.success).length,
      failedCalls: filteredLogs.filter(log => !log.success).length,
      totalCost: filteredLogs.reduce((sum, log) => sum + (log.estimatedCost || 0), 0),
      totalTokens: filteredLogs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
      averageCostPerCall: 0,
      averageTokensPerCall: 0,
      
      // Provider breakdown
      providerStats: {},
      
      // Model breakdown
      modelStats: {},
      
      // Purpose breakdown
      purposeStats: {},
      
      // Daily breakdown (for charts)
      dailyStats: []
    };
    
    // Calculate averages
    if (stats.totalCalls > 0) {
      stats.averageCostPerCall = stats.totalCost / stats.totalCalls;
      stats.averageTokensPerCall = stats.totalTokens / stats.totalCalls;
    }
    
    // Provider statistics
    filteredLogs.forEach(log => {
      const provider = log.provider || 'unknown';
      if (!stats.providerStats[provider]) {
        stats.providerStats[provider] = {
          calls: 0,
          cost: 0,
          tokens: 0,
          successRate: 0
        };
      }
      
      stats.providerStats[provider].calls++;
      stats.providerStats[provider].cost += log.estimatedCost || 0;
      stats.providerStats[provider].tokens += log.tokensUsed || 0;
    });
    
    // Calculate success rates for providers
    Object.keys(stats.providerStats).forEach(provider => {
      const providerLogs = filteredLogs.filter(log => log.provider === provider);
      const successfulLogs = providerLogs.filter(log => log.success);
      stats.providerStats[provider].successRate = 
        providerLogs.length > 0 ? successfulLogs.length / providerLogs.length : 0;
    });
    
    // Model statistics
    filteredLogs.forEach(log => {
      const model = log.model || 'unknown';
      if (!stats.modelStats[model]) {
        stats.modelStats[model] = {
          calls: 0,
          cost: 0,
          tokens: 0
        };
      }
      
      stats.modelStats[model].calls++;
      stats.modelStats[model].cost += log.estimatedCost || 0;
      stats.modelStats[model].tokens += log.tokensUsed || 0;
    });
    
    // Purpose statistics
    filteredLogs.forEach(log => {
      const purpose = log.purpose || 'unknown';
      if (!stats.purposeStats[purpose]) {
        stats.purposeStats[purpose] = {
          calls: 0,
          cost: 0
        };
      }
      
      stats.purposeStats[purpose].calls++;
      stats.purposeStats[purpose].cost += log.estimatedCost || 0;
    });
    
    console.log(`✅ Cost statistics calculated: $${stats.totalCost.toFixed(4)} total`);
    
    return {
      success: true,
      stats
    };
    
  } catch (error) {
    console.error('❌ Error calculating cost statistics:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check for recent API calls to prevent duplicates
 */
export const checkRecentCalls = async (hours = 1) => {
  try {
    console.log(`🔍 Checking for recent API calls (last ${hours} hours)`);
    
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    
    const apiLogsRef = collection(db, 'api_logs');
    const q = query(
      apiLogsRef,
      where('timestamp', '>=', Timestamp.fromDate(cutoffTime)),
      where('success', '==', true),
      where('purpose', '==', 'question_generation'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const recentCalls = [];
    
    querySnapshot.forEach(doc => {
      recentCalls.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });
    
    const hasRecentCall = recentCalls.length > 0;
    
    console.log(`${hasRecentCall ? '⚠️' : '✅'} Recent calls check: ${recentCalls.length} calls found`);
    
    return {
      success: true,
      hasRecentCall,
      recentCalls,
      mostRecentCall: recentCalls[0] || null
    };
    
  } catch (error) {
    console.error('❌ Error checking recent calls:', error);
    return {
      success: false,
      error: error.message,
      hasRecentCall: false
    };
  }
};

/**
 * Update system metadata with cost information
 */
export const updateCostMetadata = async () => {
  try {
    console.log('🔄 Updating cost metadata...');
    
    const [allTimeStats, monthlyStats] = await Promise.all([
      getCostStatistics('all'),
      getCostStatistics('month')
    ]);
    
    if (!allTimeStats.success || !monthlyStats.success) {
      throw new Error('Failed to get cost statistics');
    }
    
    const metadataRef = doc(db, 'system_metadata', 'config');
    await updateDoc(metadataRef, {
      totalApiCalls: allTimeStats.stats.totalCalls,
      totalEstimatedCost: allTimeStats.stats.totalCost,
      monthlyApiCalls: monthlyStats.stats.totalCalls,
      monthlyEstimatedCost: monthlyStats.stats.totalCost,
      lastCostUpdate: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Cost metadata updated');
    
    return {
      success: true,
      allTimeCost: allTimeStats.stats.totalCost,
      monthlyCost: monthlyStats.stats.totalCost
    };
    
  } catch (error) {
    console.error('❌ Error updating cost metadata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test API logging system
 */
export const testApiLogging = async () => {
  try {
    console.log('🧪 Testing API logging system...');
    
    const results = {
      logApiCall: false,
      getApiLogs: false,
      getCostStats: false,
      checkRecentCalls: false
    };
    
    // Test 1: Log a test API call
    const testCallData = {
      provider: 'perplexity',
      model: 'sonar',
      prompt: 'Test prompt for logging',
      response: 'Test response from API',
      maxTokens: 100,
      temperature: 0.2,
      responseTime: 1500,
      success: true,
      purpose: 'test',
      trigger: 'test_run'
    };
    
    const logResult = await logApiCall(testCallData);
    results.logApiCall = logResult.success;
    console.log(`✅ Log API call: ${results.logApiCall ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Get API logs
    const logsResult = await getApiLogs({ limit: 5 });
    results.getApiLogs = logsResult.success;
    console.log(`✅ Get API logs: ${results.getApiLogs ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Get cost statistics
    const statsResult = await getCostStatistics('all');
    results.getCostStats = statsResult.success;
    console.log(`✅ Get cost stats: ${results.getCostStats ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Check recent calls
    const recentResult = await checkRecentCalls(24);
    results.checkRecentCalls = recentResult.success;
    console.log(`✅ Check recent calls: ${results.checkRecentCalls ? 'PASSED' : 'FAILED'}`);
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 API logging test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      testCallId: logResult.callId,
      totalLogs: logsResult.count || 0,
      totalCost: statsResult.stats?.totalCost || 0
    };
    
  } catch (error) {
    console.error('❌ API logging test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 