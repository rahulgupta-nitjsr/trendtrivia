// Firebase configuration for Node.js scripts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { config } from 'dotenv';

// Load environment variables
config();

// Firebase configuration object using process.env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "trendtrivia-9019c",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Validate environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('Missing Firebase environment variables:', missingVars);
  console.warn('Using demo configuration. Firebase features may not work properly.');
  console.warn('Please create a .env file with proper Firebase configuration for full functionality.');
}

// Initialize Firebase app with error handling
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  // Initialize Firestore database
  db = getFirestore(app);
  
  console.log('Firebase initialized successfully for Node.js script');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  console.warn('App will continue to run but Firebase features will be disabled');
  // Create a mock db object to prevent crashes
  db = null;
}

export { db }; 