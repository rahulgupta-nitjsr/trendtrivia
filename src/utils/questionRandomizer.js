/**
 * Question Option Randomization Utility
 * 
 * This module handles randomizing multiple choice question options to ensure
 * equal distribution of correct answers across A, B, C, D positions.
 * 
 * Key Features:
 * - Shuffles question options randomly
 * - Updates answer field to match new correct position
 * - Handles both 'answer' and 'correct' field names
 * - Preserves all other question metadata
 * - Provides analytics for distribution tracking
 */

/**
 * Randomizes the options of a single question
 * @param {Object} question - The question object to randomize
 * @returns {Object} Question with randomized options
 */
export function randomizeQuestionOptions(question) {
  try {
    // Validate input
    if (!question || !question.options || !Array.isArray(question.options)) {
      console.warn('⚠️ Invalid question format for randomization:', question);
      return question; // Return original if invalid
    }

    // Handle both 'answer' and 'correct' field names
    const correctAnswer = question.answer || question.correct;
    
    if (!correctAnswer) {
      console.warn('⚠️ No correct answer found in question:', question.question);
      return question; // Return original if no correct answer
    }

    // Find the index of the correct answer in original options
    const originalCorrectIndex = question.options.indexOf(correctAnswer);
    
    if (originalCorrectIndex === -1) {
      console.warn('⚠️ Correct answer not found in options:', {
        question: question.question,
        correctAnswer,
        options: question.options
      });
      return question; // Return original if correct answer not in options
    }

    // Create a copy of options to shuffle
    const optionsCopy = [...question.options];
    
    // Fisher-Yates shuffle algorithm for true randomization
    for (let i = optionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
    }

    // The correct answer remains the same text, but may be in a different position
    const randomizedQuestion = {
      ...question,
      options: optionsCopy,
      answer: correctAnswer, // Keep the same correct answer text
      correct: correctAnswer, // Ensure both fields are updated
      // Add metadata about randomization
      randomized: true,
      randomizedAt: new Date().toISOString(),
      originalCorrectPosition: originalCorrectIndex,
      newCorrectPosition: optionsCopy.indexOf(correctAnswer)
    };

    return randomizedQuestion;

  } catch (error) {
    console.error('❌ Error randomizing question options:', error);
    return question; // Return original on error
  }
}

/**
 * Randomizes options for an array of questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} Array of questions with randomized options
 */
export function randomizeQuestionsArray(questions) {
  if (!Array.isArray(questions)) {
    console.warn('⚠️ Expected array of questions, got:', typeof questions);
    return questions;
  }

  console.log(`🎲 Randomizing options for ${questions.length} questions...`);
  
  const randomizedQuestions = questions.map((question, index) => {
    const randomized = randomizeQuestionOptions(question);
    
    // Log successful randomization
    if (randomized.randomized) {
      console.log(`✅ Question ${index + 1}: Moved correct answer from position ${randomized.originalCorrectPosition} to ${randomized.newCorrectPosition}`);
    }
    
    return randomized;
  });

  // Generate distribution analytics
  const analytics = analyzeAnswerDistribution(randomizedQuestions);
  console.log('📊 Answer distribution after randomization:', analytics);

  return randomizedQuestions;
}

/**
 * Analyzes the distribution of correct answers across A, B, C, D positions
 * @param {Array} questions - Array of randomized questions
 * @returns {Object} Distribution analytics
 */
export function analyzeAnswerDistribution(questions) {
  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  const letters = ['A', 'B', 'C', 'D'];
  
  questions.forEach(question => {
    if (question.options && question.options.length >= 4) {
      const correctAnswer = question.answer || question.correct;
      const correctIndex = question.options.indexOf(correctAnswer);
      
      if (correctIndex >= 0 && correctIndex < 4) {
        const letter = letters[correctIndex];
        distribution[letter]++;
      }
    }
  });

  const total = questions.length;
  const percentages = {};
  
  Object.keys(distribution).forEach(letter => {
    percentages[letter] = total > 0 ? ((distribution[letter] / total) * 100).toFixed(1) + '%' : '0%';
  });

  return {
    counts: distribution,
    percentages,
    total,
    isBalanced: isDistributionBalanced(distribution, total)
  };
}

/**
 * Checks if the answer distribution is reasonably balanced
 * @param {Object} distribution - Count of answers per position
 * @param {number} total - Total number of questions
 * @returns {boolean} True if distribution is balanced
 */
function isDistributionBalanced(distribution, total) {
  if (total === 0) return true;
  
  const expectedPerPosition = total / 4;
  const tolerance = Math.max(2, total * 0.15); // 15% tolerance or minimum 2
  
  return Object.values(distribution).every(count => 
    Math.abs(count - expectedPerPosition) <= tolerance
  );
}

/**
 * Enhanced question fetching wrapper that always includes randomization
 * This function should be used instead of direct database calls
 * @param {Function} fetchFunction - The original fetch function
 * @param {Object} options - Fetch options
 * @returns {Object} Result with randomized questions
 */
export async function fetchQuestionsWithRandomization(fetchFunction, options = {}) {
  try {
    console.log('🔄 Fetching questions with automatic randomization...');
    
    // Call the original fetch function
    const result = await fetchFunction(options);
    
    if (!result || !result.success || !result.questions) {
      console.warn('⚠️ Fetch function returned invalid result:', result);
      return result;
    }

    // Apply randomization to all questions
    const randomizedQuestions = randomizeQuestionsArray(result.questions);
    
    // Return enhanced result with randomized questions
    return {
      ...result,
      questions: randomizedQuestions,
      randomizationApplied: true,
      randomizedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error in fetchQuestionsWithRandomization:', error);
    throw error;
  }
}

export default {
  randomizeQuestionOptions,
  randomizeQuestionsArray,
  analyzeAnswerDistribution,
  fetchQuestionsWithRandomization
};