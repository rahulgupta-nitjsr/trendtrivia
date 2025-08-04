// AI configuration for Node.js scripts
import { config } from 'dotenv';

// Load environment variables
config();

// AI configuration object using process.env
const aiConfig = {
  apiKey: process.env.VITE_PERPLEXITY_API_KEY || 'demo-key',
  endpoint: process.env.VITE_PERPLEXITY_API_ENDPOINT || 'https://api.perplexity.ai/chat/completions',
  model: process.env.VITE_PERPLEXITY_MODEL || 'sonar',
  maxTokens: parseInt(process.env.VITE_PERPLEXITY_MAX_TOKENS) || 20000,
  temperature: parseFloat(process.env.VITE_PERPLEXITY_TEMPERATURE) || 0.2
};

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_PERPLEXITY_API_KEY',
  'VITE_PERPLEXITY_API_ENDPOINT',
  'VITE_PERPLEXITY_MODEL',
  'VITE_PERPLEXITY_MAX_TOKENS',
  'VITE_PERPLEXITY_TEMPERATURE'
];

// Validate environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('Missing AI environment variables:', missingVars);
  console.warn('Using demo configuration. AI features may not work properly.');
  console.warn('Please create a .env file with proper AI configuration for full functionality.');
}

export { aiConfig }; 