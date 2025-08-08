# 🔥 Firebase Cloud Functions Deployment Guide

## **What This Solves (Spark plan context)**

On Firebase Spark plan, external API calls from Cloud Functions generally require Blaze. For this project we will not use Blaze. Instead, use the provided local scheduler (runs in the client or Node) to handle weekly generation. This guide remains as a reference for Cloud Functions structure, but deployment of functions that call external APIs is optional and not required.

## **Step 1: Install Firebase CLI**

```bash
npm install -g firebase-tools
```

## **Step 2: Login to Firebase**

```bash
firebase login
```

This will open your browser to authenticate with your Google account.

## **Step 3: Initialize Firebase Project**

```bash
firebase init
```

**Select these options:**
- ✅ **Functions** (Firebase Cloud Functions)
- ✅ **Firestore** (Database)
- ✅ **Hosting** (Optional - for deploying your React app)

**Choose your project:**
- Select your existing Firebase project or create a new one

## **Step 4: Install Dependencies**

```bash
cd functions
npm install
```

## **Step 5: Set Environment Variables**

### **Option A: Using Firebase CLI**
```bash
firebase functions:config:set perplexity.api_key="your-perplexity-api-key"
```

### **Option B: Using .env file in functions folder**
```bash
# Create functions/.env
echo "PERPLEXITY_API_KEY=your-perplexity-api-key" > functions/.env
```

## **Step 6: Test Locally**

```bash
# Start Firebase emulator
firebase emulators:start

# In another terminal, test the function
curl http://localhost:5001/your-project/us-central1/testGeneration
```

## **Step 7: (Optional) Deploy Firebase resources on Spark**

```bash
# Deploy Hosting, Firestore rules and indexes (Spark plan)
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

## **How It Works**

### **1. Scheduled Function**
```javascript
exports.scheduledGeneration = functions.pubsub
  .schedule('0 9 * * 1')  // Every Monday 9 AM
  .timeZone('America/New_York')
  .onRun(async (context) => {
    // This runs automatically on Google's servers
    await executeGeneration('scheduled_weekly');
  });
```

### **2. Manual Trigger**
```javascript
exports.manualGeneration = functions.https.onRequest(async (req, res) => {
  // Trigger via HTTP request
  const result = await executeGeneration('manual_http');
  res.json(result);
});
```

### **3. Test Function**
```javascript
exports.testGeneration = functions.https.onRequest(async (req, res) => {
  // For testing and development
  const result = await executeGeneration('test');
  res.json(result);
});
```

## **Available Functions (reference only on Spark)**

These functions exist in code but are not deployed on Spark for external API usage:

| Function | Purpose |
|----------|---------|
| `scheduledGeneration` | Scheduled generation (requires Blaze for external calls) |
| `manualGeneration` | HTTP trigger (requires Blaze for external calls) |
| `testGeneration` | HTTP test (requires Blaze for external calls) |

## **Monitoring and Logs**

### **View Function Logs**
```bash
firebase functions:log
```

### **View Real-time Logs**
```bash
firebase functions:log --tail
```

### **Check Function Status**
```bash
firebase functions:list
```

## **Cost Considerations**

### **Firebase Functions Pricing**
- **Free Tier**: 2 million invocations/month
- **Paid**: $0.40 per million invocations
- **Memory**: $0.0025 per GB-second

### **Your Usage Estimate**
- **Weekly generation**: ~52 times/year
- **Cost**: Essentially free (well within free tier)

## **Security**

### **API Key Security**
- Store Perplexity API key in Firebase config
- Never commit API keys to Git
- Use environment variables in production

### **Firestore Rules**
- Read access for questions (public)
- Write access requires authentication
- API logs require authentication

## **Troubleshooting**

### **Common Issues**

**1. Function not deploying**
```bash
# Check if you're logged in
firebase login

# Check project selection
firebase projects:list
firebase use your-project-id
```

**2. API key not working**
```bash
# Set config again
firebase functions:config:set perplexity.api_key="your-key"

# Redeploy
firebase deploy --only functions
```

**3. Function timing out**
- Increase timeout in `firebase.json`
- Check AI API response time
- Monitor function logs

### **Debug Commands**
```bash
# Test function locally
firebase emulators:start --only functions

# Check function logs
firebase functions:log --only scheduledGeneration

# View function details
firebase functions:describe scheduledGeneration
```

## **Production Checklist (Spark)**

- [ ] Firebase CLI installed and logged in
- [ ] Hosting/Rules/Indexes deployed (optional)
- [ ] Local scheduler initialized in app (`initializeLocalScheduler()`)
- [ ] Perplexity API key set in client/node env (never commit)
- [ ] Questions saved to Firestore via local generation

## **Next Steps (Spark)**

1. Use local scheduler manual triggers to validate generation
2. Monitor Firestore for batches/questions and `api_logs`
3. Keep the app running on a reliable machine during the scheduled time if you want weekly generation via local scheduler

## **Integration with Your React App**

Once deployed, you can call the manual generation from your React app:

```javascript
// In your React app
const triggerManualGeneration = async () => {
  const response = await fetch('https://your-region-your-project.cloudfunctions.net/manualGeneration');
  const result = await response.json();
  console.log('Generation result:', result);
};
```

This gives you a **production-ready, serverless scheduler** that runs 24/7 on Google's infrastructure! 