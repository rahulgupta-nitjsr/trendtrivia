/**
 * Comprehensive Fallback Service
 * Provides 120 questions organized by topic and timeframe (40 per topic × 3 timeframes)
 * Each topic/timeframe combination has exactly 10 questions
 */

// Import JSON data using dynamic import
let fallbackData = null;

async function loadFallbackData() {
  if (!fallbackData) {
    try {
      const response = await fetch('/src/comprehensive-fallback-questions.json');
      fallbackData = await response.json();
    } catch (error) {
      console.error('❌ Error loading fallback data:', error);
      // Fallback to basic structure
      fallbackData = {
        metadata: {
          totalQuestions: 120,
          topics: ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'],
          timeframes: ['last_week', 'last_month', 'last_year'],
          questionsPerTopicTimeframe: 10
        },
        questions: {}
      };
    }
  }
  return fallbackData;
}
import { randomizeQuestionsArray, analyzeAnswerDistribution } from '../utils/questionRandomizer.js';

/**
 * Get comprehensive fallback questions for a specific topic and timeframe
 * @param {string} topic - The topic (Technology, Pop Culture, Finance, Start-Ups)
 * @param {string} timeframe - The timeframe (last_week, last_month, last_year)
 * @param {number} count - Number of questions to return (default: 10)
 * @returns {Object} Questions with metadata
 */
export const getComprehensiveFallbackQuestions = async (topic, timeframe, count = 10) => {
  try {
    console.log(`🔍 Getting comprehensive fallback questions for ${topic} - ${timeframe} (${count} questions)`);
    
    // Load fallback data
    const data = await loadFallbackData();
    
    // Validate topic
    const validTopics = data.metadata.topics;
    if (!validTopics.includes(topic)) {
      throw new Error(`Invalid topic: ${topic}. Valid options: ${validTopics.join(', ')}`);
    }
    
    // Validate timeframe
    const validTimeframes = data.metadata.timeframes;
    if (!validTimeframes.includes(timeframe)) {
      throw new Error(`Invalid timeframe: ${timeframe}. Valid options: ${validTimeframes.join(', ')}`);
    }
    
    // Get questions for the specific topic and timeframe
    const topicQuestions = data.questions[topic];
    if (!topicQuestions) {
      throw new Error(`No questions found for topic: ${topic}`);
    }
    
    const timeframeQuestions = topicQuestions[timeframe];
    if (!timeframeQuestions) {
      throw new Error(`No questions found for timeframe: ${timeframe}`);
    }
    
    // Ensure we have exactly 10 questions for this topic/timeframe
    if (timeframeQuestions.length !== 10) {
      console.warn(`⚠️ Expected 10 questions for ${topic}/${timeframe}, got ${timeframeQuestions.length}`);
    }
    
    // Take the requested number of questions (or all available)
    const selectedQuestions = timeframeQuestions.slice(0, Math.min(count, timeframeQuestions.length));
    
    // Apply randomization to ensure balanced answer distribution
    console.log(`🎲 Applying randomization to ${selectedQuestions.length} fallback questions...`);
    const randomizedQuestions = randomizeQuestionsArray(selectedQuestions);
    
    // Generate analytics for monitoring
    const distribution = analyzeAnswerDistribution(randomizedQuestions);
    
    console.log(`✅ Successfully retrieved ${randomizedQuestions.length} comprehensive fallback questions`);
    console.log(`📊 Answer distribution: A:${distribution.percentages.A}, B:${distribution.percentages.B}, C:${distribution.percentages.C}, D:${distribution.percentages.D}`);
    
    return {
      success: true,
      questions: randomizedQuestions,
      count: randomizedQuestions.length,
      source: 'comprehensive_fallback',
      topic,
      timeframe,
      randomizationApplied: true,
      answerDistribution: distribution,
      metadata: {
        requestedCount: count,
        actualCount: randomizedQuestions.length,
        topic,
        timeframe,
        fetchedAt: new Date().toISOString(),
        randomizedAt: new Date().toISOString(),
        fallbackVersion: data.metadata.version
      }
    };
    
  } catch (error) {
    console.error('❌ Error getting comprehensive fallback questions:', error);
    
    // Emergency fallback to basic questions
    const emergencyQuestions = getEmergencyFallbackQuestions(count);
    
    return {
      success: false,
      error: error.message,
      questions: emergencyQuestions,
      count: emergencyQuestions.length,
      source: 'emergency_fallback',
      topic,
      timeframe,
      randomizationApplied: false
    };
  }
};

/**
 * Get fallback questions for any topic/timeframe combination
 * @param {Object} options - Options object
 * @returns {Object} Questions with metadata
 */
export const getFallbackQuestions = async (options = {}) => {
  const {
    topic = 'Technology',
    timeframe = 'last_week',
    count = 10
  } = options;
  
  return await getComprehensiveFallbackQuestions(topic, timeframe, count);
};

/**
 * Get all available fallback questions for a topic
 * @param {string} topic - The topic
 * @returns {Object} All questions for the topic across all timeframes
 */
export const getAllFallbackQuestionsForTopic = async (topic) => {
  try {
    console.log(`🔍 Getting all fallback questions for topic: ${topic}`);
    
    const data = await loadFallbackData();
    const validTopics = data.metadata.topics;
    if (!validTopics.includes(topic)) {
      throw new Error(`Invalid topic: ${topic}. Valid options: ${validTopics.join(', ')}`);
    }
    
    const topicQuestions = data.questions[topic];
    if (!topicQuestions) {
      throw new Error(`No questions found for topic: ${topic}`);
    }
    
    const allQuestions = [];
    const validTimeframes = data.metadata.timeframes;
    
    validTimeframes.forEach(timeframe => {
      const timeframeQuestions = topicQuestions[timeframe] || [];
      timeframeQuestions.forEach(question => {
        allQuestions.push({
          ...question,
          timeframe
        });
      });
    });
    
    console.log(`✅ Found ${allQuestions.length} total fallback questions for ${topic}`);
    
    return {
      success: true,
      questions: allQuestions,
      count: allQuestions.length,
      topic,
      timeframes: validTimeframes,
      metadata: {
        topic,
        totalQuestions: allQuestions.length,
        questionsPerTimeframe: allQuestions.length / validTimeframes.length,
        fetchedAt: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('❌ Error getting all fallback questions for topic:', error);
    return {
      success: false,
      error: error.message,
      questions: [],
      count: 0,
      topic
    };
  }
};

/**
 * Get fallback statistics
 * @returns {Object} Statistics about the fallback system
 */
export const getFallbackStatistics = async () => {
  try {
    const data = await loadFallbackData();
    const stats = {
      totalQuestions: data.metadata.totalQuestions,
      topics: data.metadata.topics,
      timeframes: data.metadata.timeframes,
      questionsPerTopicTimeframe: data.metadata.questionsPerTopicTimeframe,
      version: data.metadata.version,
      createdAt: data.metadata.createdAt
    };
    
    // Calculate questions per topic
    stats.questionsPerTopic = stats.totalQuestions / stats.topics.length;
    
    // Calculate questions per timeframe
    stats.questionsPerTimeframe = stats.totalQuestions / stats.timeframes.length;
    
    return {
      success: true,
      statistics: stats
    };
    
  } catch (error) {
    console.error('❌ Error getting fallback statistics:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test comprehensive fallback service
 * @returns {Object} Test results
 */
export const testComprehensiveFallbackService = async () => {
  try {
    console.log('🧪 Testing comprehensive fallback service...');
    
    const results = {
      getComprehensiveFallbackQuestions: false,
      getFallbackQuestions: false,
      getAllFallbackQuestionsForTopic: false,
      getFallbackStatistics: false
    };
    
    // Test 1: Get comprehensive fallback questions
    const comprehensiveResult = getComprehensiveFallbackQuestions('Technology', 'last_week', 5);
    results.getComprehensiveFallbackQuestions = comprehensiveResult.success;
    console.log(`✅ Get comprehensive fallback questions: ${results.getComprehensiveFallbackQuestions ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Get fallback questions with options
    const fallbackResult = getFallbackQuestions({ topic: 'Pop Culture', timeframe: 'last_month', count: 3 });
    results.getFallbackQuestions = fallbackResult.success;
    console.log(`✅ Get fallback questions with options: ${results.getFallbackQuestions ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Get all questions for a topic
    const allTopicResult = getAllFallbackQuestionsForTopic('Finance');
    results.getAllFallbackQuestionsForTopic = allTopicResult.success;
    console.log(`✅ Get all questions for topic: ${results.getAllFallbackQuestionsForTopic ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Get fallback statistics
    const statsResult = getFallbackStatistics();
    results.getFallbackStatistics = statsResult.success;
    console.log(`✅ Get fallback statistics: ${results.getFallbackStatistics ? 'PASSED' : 'FAILED'}`);
    
    const allTestsPassed = Object.values(results).every(result => result === true);
    
    console.log(`🧪 Comprehensive fallback service test: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
    
    return {
      success: allTestsPassed,
      results,
      questionCount: comprehensiveResult.questions?.length || 0,
      totalQuestions: statsResult.statistics?.totalQuestions || 0
    };
    
  } catch (error) {
    console.error('❌ Comprehensive fallback service test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Emergency fallback questions (basic questions when comprehensive system fails)
 */
const getEmergencyFallbackQuestions = (count = 10) => {
  const emergencyQuestions = [
    {
      id: 'emergency-1',
      question: 'What does "AI" stand for in technology?',
      options: ['Artificial Intelligence', 'Automated Integration', 'Advanced Interface', 'Algorithmic Innovation'],
      answer: 'Artificial Intelligence',
      details: 'AI stands for Artificial Intelligence, referring to computer systems that can perform tasks typically requiring human intelligence.',
      category: 'Technology',
      difficulty: 'easy',
      timeframe: 'last_year'
    },
    {
      id: 'emergency-2',
      question: 'Which company developed the iPhone?',
      options: ['Google', 'Microsoft', 'Apple', 'Samsung'],
      answer: 'Apple',
      details: 'Apple Inc. developed and released the first iPhone in 2007, revolutionizing the smartphone industry.',
      category: 'Technology',
      difficulty: 'easy',
      timeframe: 'last_year'
    },
    {
      id: 'emergency-3',
      question: 'What is the most popular programming language for web development?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      answer: 'JavaScript',
      details: 'JavaScript is the most widely used programming language for web development, running in browsers and servers.',
      category: 'Technology',
      difficulty: 'medium',
      timeframe: 'last_year'
    },
    {
      id: 'emergency-4',
      question: 'Which social media platform was founded by Mark Zuckerberg?',
      options: ['Twitter', 'Instagram', 'Facebook', 'LinkedIn'],
      answer: 'Facebook',
      details: 'Facebook was founded by Mark Zuckerberg in 2004 while he was a student at Harvard University.',
      category: 'Pop Culture',
      difficulty: 'easy',
      timeframe: 'last_year'
    },
    {
      id: 'emergency-5',
      question: 'What does "IPO" stand for in finance?',
      options: ['Initial Public Offering', 'International Portfolio Option', 'Investment Protection Order', 'Integrated Profit Operation'],
      answer: 'Initial Public Offering',
      details: 'IPO stands for Initial Public Offering, the process by which a private company offers shares to the public for the first time.',
      category: 'Finance',
      difficulty: 'medium',
      timeframe: 'last_year'
    }
  ];
  
  return emergencyQuestions.slice(0, count);
}; 