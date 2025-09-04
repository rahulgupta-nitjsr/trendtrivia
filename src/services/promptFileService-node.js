/**
 * Node.js Compatible Prompt File Service
 * Handles reading AI prompts from markdown files dynamically with timeframe support
 * For use in Node.js scripts like simple-batch-generator.js
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Timeframe to prompt file mapping (relative to project root)
 */
const TIMEFRAME_PROMPTS = {
  'last_week': 'public/ai_components/prompts/last_week_prompt.md',
  'last_month': 'public/ai_components/prompts/last_month_prompt.md',
  'last_year': 'public/ai_components/prompts/last_year_prompt.md',
  'default': 'public/ai_components/ai_generation_prompt.md' // Legacy fallback
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
    
    // Use process.cwd() to get the current working directory (project root)
    const projectRoot = process.cwd();
    const absolutePath = join(projectRoot, promptPath);
    
    console.log(`📁 Absolute path: ${absolutePath}`);
    
    // Read the file using Node.js file system
    const promptContent = await readFile(absolutePath, 'utf8');
    
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
  
  if (prompt.length > 10000) {
    result.warnings.push('Prompt is very long (over 10,000 characters)');
  }
  
  // Check for required elements
  const requiredElements = [
    'quiz',
    'question',
    'multiple-choice',
    'JSON'
  ];
  
  const missingElements = requiredElements.filter(element => 
    !prompt.toLowerCase().includes(element.toLowerCase())
  );
  
  if (missingElements.length > 0) {
    result.warnings.push(`Missing recommended elements: ${missingElements.join(', ')}`);
  }
  
  // Check for AI-specific instructions
  const aiInstructions = [
    'generate',
    'create',
    'return',
    'output'
  ];
  
  const hasAiInstructions = aiInstructions.some(instruction => 
    prompt.toLowerCase().includes(instruction.toLowerCase())
  );
  
  if (!hasAiInstructions) {
    result.warnings.push('No clear AI generation instructions found');
  }
  
  // Check for JSON format instructions
  if (!prompt.toLowerCase().includes('json')) {
    result.warnings.push('No JSON format instructions found');
  }
  
  // Calculate statistics
  result.details = {
    length: prompt.length,
    wordCount: prompt.split(/\s+/).length,
    lineCount: prompt.split('\n').length,
    hasJsonInstructions: prompt.toLowerCase().includes('json'),
    hasAiInstructions: hasAiInstructions,
    missingElements: missingElements
  };
  
  // Final validation
  result.isValid = result.errors.length === 0;
  
  return result;
};

/**
 * Get validated prompt for a timeframe
 * @param {string} timeframe - The timeframe to get prompt for
 * @returns {Promise<Object>} Validation result with prompt
 */
export const getValidatedPrompt = async (timeframe = 'default') => {
  try {
    console.log(`🔍 Getting validated prompt for timeframe: ${timeframe}`);
    
    // Read the prompt
    const prompt = await readPromptFromFile(timeframe);
    
    // Validate the prompt
    const validation = validatePrompt(prompt);
    
    if (validation.isValid) {
      console.log('✅ Prompt validation passed');
      return {
        success: true,
        prompt,
        timeframe,
        validation
      };
    } else {
      console.error('❌ Prompt validation failed:', validation.errors);
      return {
        success: false,
        error: validation.errors.join(', '),
        timeframe,
        validation
      };
    }
    
  } catch (error) {
    console.error('❌ Error getting validated prompt:', error);
    return {
      success: false,
      error: error.message,
      timeframe
    };
  }
};

/**
 * Get validated prompt by timeframe (alias for getValidatedPrompt)
 * @param {string} timeframe - The timeframe
 * @returns {Promise<Object>} Validation result with prompt
 */
export const getValidatedPromptByTimeframe = async (timeframe) => {
  return await getValidatedPrompt(timeframe);
};

/**
 * Test prompt file reading functionality
 */
export const testPromptFileReading = async () => {
  try {
    console.log('🧪 Testing prompt file reading functionality...');
    
    const results = {
      readDefault: false,
      readLastWeek: false,
      readLastMonth: false,
      readLastYear: false,
      validation: false
    };
    
    // Test 1: Read default prompt
    const defaultPrompt = await readPromptFromFile('default');
    results.readDefault = defaultPrompt && defaultPrompt.length > 0;
    console.log(`✅ Read default prompt: ${results.readDefault ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Read last week prompt
    const lastWeekPrompt = await readPromptFromFile('last_week');
    results.readLastWeek = lastWeekPrompt && lastWeekPrompt.length > 0;
    console.log(`✅ Read last week prompt: ${results.readLastWeek ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Read last month prompt
    const lastMonthPrompt = await readPromptFromFile('last_month');
    results.readLastMonth = lastMonthPrompt && lastMonthPrompt.length > 0;
    console.log(`✅ Read last month prompt: ${results.readLastMonth ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Read last year prompt
    const lastYearPrompt = await readPromptFromFile('last_year');
    results.readLastYear = lastYearPrompt && lastYearPrompt.length > 0;
    console.log(`✅ Read last year prompt: ${results.readLastYear ? 'PASSED' : 'FAILED'}`);
    
    // Test 5: Validate a prompt
    const validation = validatePrompt(defaultPrompt);
    results.validation = validation.isValid;
    console.log(`✅ Prompt validation: ${results.validation ? 'PASSED' : 'FAILED'}`);
    
    const allPassed = Object.values(results).every(result => result);
    console.log(`\n📊 Test Results: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
    
    return {
      success: allPassed,
      results
    };
    
  } catch (error) {
    console.error('❌ Prompt file reading test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 