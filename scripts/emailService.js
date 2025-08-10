/**
 * Email Notification Service for Weekly AI Generation
 * 
 * Sends detailed email notifications about the weekly question generation process
 * using a simple HTTP email service (like EmailJS or similar)
 */

import https from 'https';
import fs from 'fs';

/**
 * Format question breakdown by topic and timeframe
 */
function formatQuestionBreakdown(analysis) {
  const topics = ['Technology', 'Pop Culture', 'Finance', 'Start-Ups'];
  const timeframes = ['last_week', 'last_month', 'last_year'];
  
  let breakdown = '';
  
  for (const topic of topics) {
    const topicData = analysis.byTopic[topic] || { total: 0, byTimeframe: {} };
    breakdown += `\n${topic}: ${topicData.total} questions\n`;
    
    for (const timeframe of timeframes) {
      const count = topicData.byTimeframe[timeframe] || 0;
      const timeframeName = timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      breakdown += `  - ${timeframeName}: ${count} questions\n`;
    }
  }
  
  return breakdown;
}

/**
 * Format timeframe summary
 */
function formatTimeframeSummary(analysis, results) {
  const timeframes = ['last_week', 'last_month', 'last_year'];
  let summary = '';
  
  for (const timeframe of timeframes) {
    const count = analysis.byTimeframe[timeframe] || 0;
    const timeframeName = timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const status = count >= 30 ? '✅' : count > 0 ? '⚠️' : '❌';
    
    summary += `\n${status} ${timeframeName}: ${count} questions`;
    
    // Add error info if failed
    const failedResult = analysis.failedTimeframes.find(f => f.timeframe === timeframe);
    if (failedResult) {
      summary += ` (Failed: ${failedResult.error})`;
    }
  }
  
  return summary;
}

/**
 * Create email content for successful generation
 */
function createSuccessEmail(data) {
  const { analysis, results, storedBatches, duration, triggerSource } = data;
  
  const subject = `✅ TrendTrivia Weekly Generation Successful - ${analysis.totalQuestions} Questions Generated`;
  
  const body = `
🎉 Weekly AI Question Generation Completed Successfully!

📊 GENERATION SUMMARY:
• Total Questions Generated: ${analysis.totalQuestions} (Target: 90-120)
• Successful Timeframes: ${analysis.successfulTimeframes}/3
• Failed Timeframes: ${analysis.failedTimeframes.length}
• Generation Time: ${duration.toFixed(1)} seconds
• Trigger Source: ${triggerSource}

📈 TIMEFRAME BREAKDOWN:${formatTimeframeSummary(analysis, results)}

📚 QUESTION BREAKDOWN BY TOPIC:${formatQuestionBreakdown(analysis)}

💾 STORED BATCHES:
${storedBatches.map(batch => `• ${batch.timeframe}: Batch ${batch.batchId} (${batch.questionCount} questions)`).join('\n')}

${analysis.failedTimeframes.length > 0 ? `
⚠️ FAILED TIMEFRAMES:
${analysis.failedTimeframes.map(f => `• ${f.timeframe}: ${f.error}`).join('\n')}
` : ''}

✅ SYSTEM STATUS:
• Archive Management: Completed (4-week retention)
• Batch Activation: ${storedBatches.length} batches activated
• Minimum Requirements: ${analysis.successfulTimeframes >= 2 ? 'Met' : 'Not Met'} (2+ timeframes)

🔗 NEXT STEPS:
• New questions are now active in the TrendTrivia app
• Old questions (4+ weeks) have been archived
• Next generation scheduled for next Monday 9AM EST

---
Generated on: ${new Date().toISOString()}
TrendTrivia Automated System
`;

  return { subject, body };
}

/**
 * Create email content for failed generation
 */
function createFailureEmail(data) {
  const { error, results, duration, triggerSource } = data;
  
  const subject = `❌ TrendTrivia Weekly Generation Failed`;
  
  let resultsSummary = '';
  if (results && results.length > 0) {
    resultsSummary = '\n📊 ATTEMPTED RESULTS:\n';
    for (const result of results) {
      const status = result.success ? '✅' : '❌';
      const count = result.success ? result.questions.length : 0;
      resultsSummary += `${status} ${result.timeframe || 'unknown'}: ${count} questions`;
      if (!result.success) {
        resultsSummary += ` (Error: ${result.error})`;
      }
      resultsSummary += '\n';
    }
  }
  
  const body = `
❌ Weekly AI Question Generation Failed

🚨 ERROR DETAILS:
• Main Error: ${error}
• Generation Time: ${duration.toFixed(1)} seconds
• Trigger Source: ${triggerSource}
• Timestamp: ${new Date().toISOString()}

${resultsSummary}

🔧 RECOMMENDED ACTIONS:
1. Check the GitHub Actions logs for detailed error information
2. Verify API key and Firebase configuration
3. Check Perplexity API quota and status
4. Consider manual trigger after resolving issues

⚠️ IMPACT:
• No new questions were generated for this week
• Previous questions remain active
• Users may see older questions in the app

🔗 TROUBLESHOOTING:
• GitHub Actions: Check the workflow run logs
• API Status: Verify Perplexity API is operational
• Firebase: Ensure Firestore is accessible

---
Generated on: ${new Date().toISOString()}
TrendTrivia Automated System
`;

  return { subject, body };
}

/**
 * Send email using EmailJS service
 */
async function sendHttpEmail(recipient, subject, body) {
  try {
    // Check if EmailJS credentials are available
    const emailjsApiKey = process.env.EMAIL_SERVICE_API_KEY;
    const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_3sv1rim';
    const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_qmwi08e';
    
    if (!emailjsApiKey) {
      console.log('📧 Email notification prepared (console log only - no API key):');
      console.log(`To: ${recipient}`);
      console.log(`Subject: ${subject}`);
      console.log('Body:', body);
      return { success: true, method: 'console_log_no_api_key' };
    }
    
    // EmailJS API endpoint
    const emailjsUrl = 'https://api.emailjs.com/api/v1.0/email/send';
    
    // Prepare the email data
    const emailData = {
      service_id: serviceId,
      template_id: templateId,
      user_id: emailjsApiKey,
      template_params: {
        to_email: recipient,
        subject: subject,
        message: body
      }
    };
    
    // Send email via EmailJS API
    const response = await fetch(emailjsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
    
    if (response.ok) {
      console.log('✅ Email sent successfully via EmailJS');
      return { success: true, method: 'emailjs_api' };
    } else {
      const errorText = await response.text();
      console.error('❌ EmailJS API error:', response.status, errorText);
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to send email via EmailJS:', error);
    
    // Fallback to console logging
    console.log('📧 Email notification prepared (fallback to console):');
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:', body);
    
    return { success: true, method: 'console_log_fallback' };
  }
}

/**
 * Main email notification function
 */
export async function sendEmailNotification(data) {
  try {
    const { recipient, success } = data;
    
    console.log(`📧 Preparing email notification (success: ${success})`);
    
    const emailContent = success 
      ? createSuccessEmail(data)
      : createFailureEmail(data);
    
    // Send the email
    const result = await sendHttpEmail(recipient, emailContent.subject, emailContent.body);
    
    console.log(`✅ Email notification sent successfully using ${result.method}`);
    
    // Also save email content to file for debugging
    if (data.logFile) {
      const emailLogFile = data.logFile.replace('.log', '-email.log');
      fs.writeFileSync(emailLogFile, `Subject: ${emailContent.subject}\n\n${emailContent.body}`);
      console.log(`📄 Email content saved to: ${emailLogFile}`);
    }
    
    return { success: true, method: result.method };
    
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    throw error;
  }
}

export { formatQuestionBreakdown, formatTimeframeSummary, createSuccessEmail, createFailureEmail };
