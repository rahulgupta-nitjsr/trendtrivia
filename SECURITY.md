# Security Guidelines for TrendTrivia

## 🔐 API Key Security

### **NEVER Commit API Keys to GitHub**

This project uses environment variables to keep API keys secure. Here's how to set it up:

### **Step 1: Create Your Environment File**

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your actual API keys:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### **Step 2: Verify .gitignore**

The `.gitignore` file should include:
```
.env
.env*.local
.env.production
.env.development
```

### **Step 3: Test Your Setup**

Run the app and check the browser console. You should NOT see any error messages about missing environment variables.

## 🚨 Security Checklist

- [ ] `.env` file is created with your actual API keys
- [ ] `.env` file is NOT committed to GitHub (check with `git status`)
- [ ] `env.example` file shows the required variables without real values
- [ ] Firebase project has proper security rules set up
- [ ] API keys are not hardcoded anywhere in the code

## 🔍 How to Check if Your Keys are Secure

1. **Check git status:**
   ```bash
   git status
   ```
   You should NOT see `.env` in the list of tracked files.

2. **Check what's committed:**
   ```bash
   git ls-files | grep env
   ```
   This should return empty (no env files should be tracked).

3. **Search for hardcoded keys:**
   ```bash
   grep -r "api-key\|firebase" src/ --exclude-dir=node_modules
   ```
   Should not find any hardcoded API keys.

## 🛡️ Additional Security Measures

### **Firebase Security Rules**
When you set up Firebase, configure security rules to restrict access:

```javascript
// Example Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;  // Anyone can read
      allow write: if false; // Only authenticated users can write
    }
  }
}
```

### **Environment Variable Best Practices**

1. **Use different keys for development and production**
2. **Use Firebase-specific environment variables for cloud functions:**
   - `FIREBASE_PERPLEXITY_API_KEY` (highest priority for Firebase Functions)
   - `PERPLEXITY_API_KEY` (general fallback)
3. **Rotate keys regularly**
4. **Monitor usage to detect unauthorized access**
5. **Never share keys in chat, email, or screenshots**

## 🆘 If You Accidentally Commit API Keys

1. **Immediately rotate your API keys** in the Firebase console
2. **Remove the file from git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push to remove from GitHub:**
   ```bash
   git push origin --force
   ```

## 📞 Getting Help

If you suspect your keys have been compromised:
1. Immediately rotate all API keys
2. Check your usage logs for unauthorized access
3. Review your git history for any accidental commits 