/**
 * Enhanced Prompt File Service
 * Handles reading AI prompts from markdown files dynamically with timeframe support
 */

/**
 * Timeframe to prompt file mapping
 */
const TIMEFRAME_PROMPTS = {
  'last_week': '/ai_components/prompts/last_week_prompt.md',
  'last_month': '/ai_components/prompts/last_month_prompt.md',
  'last_year': '/ai_components/prompts/last_year_prompt.md',
  'default': '/ai_components/ai_generation_prompt.md' // Legacy fallback
};

/**
 * Calculate date ranges for timeframes
 * @param {string} timeframe - The timeframe ('last_week', 'last_month', 'last_year')
 * @returns {Object} Date range information
 */
export const calculateDateRange = (timeframe) => {
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  let startDate, endDate, daysBack, description;
  
  switch (timeframe) {
    case 'last_week':
      daysBack = 7;
      startDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'the last 7 days';
      break;
      
    case 'last_month':
      daysBack = 30;
      startDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'the last 30 days';
      break;
      
    case 'last_year':
      daysBack = 365;
      startDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'the last 365 days';
      break;
      
    default:
      daysBack = 90; // Default to 3 months for recent trends
      startDate = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'recent trends and developments (last few months)';
      break;
  }
  
  return {
    today: todayFormatted,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    daysBack,
    description,
    timeframe
  };
};

/**
 * Inject dynamic date context into prompt
 * @param {string} prompt - The original prompt content
 * @param {string} timeframe - The timeframe
 * @returns {string} Prompt with injected date context
 */
export const injectDateContext = (prompt, timeframe) => {
  const dateRange = calculateDateRange(timeframe);
  
  // Create dynamic date context section
  const dateContext = `
### 📅 DYNAMIC TIME CONTEXT - INJECTED:
- **Current Date**: ${dateRange.today}
- **Target Period**: ${dateRange.description}
- **Date Range**: From ${dateRange.startDate} to ${dateRange.endDate}
- **Days Back**: ${dateRange.daysBack} days from today
- **Search Instructions**: Use your real-time web search for events from ${dateRange.startDate} to ${dateRange.endDate}
- **Date Verification**: Every question must reference events that occurred between ${dateRange.startDate} and ${dateRange.endDate}
- **Exclusion Rule**: Do NOT include anything outside this date range

`;

  // Replace the static time context section with dynamic one
  let enhancedPrompt = prompt;
  
  // Find and replace the time context section
  const timeContextRegex = /### 📅 TIME CONTEXT.*?(?=## 🏷️|### 🏷️|## 🎯|### 🎯)/s;
  if (timeContextRegex.test(enhancedPrompt)) {
    enhancedPrompt = enhancedPrompt.replace(timeContextRegex, dateContext);
  } else {
    // If no time context section found, add it after the Perplexity instructions
    const perplexityRegex = /## 🎯 PERPLEXITY AI SPECIFIC INSTRUCTIONS:.*?(?=## 🏷️|### 🏷️|## 🎯|### 🎯)/s;
    if (perplexityRegex.test(enhancedPrompt)) {
      enhancedPrompt = enhancedPrompt.replace(perplexityRegex, `$&${dateContext}`);
    } else {
      // Add at the beginning if no sections found
      enhancedPrompt = dateContext + enhancedPrompt;
    }
  }
  
  // Also replace any remaining static date references
  enhancedPrompt = enhancedPrompt
    .replace(/LAST 7 DAYS ONLY/g, `LAST ${dateRange.daysBack} DAYS ONLY (${dateRange.startDate} to ${dateRange.endDate})`)
    .replace(/last 7 days/g, `${dateRange.description} (${dateRange.startDate} to ${dateRange.endDate})`)
    .replace(/last 30 days/g, `${dateRange.description} (${dateRange.startDate} to ${dateRange.endDate})`)
    .replace(/last 365 days/g, `${dateRange.description} (${dateRange.startDate} to ${dateRange.endDate})`)
    .replace(/this week/g, `the period from ${dateRange.startDate} to ${dateRange.endDate}`)
    .replace(/this month/g, `the period from ${dateRange.startDate} to ${dateRange.endDate}`)
    .replace(/this year/g, `the period from ${dateRange.startDate} to ${dateRange.endDate}`);
  
  return enhancedPrompt;
};

/**
 * Get valid timeframes
 * @returns {Array<string>} List of valid timeframes
 */
export const getValidTimeframes = () => {
  return Object.keys(TIMEFRAME_PROMPTS).filter(key => key !== 'default');
};

/**
 * Read prompt from timeframe-specific file
 * @param {string} timeframe - The timeframe ('last_week', 'last_month', 'last_year')
 * @returns {Promise<string>} The prompt content
 */
export const readPromptFromFile = async (timeframe = 'default') => {
  try {
    const promptPath = TIMEFRAME_PROMPTS[timeframe] || TIMEFRAME_PROMPTS.default;
    console.log(`📖 Reading prompt from ${promptPath} (timeframe: ${timeframe})...`);
    
    // In a browser environment, we need to fetch the file
    const response = await fetch(promptPath);
    
    if (!response.ok) {
      // Fallback to default if timeframe-specific file fails
      if (timeframe !== 'default') {
        console.warn(`⚠️ Failed to load ${timeframe} prompt, falling back to default`);
        return await readPromptFromFile('default');
      }
      throw new Error(`Failed to fetch prompt file: ${response.status} ${response.statusText}`);
    }
    
    const promptContent = await response.text();
    
    if (!promptContent || promptContent.trim().length === 0) {
      throw new Error('Prompt file is empty or invalid');
    }
    
    console.log('✅ Successfully read prompt file');
    console.log(`📝 Prompt length: ${promptContent.length} characters`);
    console.log(`🕒 Timeframe: ${timeframe}`);
    
    // Inject dynamic date context
    const enhancedPrompt = injectDateContext(promptContent, timeframe);
    console.log(`📅 Injected dynamic date context for ${timeframe}`);
    
    return enhancedPrompt.trim();
    
  } catch (error) {
    console.error('❌ Error reading prompt file:', error);
    
    // Fallback to a basic prompt if file reading fails
    const fallbackPrompt = `You are an expert quiz generator for TrendTrivia.

Generate 10 multiple-choice quiz questions for EACH of the following topics based on the latest news and trends:
- Technology  
- Pop Culture
- Finance
- Start-Ups

Each question must be a JSON object with: question, options (4 choices), answer, details, category, difficulty, timeframe.

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
  
  // Check for required topics (updated to match enhanced prompts)
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
 * Get validated prompt content for specific timeframe
 * @param {string} timeframe - The timeframe ('last_week', 'last_month', 'last_year')
 * @returns {Promise<string>} Validated prompt content
 */
export const getValidatedPrompt = async (timeframe = 'default') => {
  try {
    const prompt = await readPromptFromFile(timeframe);
    
    const validationResult = validatePrompt(prompt);
    if (!validationResult.isValid) {
      throw new Error(`Prompt validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    return prompt;
  } catch (error) {
    console.error('Error getting validated prompt:', error);
    throw error;
  }
};