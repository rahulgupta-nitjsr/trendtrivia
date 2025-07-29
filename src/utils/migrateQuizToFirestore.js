import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Migrate questions from quiz.json to Firestore
 * Usage: Call migrateQuizToFirestore() from a dev/admin-only UI or script
 */
export async function migrateQuizToFirestore() {
  try {
    // Dynamically import the quiz data
    const response = await fetch('/quiz.json');
    const quizData = await response.json();

    if (!Array.isArray(quizData)) {
      console.error('quiz.json is not an array!');
      return;
    }

    for (const question of quizData) {
      // Add each question to Firestore
      await addDoc(collection(db, 'questions'), {
        ...question,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        version: 1,
        generatedBy: 'manual',
        promptUsed: '',
        batchId: 'initial-migration',
      });
    }
    console.log('Migration complete! All questions uploaded to Firestore.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
} 