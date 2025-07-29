/**
 * Prompt File Service
 * Handles reading AI prompts from markdown files dynamically
 */

/**
 * Read prompt from the ai_generation_prompt.md file
 * @returns {Promise<string>} The prompt content
 */
export const readPromptFromFile = async () => {
  try {
    console.log('📖 Reading prompt from ai_components/ai_generation_prompt.md...');
    
    // In a browser environment, we need to fetch the file
    const response = await fetch('/ai_components/ai_generation_prompt.md');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt file: ${response.status} ${response.statusText}`);
    }
    
    const promptContent = await response.text();
    
    if (!promptContent || promptContent.trim().length === 0) {
      throw new Error('Prompt file is empty or invalid');
    }
    
    console.log('✅ Successfully read prompt file');
    console.log(`📝 Prompt length: ${promptContent.length} characters`);
    
    return promptContent.trim();
    
  } catch (error) {
    console.error('❌ Error reading prompt file:', error);
    
    // Fallback to a basic prompt if file reading fails
    const fallbackPrompt = `You are an expert quiz generator for TrendTrivia.

Generate 10 multiple-choice quiz questions for EACH of the following topics based on the latest news and trends:
- Technology  
- Pop Culture
- Finance
- Start-Ups

Each question must be a JSON object with: question, options (4 choices), answer, details, category, difficulty.

Return ONLY a valid JSON array with exactly 40 objects (10 per topic).`;

    console.warn('⚠️ Using fallback prompt due to file reading error');
    return fallbackPrompt;
  }
};

/**
 * Validate prompt content (ENHANCED)
 * @param {string} prompt - The prompt content to validate
 * @returns {Object} Validation result with details
 */
export const validatePrompt = (prompt) => {
  const result = {
    isValid: false,
    errors: [],
    warnings: [],
    details: {}
  };
  
  // Basic validation
  if (!prompt || typeof prompt !== 'string') {
    result.errors.push('Invalid or empty prompt');
    return result;
  }
  
  if (prompt.trim().length < 100) {
    result.errors.push('Prompt is too short (minimum 100 characters)');
    return result;
  }
  
  // Check for required topics
  const requiredTopics = ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'];
  const missingTopics = requiredTopics.filter(topic => 
    !prompt.includes(topic)
  );
  
  if (missingTopics.length > 0) {
    result.errors.push(`Missing required topics: ${missingTopics.join(', ')}`);
  }
  
  // Check for required structure elements
  const requiredElements = [
    { element: 'JSON', description: 'JSON format requirement' },
    { element: 'question', description: 'Question field requirement' },
    { element: 'options', description: 'Options field requirement' },
    { element: 'answer', description: 'Answer field requirement' },
    { element: 'details', description: 'Details field requirement' },
    { element: 'category', description: 'Category field requirement' },
    { element: 'difficulty', description: 'Difficulty field requirement' }
  ];
  
  const missingElements = requiredElements.filter(item => 
    !prompt.toLowerCase().includes(item.element.toLowerCase())
  );
  
  if (missingElements.length > 0) {
    result.errors.push(`Missing required elements: ${missingElements.map(e => e.element).join(', ')}`);
  }
  
  // Check for quantity requirements
  if (!prompt.includes('10') && !prompt.includes('ten')) {
    result.warnings.push('No clear quantity specification found (should mention 10 questions per topic)');
  }
  
  if (!prompt.includes('40') && !prompt.includes('forty')) {
    result.warnings.push('No total quantity specification found (should mention 40 total questions)');
  }
  
  // Check for output format requirements
  if (!prompt.toLowerCase().includes('array')) {
    result.warnings.push('No array format requirement found');
  }
  
  // Calculate details
  result.details = {
    length: prompt.length,
    topicsFound: requiredTopics.filter(topic => prompt.includes(topic)),
    elementsFound: requiredElements.filter(item => 
      prompt.toLowerCase().includes(item.element.toLowerCase())
    ).map(item => item.element),
    hasQuantitySpec: prompt.includes('10') || prompt.includes('ten'),
    hasTotalSpec: prompt.includes('40') || prompt.includes('forty'),
    hasArraySpec: prompt.toLowerCase().includes('array')
  };
  
  // Determine if valid
  result.isValid = result.errors.length === 0;
  
  // Log results
  if (result.isValid) {
    console.log('✅ Prompt validation passed');
    if (result.warnings.length > 0) {
      console.warn('⚠️ Prompt validation warnings:', result.warnings);
    }
  } else {
    console.error('❌ Prompt validation failed:', result.errors);
  }
  
  return result;
};

/**
 * Get validated prompt content
 * @returns {Promise<string>} Validated prompt content
 */
export const getValidatedPrompt = async () => {
  try {
    const prompt = await readPromptFromFile();
    
    const validationResult = validatePrompt(prompt);
    if (!validationResult.isValid) {
      throw new Error(`Prompt validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    return prompt;
    
  } catch (error) {
    console.error('❌ Error getting validated prompt:', error);
    throw error;
  }
};

/**
 * Test the prompt file reading system
 * @returns {Promise<Object>} Test results
 */
export const testPromptFileReading = async () => {
  try {
    console.log('🧪 Testing prompt file reading system...');
    
    const startTime = Date.now();
    const prompt = await getValidatedPrompt();
    const endTime = Date.now();
    
    const result = {
      success: true,
      message: 'Prompt file reading test successful!',
      promptLength: prompt.length,
      readTime: `${endTime - startTime}ms`,
      containsRequiredTopics: ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'].every(topic =>
        prompt.includes(topic)
      )
    };
    
    console.log('✅ Prompt file reading test completed:', result);
    return result;
    
  } catch (error) {
    const result = {
      success: false,
      message: error.message,
      error: error
    };
    
    console.error('❌ Prompt file reading test failed:', result);
    return result;
  }
}; 