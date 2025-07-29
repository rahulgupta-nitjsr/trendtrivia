# 🔥 Firebase Cloud Functions Deployment Guide

## **What This Solves**

Your current scheduler only works when the browser is open. Firebase Cloud Functions run on Google's servers 24/7, so your AI content generation will happen automatically every Monday at 9 AM EST, even when your app is closed.

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

## **Step 7: Deploy to Production**

```bash
# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy
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

## **Available Functions**

| Function | URL | Purpose |
|----------|-----|---------|
| `scheduledGeneration` | Automatic | Runs every Monday 9 AM EST |
| `manualGeneration` | `/manualGeneration` | Manual trigger via HTTP |
| `testGeneration` | `/testGeneration` | Testing and development |

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

## **Production Checklist**

- [ ] Firebase CLI installed and logged in
- [ ] Project initialized with functions
- [ ] Dependencies installed (`npm install` in functions folder)
- [ ] API key configured (`firebase functions:config:set`)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] Test function works (`curl /testGeneration`)
- [ ] Manual trigger works (`curl /manualGeneration`)
- [ ] Logs are being generated
- [ ] Questions are being saved to Firestore

## **Next Steps After Deployment**

1. **Test the scheduled function** by waiting for Monday 9 AM or manually triggering
2. **Monitor logs** to ensure everything works
3. **Update your React app** to use the new Cloud Functions
4. **Set up monitoring** for production alerts

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