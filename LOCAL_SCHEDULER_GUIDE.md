# 🖥️ Local Scheduler Guide (Spark plan, no Blaze required)

## **✅ What You Get**

A **fully functional AI content generation system** that works on Firebase Spark (free) without upgrading to Blaze. This approach uses your browser's capabilities and localStorage for persistence, or Node scripts for headless runs.

## **🚀 How It Works**

### **Enhanced Local Scheduler Features:**

1. **✅ Persistent State**: Uses localStorage to remember generation history
2. **✅ Smart Duplicate Prevention**: 6-hour cooldown between generations
3. **✅ Manual Triggers**: Available in browser console
4. **✅ Scheduled Generation**: Every Monday 9 AM EST (when browser is open)
5. **✅ State Management**: Prevents overlapping generations
6. **✅ Complete Logging**: All activities logged to console

### **Key Improvements Over Basic setTimeout:**

| Feature | Basic setTimeout | Enhanced Local Scheduler |
|---------|-----------------|-------------------------|
| **Persistence** | ❌ Lost on page refresh | ✅ Saved to localStorage |
| **Duplicate Prevention** | ❌ None | ✅ 6-hour cooldown |
| **State Management** | ❌ None | ✅ Prevents overlapping |
| **Manual Triggers** | ❌ None | ✅ Global functions |
| **History Tracking** | ❌ None | ✅ Last 10 generations |
| **Error Handling** | ❌ Basic | ✅ Comprehensive |

## **🎯 Available Functions**

### **Global Functions (Available in Browser Console):**

```javascript
// Manual generation trigger
window.triggerLocalManualGeneration()

// Check scheduler status
window.getLocalSchedulerStatus()

// Direct generation execution
window.executeLocalGeneration('manual')

// Enable/disable manual triggers
window.setLocalManualTriggerEnabled(true/false)
```

### **Scheduled Generation:**
- **Automatic**: Every Monday 9 AM EST (when browser is open)
- **Smart**: Won't run if recent generation exists
- **Persistent**: Remembers last generation time

## **📊 How to Use**

### **1. Manual Generation (Recommended for Testing)**

Open browser console (F12) and run:
```javascript
// Trigger manual generation
window.triggerLocalManualGeneration()

// Check status
window.getLocalSchedulerStatus()
```

### **2. Scheduled Generation**

The scheduler automatically runs every Monday at 9 AM EST when:
- ✅ Browser tab is open
- ✅ App is running
- ✅ No recent generation (within 6 hours)

### **3. Development Workflow**

```javascript
// 1. Test manual generation
window.triggerLocalManualGeneration()

// 2. Check results
window.getLocalSchedulerStatus()

// 3. View generation history
const status = window.getLocalSchedulerStatus()
console.log('Last generation:', status.lastGeneration)
console.log('Can generate:', status.canGenerate)
```

## **🔧 Technical Details**

### **State Persistence:**
```javascript
// Stored in localStorage
localStorage.getItem('trendtrivia_scheduler_state')
```

### **Duplicate Prevention:**
- **6-hour cooldown** between generations
- **Prevents API spam** and cost overruns
- **Smart detection** of recent generations

### **Error Handling:**
- **Comprehensive logging** to console
- **Graceful failures** with detailed error messages
- **State recovery** from localStorage

## **💰 Cost Control**

### **API Call Limits:**
- **6-hour minimum** between generations
- **Manual override** available for testing
- **Smart detection** prevents unnecessary calls

### **Cost Estimation:**
- **Weekly generation**: ~52 times/year
- **Perplexity API**: ~$0.01 per generation
- **Total annual cost**: ~$0.52

## **🔄 Migration from Cloud Functions**

### **What Changed:**
1. **File**: `src/services/localSchedulerService.js` (new)
2. **Import**: `initializeLocalScheduler` instead of `initializeScheduler`
3. **Functions**: All same functionality, but local

### **What Stays the Same:**
- ✅ All AI generation logic
- ✅ Firestore database storage
- ✅ Question extraction and activation
- ✅ API logging and cost tracking
- ✅ Manual triggers and status checking

## **🎯 Best Practices**

### **For Development:**
1. **Keep browser tab open** during scheduled times
2. **Use manual triggers** for immediate testing
3. **Monitor console logs** for detailed feedback
4. **Check localStorage** for state persistence

### **For Production:**
1. **Keep app running** on a reliable machine
2. **Set up monitoring** for generation success
3. **Use manual triggers** as backup
4. **Monitor costs** through API logs

## **🔍 Troubleshooting**

### **Common Issues:**

**1. Generation not running:**
```javascript
// Check if generation is blocked
const status = window.getLocalSchedulerStatus()
console.log('Can generate:', status.canGenerate)
console.log('Last generation:', status.lastGeneration)
```

**2. Manual trigger not working:**
```javascript
// Check if manual triggers are enabled
const status = window.getLocalSchedulerStatus()
console.log('Manual trigger enabled:', status.manualTriggerEnabled)

// Re-enable if needed
window.setLocalManualTriggerEnabled(true)
```

**3. State not persisting:**
```javascript
// Check localStorage
console.log('Scheduler state:', localStorage.getItem('trendtrivia_scheduler_state'))
```

### **Debug Commands:**
```javascript
// Full status check
window.getLocalSchedulerStatus()

// Force manual generation (bypass cooldown)
window.executeLocalGeneration('manual')

// Clear state (reset everything)
localStorage.removeItem('trendtrivia_scheduler_state')
location.reload()
```

## **📈 Monitoring and Logs**

### **Console Logs:**
- ✅ All generation activities logged
- ✅ Error messages with details
- ✅ State changes tracked
- ✅ API call results shown

### **localStorage Data:**
```javascript
// View stored state
const state = JSON.parse(localStorage.getItem('trendtrivia_scheduler_state'))
console.log('Scheduler state:', state)
```

## **🚀 Ready to Use!**

Your enhanced local scheduler is now active and provides:

- ✅ **No Firebase upgrade required**
- ✅ **Full AI generation capabilities**
- ✅ **Smart duplicate prevention**
- ✅ **Persistent state management**
- ✅ **Manual and scheduled triggers**
- ✅ **Complete logging and monitoring**

**Next Steps:**
1. **Test manual generation**: `window.triggerLocalManualGeneration()`
2. **Check status**: `window.getLocalSchedulerStatus()`
3. **Monitor console logs** for detailed feedback
4. **Keep app running** for scheduled generation

This gives you a **production-ready local scheduler** without any Firebase plan upgrades! 