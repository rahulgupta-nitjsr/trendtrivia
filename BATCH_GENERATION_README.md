# Batch Question Generation Script

This script automatically generates questions for all timeframes (Last Week, Last Month, Last Year) with proper pauses and detailed reporting.

## 🚀 Quick Start

### Prerequisites
Before running the script, ensure you have:
1. **Firebase Configuration**: Create a `.env` file with your Firebase credentials
2. **AI Service**: Ensure your AI content generation service is running
3. **Database Access**: Verify your Firestore database is accessible

### Environment Setup
Create a `.env` file in your project root with:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Option 1: Using npm script (Recommended)
```bash
npm run generate-questions
```

### Option 2: Direct node execution
```bash
node generate-questions.js
```

### Option 3: Demo version (No Firebase required)
```bash
npm run demo-generation
# or
node demo-batch-generation.js
```

## 📋 What the Script Does

1. **Sequential Processing**: Generates questions for each timeframe one after another
2. **Smart Pauses**: 
   - 5 seconds between Last Week and Last Month
   - 10 seconds between Last Month and Last Year
   - 15 seconds after Last Year (final pause)
3. **Automatic Randomization**: All questions get randomized answer positions
4. **Detailed Reporting**: Shows success/failure, question counts, and distribution
5. **File Output**: Saves a detailed report to a text file

## 📊 Expected Output

```
🎯 BATCH QUESTION GENERATION STARTING
==================================================
⏰ Started at: 2024-01-15 14:30:00
🎯 Processing 3 timeframes
📊 Expected questions per timeframe: 40
==================================================

🚀 Starting Last Week question generation...
⏰ Started at: 14:30:00
✅ Last Week generation successful!
📊 Questions received: 37/40
🎲 Randomization applied: Yes
📈 Answer distribution: A:25%, B:27%, C:24%, D:24%

⏸️ Pausing for 10s before Last Month...

🚀 Starting Last Month question generation...
⏰ Started at: 14:30:15
✅ Last Month generation successful!
📊 Questions received: 40/40
🎲 Randomization applied: Yes
📈 Answer distribution: A:25%, B:25%, C:25%, D:25%

⏸️ Pausing for 15s before Last Year...

🚀 Starting Last Year question generation...
⏰ Started at: 14:30:35
✅ Last Year generation successful!
📊 Questions received: 39/40
🎲 Randomization applied: Yes
📈 Answer distribution: A:26%, B:24%, C:25%, D:25%

================================================================================
📋 BATCH QUESTION GENERATION REPORT
================================================================================
⏰ Generated at: 1/15/2024, 2:30:50 PM
🎯 Total timeframes processed: 3
✅ Successful generations: 3/3
📊 Total questions generated: 116
⏱️ Total duration: 50.2s

1. Last Week
   Status: ✅ SUCCESS
   Questions: 37/40
   Randomization: ✅ Applied
   Duration: 15.3s
   Source: latest_batch_week
   Distribution: A:25%, B:27%, C:24%, D:24%
   Balanced: ✅ Yes

2. Last Month
   Status: ✅ SUCCESS
   Questions: 40/40
   Randomization: ✅ Applied
   Duration: 12.8s
   Source: latest_batch_month
   Distribution: A:25%, B:25%, C:25%, D:25%
   Balanced: ✅ Yes

3. Last Year
   Status: ✅ SUCCESS
   Questions: 39/40
   Randomization: ✅ Applied
   Duration: 14.1s
   Source: latest_batch_year
   Distribution: A:26%, B:24%, C:25%, D:25%
   Balanced: ✅ Yes

📈 SUMMARY STATISTICS
----------------------------------------
Average questions per timeframe: 38.7
Success rate: 100%
Total expected questions: 120
Total actual questions: 116
Efficiency: 96.7%

💡 RECOMMENDATIONS
----------------------------------------
✅ All timeframes generated successfully!
⚠️ Some timeframes received fewer questions than expected.

================================================================================
📄 Report saved to: question-generation-report-2024-01-15.txt
🎉 Batch generation completed successfully
✅ All timeframes processed successfully!
```

## 📁 Generated Files

The script creates a detailed report file with the format:
```
question-generation-report-YYYY-MM-DD.txt
```

This file contains the complete report for easy reference and sharing.

## ⚙️ Configuration

You can modify the configuration in `src/utils/batchQuestionGenerator.js`:

```javascript
const CONFIG = {
  timeframes: [
    { name: 'Last Week', id: 'week', pauseMs: 5000 },
    { name: 'Last Month', id: 'month', pauseMs: 10000 },
    { name: 'Last Year', id: 'year', pauseMs: 15000 }
  ],
  totalExpectedQuestions: 40
};
```

## 🔧 Troubleshooting

### Common Issues:

1. **"No questions available"**
   - Check if your AI service is running
   - Verify your API keys are configured
   - Ensure you have recent batches in your database

2. **"Randomization not applied"**
   - This is normal for fallback questions
   - Check the source field in the report

3. **"Unbalanced distribution"**
   - The system will automatically rebalance
   - Check the detailed report for specific issues

### Getting Help:

- Check the console output for detailed error messages
- Review the generated report file for specific issues
- Ensure your Firebase configuration is correct

## 🎯 Success Criteria

A successful run should show:
- ✅ All 3 timeframes processed
- ✅ 100% success rate
- ✅ Randomization applied to all questions
- ✅ Balanced answer distribution (A, B, C, D roughly equal)
- ✅ Question count close to expected (35-45 per timeframe)

## 📈 Monitoring

The script provides detailed analytics:
- **Question Count**: How many questions were generated
- **Randomization Status**: Whether answer positions were randomized
- **Answer Distribution**: Percentage of correct answers in each position
- **Performance Metrics**: Duration and efficiency statistics
- **Error Tracking**: Any issues encountered during generation

This ensures your TrendTrivia app always has fresh, balanced questions for users! 