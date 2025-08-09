# CI-based Scheduler (Spark-safe)

We cannot use Cloud Functions for external AI calls on Spark. Instead, we schedule weekly generation using GitHub Actions (no servers, no Blaze).

## Secrets (GitHub → Settings → Secrets and variables → Actions)
- `PERPLEXITY_API_KEY`: Perplexity API key
- `FIREBASE_SERVICE_ACCOUNT`: JSON content of a Firebase service account (with Firestore access)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

## Workflow (example)
Create `.github/workflows/weekly-generation.yml`:

```yaml
name: Weekly AI Generation

on:
  schedule:
    # 9:00 AM America/New_York every Monday
    - cron: '0 13 * * 1'
  workflow_dispatch: {}

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - name: Configure Firebase service account
        run: |
          echo "$FIREBASE_SERVICE_ACCOUNT" > serviceAccount.json
          echo "FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" >> $GITHUB_ENV
        env:
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      - name: Run weekly generation
        run: node simple-batch-generator.js
        env:
          PERPLEXITY_API_KEY: ${{ secrets.PERPLEXITY_API_KEY }}
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
```

Notes:
- Keep AI keys off the client; they are only used in CI.
- The script should use `firebase-node.js` to connect with the service account. Ensure it saves batches and activates per timeframe, logs to `api_logs`, and prints a summary (counts per topic/timeframe) so the Actions run shows results.

## Notifications
- Use the Actions run summary/emails for confirmation
- Optional: add a Slack/Teams webhook step if desired

## Local/manual alternative
- The app also includes a local scheduler (browser-based) with manual triggers; see `LOCAL_SCHEDULER_GUIDE.md`.

