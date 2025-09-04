#!/usr/bin/env node

// Zero-cost Batch Activation Test
// - Creates a dummy batch in Firestore
// - Activates it for a timeframe
// - Verifies activation without calling Perplexity

import { config } from 'dotenv';
config();

import { saveBatch, activateBatchForTimeframe } from '../src/services/batchService-node.js';
import { db } from '../src/config/firebase-node.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const timeframe = process.argv[2] || 'last_week';
  const batchId = `dummy-${timeframe}-${Date.now()}`;

  console.log(`🧪 Starting zero-cost activation test for timeframe: ${timeframe}`);
  console.log(`🆔 Dummy batchId: ${batchId}`);

  // 1) Save dummy batch
  const dummy = {
    batchId,
    timeframe,
    metadata: {
      batchId,
      timeframe,
      generatedAt: new Date().toISOString(),
      status: 'generated',
      questionCount: 0,
      categories: ['Test'],
      difficulties: ['easy']
    },
    questions: [],
    rawResponse: 'DUMMY'
  };

  const saveRes = await saveBatch(dummy);
  if (!saveRes.success) {
    console.error('❌ Save failed:', saveRes.error);
    process.exit(1);
  }
  console.log('✅ Dummy batch saved');

  // 2) Wait and activate
  console.log('⏳ Waiting 2s before activation...');
  await sleep(2000);
  const actRes = await activateBatchForTimeframe(batchId, timeframe);
  if (!actRes.success) {
    console.error('❌ Activation failed:', actRes.error);
    process.exit(1);
  }
  console.log('✅ Activation succeeded');

  // 3) Verify activation by querying Firestore
  const batchesRef = collection(db, 'batches');
  const q = query(batchesRef, where('batchId', '==', batchId));
  const snap = await getDocs(q);
  if (snap.empty) {
    console.error('❌ Verification failed: No document found');
    process.exit(1);
  }
  const doc = snap.docs[0];
  const data = doc.data();
  console.log('🔎 Document fields:', { batchId: data.batchId, timeframe: data.timeframe, isActive: data.isActive, status: data.status });
  if (data.isActive === true) {
    console.log('🎉 Verified: isActive is true');
    process.exit(0);
  } else {
    console.error('⚠️ Verified: document found but isActive is not true');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Test exception:', err);
  process.exit(1);
});


