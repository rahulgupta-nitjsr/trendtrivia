/**
 * Node.js Compatible Firestore Service
 * Provides emergency fallback questions without Firebase dependencies
 */

/**
 * Get emergency fallback questions (hardcoded, no Firebase required)
 * @param {number} count - Number of questions to return
 * @returns {Array} Array of emergency fallback questions
 */
export const getEmergencyFallbackQuestions = (count = 10) => {
  console.log(`🚨 [EMERGENCY] Using hardcoded emergency questions (${count} requested)`);
  
  const fallbackQuestions = [
    {
      id: 'emergency_tech_1',
      question: 'What does "AI" stand for in technology?',
      options: ['Artificial Intelligence', 'Automated Integration', 'Advanced Interface', 'Algorithmic Innovation'],
      answer: 'Artificial Intelligence',
      details: 'AI stands for Artificial Intelligence, referring to computer systems that can perform tasks typically requiring human intelligence.',
      category: 'Technology',
      difficulty: 'easy'
    },
    {
      id: 'emergency_tech_2',
      question: 'Which company developed the iPhone?',
      options: ['Google', 'Microsoft', 'Apple', 'Samsung'],
      answer: 'Apple',
      details: 'Apple Inc. developed and released the first iPhone in 2007, revolutionizing the smartphone industry.',
      category: 'Technology',
      difficulty: 'easy'
    },
    {
      id: 'emergency_tech_3',
      question: 'What is the most popular programming language for web development?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      answer: 'JavaScript',
      details: 'JavaScript is the most widely used programming language for web development, running in browsers and servers.',
      category: 'Technology',
      difficulty: 'medium'
    },
    {
      id: 'emergency_pop_1',
      question: 'Which social media platform was founded by Mark Zuckerberg?',
      options: ['Twitter', 'Instagram', 'Facebook', 'LinkedIn'],
      answer: 'Facebook',
      details: 'Facebook was founded by Mark Zuckerberg in 2004 while he was a student at Harvard University.',
      category: 'Pop Culture',
      difficulty: 'easy'
    },
    {
      id: 'emergency_finance_1',
      question: 'What does "IPO" stand for in finance?',
      options: ['Initial Public Offering', 'International Portfolio Option', 'Investment Protection Order', 'Integrated Profit Operation'],
      answer: 'Initial Public Offering',
      details: 'IPO stands for Initial Public Offering, the process by which a private company offers shares to the public for the first time.',
      category: 'Finance',
      difficulty: 'medium'
    },
    {
      id: 'emergency_startup_1',
      question: 'What is a "unicorn" in startup terminology?',
      options: ['A mythical creature', 'A startup valued over $1 billion', 'A failed company', 'A new employee'],
      answer: 'A startup valued over $1 billion',
      details: 'A unicorn startup is a privately held startup company valued at over $1 billion.',
      category: 'Start-Ups',
      difficulty: 'medium'
    },
    {
      id: 'emergency_tech_4',
      question: 'What does "HTTP" stand for?',
      options: ['HyperText Transfer Protocol', 'High Tech Transfer Process', 'Home Tool Transfer Program', 'Host Text Transfer Protocol'],
      answer: 'HyperText Transfer Protocol',
      details: 'HTTP is the foundation of data communication for the World Wide Web.',
      category: 'Technology',
      difficulty: 'medium'
    },
    {
      id: 'emergency_pop_2',
      question: 'Which platform is known for short-form videos?',
      options: ['Facebook', 'Twitter', 'TikTok', 'LinkedIn'],
      answer: 'TikTok',
      details: 'TikTok is a social media platform known for short-form video content.',
      category: 'Pop Culture',
      difficulty: 'easy'
    },
    {
      id: 'emergency_finance_2',
      question: 'What is cryptocurrency?',
      options: ['Physical coins', 'Digital currency', 'Bank notes', 'Credit cards'],
      answer: 'Digital currency',
      details: 'Cryptocurrency is a digital or virtual currency secured by cryptography.',
      category: 'Finance',
      difficulty: 'easy'
    },
    {
      id: 'emergency_startup_2',
      question: 'What does "MVP" stand for in startups?',
      options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Major Venture Project'],
      answer: 'Minimum Viable Product',
      details: 'MVP is a version of a product with enough features to attract early-adopter customers.',
      category: 'Start-Ups',
      difficulty: 'medium'
    }
  ];
  
  const selectedQuestions = fallbackQuestions.slice(0, Math.min(count, fallbackQuestions.length));
  
  console.log(`✅ [EMERGENCY] Providing ${selectedQuestions.length} emergency hardcoded questions`);
  
  return selectedQuestions;
};

/**
 * Mock function for testing - returns success status
 */
export const getSystemStatus = async () => {
  return {
    success: true,
    status: 'operational',
    message: 'Emergency fallback system is working',
    timestamp: new Date().toISOString()
  };
};
