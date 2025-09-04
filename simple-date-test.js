/**
 * Simple Date Test
 * Test the date calculation function independently
 */

function calculateDateRange(timeframe) {
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  let startDate, endDate, daysBack, description;
  
  switch (timeframe) {
    case 'last_week':
      daysBack = 7;
      startDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'the last 7 days';
      break;
      
    case 'last_month':
      daysBack = 30;
      startDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'the last 30 days';
      break;
      
    case 'last_year':
      daysBack = 365;
      startDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'the last 365 days';
      break;
      
    default:
      daysBack = 90; // Default to 3 months for recent trends
      startDate = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
      endDate = today;
      description = 'recent trends and developments (last few months)';
      break;
  }
  
  return {
    today: todayFormatted,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    daysBack,
    description,
    timeframe
  };
}

// Test the function
console.log('🧪 Testing Date Range Calculation...\n');

const timeframes = ['last_week', 'last_month', 'last_year', 'default'];

for (const timeframe of timeframes) {
  console.log(`📅 Testing timeframe: ${timeframe}`);
  
  const dateRange = calculateDateRange(timeframe);
  console.log(`   📊 Current Date: ${dateRange.today}`);
  console.log(`   📊 Date Range: ${dateRange.startDate} to ${dateRange.endDate}`);
  console.log(`   📊 Days Back: ${dateRange.daysBack}`);
  console.log(`   📊 Description: ${dateRange.description}`);
  console.log('');
}

console.log('✅ Date Range Calculation Test Complete!');
