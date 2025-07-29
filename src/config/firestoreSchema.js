/**
 * Firestore Database Schema Documentation
 * Defines the structure of collections and documents in the TrendTrivia database
 */

// Collection: "questions" - stores individual quiz questions
// Document ID: auto-generated unique ID for each question
const questionSchema = {
  id: "string",                    // Unique identifier
  question: "string",              // The question text
  options: ["string"],             // Array of 4 answer options
  answer: "string",                // Correct answer (must be one of the options)
  details: "string",               // Explanation of the correct answer
  category: "string",              // Question category (Technology, Pop Culture, Finance, Start-Ups)
  difficulty: "string",            // Difficulty level (easy, medium, hard)
  
  // Metadata
  createdAt: "timestamp",          // When this question was created
  updatedAt: "timestamp",          // When last modified
  
  // Source tracking
  source: "string",                // Where this question came from (e.g., "AI-generated", "manual")
  batchId: "string",               // ID of the batch this question belongs to
  promptUsed: "string",            // ID of the prompt used to generate this question
  
  // Usage statistics
  timesUsed: "number",             // How many times this question has been used in quizzes
  correctAnswerRate: "number",     // Percentage of users who answered correctly (0-1)
  
  // Status
  isActive: "boolean",             // Whether this question is active and can be used
  isValidated: "boolean"           // Whether this question has been validated for quality
};

// Collection: "prompts" - stores AI prompt templates
// Document ID: auto-generated unique ID for each prompt
const promptSchema = {
  id: "string",             // Unique identifier
  topic: "string",          // Topic this prompt is for (e.g., "technology", "sports")
  template: "string",       // The actual prompt text sent to AI
  version: "string",        // Version identifier (e.g., "1.0", "2.1")
  isActive: "boolean",      // Whether this prompt is currently active
  description: "string",    // Human-readable description of what this prompt does
  
  // Metadata
  createdAt: "timestamp",   // When this prompt was created
  updatedAt: "timestamp",   // When last modified
  createdBy: "string",      // Who created this prompt (optional)
  
  // Performance tracking (optional)
  usageCount: "number",     // How many times this prompt has been used
  successRate: "number"     // Success rate of questions generated (0-1)
};

// Collection: "batches" - stores AI generation batches with complete metadata
// Document ID: auto-generated unique ID for each batch
const batchSchema = {
  // Basic identification
  batchId: "string",                    // Unique batch identifier (e.g., "batch-2024-01-15T10-30-00-abc123")
  
  // Generation metadata  
  generatedAt: "timestamp",             // When this batch was generated
  promptLength: "number",               // Length of the prompt used
  aiResponseLength: "number",           // Length of the AI response
  questionCount: "number",              // Number of questions in this batch
  
  // Content organization
  categories: ["string"],               // List of categories in this batch
  difficulties: ["string"],            // List of difficulty levels in this batch
  
  // Status and lifecycle
  status: "string",                     // Current status: "generated", "active", "inactive", "failed", "archived"
  createdAt: "timestamp",               // When the batch document was created
  updatedAt: "timestamp",               // When last modified
  activatedAt: "timestamp",             // When this batch was activated (if applicable)
  deactivatedAt: "timestamp",           // When this batch was deactivated (if applicable)
  
  // Complete data storage
  questions: [{                         // Array of complete question objects
    question: "string",
    options: ["string"],
    answer: "string", 
    details: "string",
    category: "string",
    difficulty: "string"
  }],
  rawResponse: "string",                // Original AI response for debugging/audit
  
  // Generation context
  trigger: "string",                    // What triggered this generation ("scheduled_weekly", "manual", etc.)
  promptSource: "string",               // Source of the prompt used
  
  // Quality metrics
  validationScore: "number",            // Overall quality score (0-1)
  validQuestionCount: "number",         // Number of questions that passed validation
  invalidQuestionCount: "number",       // Number of questions that failed validation
  
  // Usage tracking
  timesActivated: "number",             // How many times this batch has been activated
  questionsExtracted: "number",         // How many individual questions were extracted from this batch
  
  // Cost tracking
  estimatedCost: "number",              // Estimated API cost for this generation
  tokenCount: "number"                  // Number of tokens used in AI generation
};

// Collection: "topics" - stores quiz topic information
// Document ID: topic name (e.g., "technology", "pop-culture")
const topicSchema = {
  id: "string",                    // Topic identifier
  name: "string",                  // Display name
  description: "string",           // Topic description
  isActive: "boolean",             // Whether this topic is currently active
  
  // Statistics
  totalQuestions: "number",        // Total questions available for this topic
  activeQuestions: "number",       // Currently active questions
  
  // Configuration
  targetQuestionsPerBatch: "number", // How many questions to generate per batch for this topic
  difficulty: {                    // Difficulty distribution
    easy: "number",                // Percentage of easy questions (0-1)
    medium: "number",              // Percentage of medium questions (0-1) 
    hard: "number"                 // Percentage of hard questions (0-1)
  }
};

// Collection: "system_metadata" - stores system-wide metadata and configuration
// Document ID: "config" (single document)
const metadataSchema = {
  // Generation tracking
  lastGenerationAt: "timestamp",        // When the last AI generation occurred
  lastActiveBatchId: "string",          // ID of the currently active batch
  totalGenerations: "number",           // Total number of AI generations performed
  totalBatches: "number",               // Total number of batches created
  totalQuestions: "number",             // Total questions in the system
  
  // Scheduler configuration
  schedulerEnabled: "boolean",          // Whether automatic scheduling is enabled
  nextScheduledGeneration: "timestamp", // When the next scheduled generation will occur
  generationFrequency: "string",        // How often to generate ("weekly", "daily", etc.)
  
  // Cost tracking
  totalApiCalls: "number",              // Total API calls made
  totalEstimatedCost: "number",         // Total estimated cost of all API calls
  monthlyApiCalls: "number",            // API calls this month
  monthlyEstimatedCost: "number",       // Estimated cost this month
  
  // System health
  lastHealthCheck: "timestamp",         // Last time system health was checked
  systemStatus: "string",               // Overall system status ("healthy", "warning", "error")
  activeFeatures: ["string"],           // List of currently active features
  
  // Configuration
  maxQuestionsPerBatch: "number",       // Maximum questions per batch
  batchRetentionDays: "number",         // How long to keep old batches
  duplicatePreventionHours: "number",   // Hours to wait before allowing duplicate generation
  
  // Version tracking
  schemaVersion: "string",              // Database schema version
  lastMigration: "timestamp",           // Last time database was migrated
  
  // Audit trail
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

// Collection: "api_logs" - stores API call logs for cost monitoring
// Document ID: auto-generated unique ID for each API call
const apiLogSchema = {
  // Call identification
  callId: "string",                     // Unique identifier for this API call
  timestamp: "timestamp",               // When the call was made
  
  // API details
  endpoint: "string",                   // API endpoint called
  method: "string",                     // HTTP method used
  provider: "string",                   // AI provider (e.g., "Perplexity", "OpenAI")
  model: "string",                      // AI model used
  
  // Request details
  promptLength: "number",               // Length of the prompt sent
  maxTokens: "number",                  // Maximum tokens requested
  temperature: "number",                // Temperature setting used
  
  // Response details
  responseLength: "number",             // Length of the response received
  tokensUsed: "number",                 // Actual tokens consumed
  responseTime: "number",               // Time taken for the response (ms)
  
  // Cost tracking
  estimatedCost: "number",              // Estimated cost of this call
  costPerToken: "number",               // Cost per token for this model
  
  // Context
  batchId: "string",                    // Batch this call was part of (if applicable)
  trigger: "string",                    // What triggered this call
  purpose: "string",                    // Purpose of the call ("question_generation", "test", etc.)
  
  // Status
  success: "boolean",                   // Whether the call was successful
  errorMessage: "string",               // Error message if call failed
  retryCount: "number"                  // Number of retries attempted
};

// Collection: "user_sessions" - stores user quiz session data (future use)
// Document ID: auto-generated unique ID for each session
const userSessionSchema = {
  sessionId: "string",             // Unique session identifier
  startTime: "timestamp",          // When the session started
  endTime: "timestamp",            // When the session ended
  
  // Quiz data
  questionsAnswered: "number",     // Number of questions answered
  correctAnswers: "number",        // Number of correct answers
  score: "number",                 // Final score (0-100)
  
  // Question details
  questionIds: ["string"],         // IDs of questions used in this session
  batchId: "string",               // Batch the questions came from
  
  // User interaction
  timePerQuestion: ["number"],     // Time spent on each question (seconds)
  totalSessionTime: "number",      // Total time for the entire session (seconds)
  
  // Analytics
  categoryPerformance: {           // Performance by category
    "Technology": "number",        // Score for Technology questions (0-1)
    "Pop Culture": "number",       // Score for Pop Culture questions (0-1)
    "Finance": "number",           // Score for Finance questions (0-1)
    "Start-Ups": "number"          // Score for Start-Ups questions (0-1)
  },
  
  difficultyPerformance: {         // Performance by difficulty
    easy: "number",                // Score for easy questions (0-1)
    medium: "number",              // Score for medium questions (0-1)
    hard: "number"                 // Score for hard questions (0-1)
  }
};

export { 
  questionSchema, 
  promptSchema, 
  batchSchema,
  topicSchema, 
  metadataSchema,
  apiLogSchema,
  userSessionSchema 
}; 