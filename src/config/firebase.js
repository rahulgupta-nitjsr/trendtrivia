// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration object using environment variables
// These values come from your .env file and are NOT committed to GitHub
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "trendtrivia-9019c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
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
const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
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
  
  // Connect to Firestore emulator in development (DISABLED for online testing)
  if (import.meta.env.DEV && false) { // Temporarily disabled
    console.log('🔧 Connecting to Firestore emulator...');
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Connected to Firestore emulator at localhost:8080');
    } catch (emulatorError) {
      console.warn('⚠️ Could not connect to Firestore emulator:', emulatorError.message);
      console.warn('Make sure Firebase emulators are running: firebase emulators:start');
    }
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  console.warn('App will continue to run but Firebase features will be disabled');
  // Create a mock db object to prevent crashes
  db = null;
}

export { db }; 