#!/usr/bin/env node

import { config } from 'dotenv';
config();

import { triggerLocalManualGenerationForTimeframe } from '../src/services/localSchedulerService-node.js';

async function main() {
  const timeframe = process.argv[2] || 'last_week';
  console.log(`🔄 Manual generation triggered via script for timeframe: ${timeframe}`);
  const res = await triggerLocalManualGenerationForTimeframe(timeframe);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res?.success ? 0 : 1);
}

main().catch(err => {
  console.error('❌ Trigger failed:', err);
  process.exit(1);
});


