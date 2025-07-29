/**
 * Firestore Seeding Utility
 * Populates the Firestore emulator with sample questions for testing
 */

import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const sampleQuestions = {
  technology: [
    {
      question: "What does 'AI' stand for?",
      options: ["Artificial Intelligence", "Automated Internet", "Advanced Interface", "Applied Innovation"],
      correct: "Artificial Intelligence",
      category: "technology",
      difficulty: "easy",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "Which company developed the React framework?",
      options: ["Google", "Facebook", "Microsoft", "Apple"],
      correct: "Facebook",
      category: "technology",
      difficulty: "medium",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "What does 'HTTP' stand for?",
      options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Tool Transfer Program", "Host Text Transfer Protocol"],
      correct: "HyperText Transfer Protocol",
      category: "technology",
      difficulty: "easy",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "Which programming language is known as the 'language of the web'?",
      options: ["Python", "JavaScript", "Java", "C++"],
      correct: "JavaScript",
      category: "technology",
      difficulty: "easy",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "What does 'API' stand for?",
      options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interface", "Application Process Integration"],
      correct: "Application Programming Interface",
      category: "technology",
      difficulty: "medium",
      source: "seeded_data",
      createdAt: new Date()
    }
  ],
  science: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: "Au",
      category: "science",
      difficulty: "medium",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "How many bones are in an adult human body?",
      options: ["206", "208", "210", "204"],
      correct: "206",
      category: "science",
      difficulty: "medium",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "What is the speed of light in vacuum?",
      options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "298,792,458 m/s"],
      correct: "299,792,458 m/s",
      category: "science",
      difficulty: "hard",
      source: "seeded_data",
      createdAt: new Date()
    }
  ],
  general: [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: "Paris",
      category: "general",
      difficulty: "easy",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: "Mars",
      category: "general",
      difficulty: "easy",
      source: "seeded_data",
      createdAt: new Date()
    },
    {
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: "1945",
      category: "general",
      difficulty: "medium",
      source: "seeded_data",
      createdAt: new Date()
    }
  ]
};

/**
 * Seed Firestore with sample questions
 */
export const seedFirestore = async () => {
  if (!db) {
    console.error('❌ Firebase not initialized. Cannot seed Firestore.');
    return;
  }

  try {
    console.log('🌱 Seeding Firestore with sample questions...');
    
    let totalAdded = 0;
    
    for (const [category, questions] of Object.entries(sampleQuestions)) {
      console.log(`📝 Adding ${questions.length} ${category} questions...`);
      
      for (const question of questions) {
        await addDoc(collection(db, 'questions'), question);
        totalAdded++;
      }
    }
    
    console.log(`✅ Successfully seeded ${totalAdded} questions to Firestore!`);
    
    // Verify the data was added
    const snapshot = await getDocs(collection(db, 'questions'));
    console.log(`📊 Total questions in database: ${snapshot.size}`);
    
    return {
      success: true,
      totalAdded,
      totalInDatabase: snapshot.size
    };
    
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if Firestore already has questions
 */
export const checkFirestoreData = async () => {
  if (!db) {
    console.warn('⚠️ Firebase not initialized. Cannot check Firestore data.');
    return { hasData: false, count: 0 };
  }

  try {
    const snapshot = await getDocs(collection(db, 'questions'));
    const hasData = snapshot.size > 0;
    
    console.log(`📊 Firestore contains ${snapshot.size} questions`);
    
    return {
      hasData,
      count: snapshot.size
    };
  } catch (error) {
    console.error('❌ Error checking Firestore data:', error);
    return { hasData: false, count: 0, error: error.message };
  }
};

/**
 * Migrate questions from quiz.json to Firestore
 */
export const migrateQuizToFirestore = async () => {
  if (!db) {
    console.error('❌ Firebase not initialized. Cannot migrate data.');
    return;
  }

  try {
    console.log('🔄 Migrating questions from quiz.json to Firestore...');
    
    // Fetch the quiz.json file
    const response = await fetch('/quiz.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz.json: ${response.status}`);
    }
    
    const quizData = await response.json();
    
    if (!Array.isArray(quizData)) {
      throw new Error('quiz.json is not an array!');
    }
    
    console.log(`📝 Found ${quizData.length} questions to migrate...`);
    
    let migratedCount = 0;
    
    for (const question of quizData) {
      // Add each question to Firestore with additional metadata
      await addDoc(collection(db, 'questions'), {
        ...question,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        version: 1,
        generatedBy: 'manual',
        promptUsed: '',
        batchId: 'initial-migration',
        source: 'quiz.json'
      });
      migratedCount++;
    }
    
    console.log(`✅ Successfully migrated ${migratedCount} questions to Firestore!`);
    
    // Verify the migration
    const snapshot = await getDocs(collection(db, 'questions'));
    console.log(`📊 Total questions in database: ${snapshot.size}`);
    
    return {
      success: true,
      migratedCount,
      totalInDatabase: snapshot.size
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Make functions available globally for manual use
if (typeof window !== 'undefined') {
  window.seedFirestore = seedFirestore;
  window.checkFirestoreData = checkFirestoreData;
  window.migrateQuizToFirestore = migrateQuizToFirestore;
  console.log('🌱 Firestore seeding tools available:');
  console.log('- seedFirestore() - Add sample questions');
  console.log('- checkFirestoreData() - Check existing data');
  console.log('- migrateQuizToFirestore() - Migrate your 40 questions from quiz.json');
} 