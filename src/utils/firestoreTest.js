import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Test Firestore connectivity by writing and reading a test document.
 * Logs results to the console.
 */
export async function testFirestoreConnection() {
  // Check if Firebase is properly initialized
  if (!db) {
    console.warn('Firebase not initialized. Skipping Firestore test.');
    return;
  }

  try {
    // Write a test document
    const testRef = await addDoc(collection(db, 'testCollection'), {
      message: 'Hello from TrendTrivia!',
      timestamp: new Date(),
    });
    console.log('Test document written with ID:', testRef.id);

    // Read the test document
    const docSnap = await getDoc(doc(db, 'testCollection', testRef.id));
    if (docSnap.exists()) {
      console.log('Test document read from Firestore:', docSnap.data());
    } else {
      console.error('Test document not found after write!');
    }
  } catch (error) {
    console.warn('Firestore test failed (this is expected in development without proper config):', error.message);
  }
} 