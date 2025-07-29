/**
 * AI API Configuration for TrendTrivia
 * Handles Perplexity AI API integration for dynamic content generation
 */

// Perplexity AI API Configuration using environment variables
const aiConfig = {
  apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY || 'demo-key',
  endpoint: import.meta.env.VITE_PERPLEXITY_API_ENDPOINT || 'https://api.perplexity.ai/chat/completions',
  model: import.meta.env.VITE_PERPLEXITY_MODEL || 'sonar',
  maxTokens: parseInt(import.meta.env.VITE_PERPLEXITY_MAX_TOKENS) || 20000,
  temperature: parseFloat(import.meta.env.VITE_PERPLEXITY_TEMPERATURE) || 0.2
};

// Debug logging for max tokens
console.log('🔧 AI Config Debug:');
console.log('  - VITE_PERPLEXITY_MAX_TOKENS:', import.meta.env.VITE_PERPLEXITY_MAX_TOKENS);
console.log('  - Parsed maxTokens:', aiConfig.maxTokens);
console.log('  - Is NaN?', isNaN(aiConfig.maxTokens));

// Validate Perplexity configuration
const requiredPerplexityVars = ['VITE_PERPLEXITY_API_KEY'];
const missingPerplexityVars = requiredPerplexityVars.filter(varName => !import.meta.env[varName]);

if (missingPerplexityVars.length > 0) {
  console.warn('Missing Perplexity AI environment variables:', missingPerplexityVars);
  console.warn('AI content generation will not work until these are configured.');
  console.warn('App will continue to run with demo configuration.');
} else {
  console.log('Perplexity AI configuration loaded successfully');
}

export { aiConfig }; 