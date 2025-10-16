import {
  ChurnRecord,
  ChurnAnalysis,
  CategoryCount,
  CompetitorData,
  ReactivationCorrelation,
  MonthlyTrendData,
} from '@/types';
import { format, parseISO, startOfMonth, parse } from 'date-fns';

/**
 * Flexible date parser that handles multiple formats
 * Supports: YYYY-MM-DD, M/D/YYYY, MM/DD/YYYY, D/M/YYYY, DD/MM/YYYY
 */
function parseFlexibleDate(dateString: string): Date {
  if (!dateString) throw new Error('Empty date string');
  
  // Try ISO format first (YYYY-MM-DD)
  try {
    const isoDate = parseISO(dateString);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
  } catch (e) {
    // Continue to other formats
  }
  
  // Try M/D/YYYY or MM/DD/YYYY format (US format)
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      // Construct ISO format: YYYY-MM-DD
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      const isoFormat = `${year}-${paddedMonth}-${paddedDay}`;
      
      try {
        const parsedDate = parseISO(isoFormat);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      } catch (e) {
        // Continue
      }
    }
  }
  
  // Try D-M-YYYY or DD-MM-YYYY format (with dashes)
  if (dateString.includes('-') && !dateString.match(/^\d{4}-/)) {
    try {
      const parsedDate = parse(dateString, 'd-M-yyyy', new Date());
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (e) {
      // Continue
    }
  }
  
  throw new Error(`Unable to parse date: ${dateString}`);
}

export function analyzeChurnData(records: ChurnRecord[]): Omit<ChurnAnalysis, 'aiInsights' | 'executiveSummary'> {
  const totalChurns = records.length;

  // NOTE: Average reactivation days now calculated from reactivations sheet
  // via calculateReactivationMetrics utility (single source of truth)
  const averageReactivationDays = 0; // Placeholder - calculated elsewhere

  // Calculate MRR lost
  const totalMRRLost = records.reduce((sum, r) => sum + (r.mrr || 0), 0);
  const averageMRRPerChurn = totalChurns > 0 ? totalMRRLost / totalChurns : 0;

  // Top churn categories
  const churnCategoryMap = new Map<string, number>();
  records.forEach(r => {
    const count = churnCategoryMap.get(r.churnCategory) || 0;
    churnCategoryMap.set(r.churnCategory, count + 1);
  });
  const topChurnCategories: CategoryCount[] = Array.from(churnCategoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalChurns) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top service categories
  const serviceCategoryMap = new Map<string, number>();
  records.forEach(r => {
    const count = serviceCategoryMap.get(r.serviceCategory || 'Unknown') || 0;
    serviceCategoryMap.set(r.serviceCategory || 'Unknown', count + 1);
  });
  const topServiceCategories: CategoryCount[] = Array.from(serviceCategoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalChurns) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Client feedback categories (extract keywords/themes from feedback)
  const feedbackCategoryMap = new Map<string, number>();
  records.forEach(r => {
    if (r.feedback) {
      const feedback = r.feedback.toLowerCase();
      // Extract common themes
      const themes = [
        { keyword: ['payment', 'billing', 'invoice', 'charge'], category: 'Payment/Billing Issues' },
        { keyword: ['communication', 'response', 'support', 'contact'], category: 'Communication Problems' },
        { keyword: ['fee', 'price', 'cost', 'expensive'], category: 'Pricing Concerns' },
        { keyword: ['reliability', 'downtime', 'error', 'bug', 'issue'], category: 'Reliability/Technical Issues' },
        { keyword: ['feature', 'functionality', 'missing', 'need'], category: 'Feature Gaps' },
        { keyword: ['competitor', 'alternative', 'switched'], category: 'Competitor' },
        { keyword: ['slow', 'late', 'delay'], category: 'Speed/Performance' },
        { keyword: ['contractor', 'worker', 'employee'], category: 'Contractor Management' },
      ];

      let matched = false;
      for (const theme of themes) {
        if (theme.keyword.some(kw => feedback.includes(kw))) {
          const count = feedbackCategoryMap.get(theme.category) || 0;
          feedbackCategoryMap.set(theme.category, count + 1);
          matched = true;
          break;
        }
      }
      if (!matched && r.feedback) {
        const count = feedbackCategoryMap.get('Other Feedback') || 0;
        feedbackCategoryMap.set('Other Feedback', count + 1);
      }
    }
  });
  
  // Calculate feedback count once to avoid division by zero
  const feedbackRecordsCount = records.filter(r => r.feedback).length;
  const clientFeedbackCategories: CategoryCount[] = Array.from(feedbackCategoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: feedbackRecordsCount > 0 ? (count / feedbackRecordsCount) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Competitor analysis
  const competitorMap = new Map<string, { count: number; totalMRR: number; totalPrice: number }>();
  records.forEach(r => {
    if (r.competitor) {
      const existing = competitorMap.get(r.competitor) || { count: 0, totalMRR: 0, totalPrice: 0 };
      competitorMap.set(r.competitor, {
        count: existing.count + 1,
        totalMRR: existing.totalMRR + (r.mrr || 0),
        totalPrice: existing.totalPrice + (r.price || 0),
      });
    }
  });
  const competitorAnalysis: CompetitorData[] = Array.from(competitorMap.entries())
    .map(([competitor, data]) => ({
      competitor,
      count: data.count,
      totalMRR: data.totalMRR,
      averagePrice: data.count > 0 ? data.totalPrice / data.count : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Reactivation by churn category
  // NOTE: This calculation now happens in monthly-report API where we have access
  // to both churn and reactivation datasets to properly match them
  // Returning empty array here as placeholder
  const reactivationByChurnCategory: ReactivationCorrelation[] = [];

  // Monthly trend - churns only
  // Reactivations by month calculated in monthly-report API with reactivations data
  const monthlyMap = new Map<string, number>();
  const dateFrequencyMap = new Map<string, number>(); // Track exact date frequencies
  let parseErrors = 0;
  let parsedCount = 0;
  
  records.forEach((r, idx) => {
    if (r.churnDate) {
      try {
        const parsedDate = parseFlexibleDate(r.churnDate);
        const month = format(startOfMonth(parsedDate), 'yyyy-MM');
        const existing = monthlyMap.get(month) || 0;
        monthlyMap.set(month, existing + 1);
        parsedCount++;
        
        // Track exact date frequency for Dec 2024
        if (month === '2024-12') {
          const dateCount = dateFrequencyMap.get(r.churnDate) || 0;
          dateFrequencyMap.set(r.churnDate, dateCount + 1);
        }
        
        // Log first few for debugging
        if (idx < 5) {
          console.log(`📅 Sample ${idx + 1}: "${r.churnDate}" → ${month} | Client: ${r.clientName}`);
        }
        
        // Special logging for Dec 2024 to debug the 545 issue
        if (month === '2024-12' && existing < 5) {
          console.log(`  ⭐ Dec 2024 #${existing + 1}: "${r.churnDate}" | ${r.clientName}`);
        }
      } catch (error) {
        // Skip invalid dates
        parseErrors++;
        if (parseErrors <= 3) {
          console.warn(`❌ Failed to parse churn date: "${r.churnDate}" - ${error}`);
        }
      }
    }
  });
  
  console.log(`📊 Monthly churn parsing: ${parsedCount} success, ${parseErrors} errors, ${monthlyMap.size} unique months`);
  console.log(`📊 Total records processed: ${records.length}`);
  
  // Log top 5 months by count for debugging
  const topMonths = Array.from(monthlyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  console.log('📊 Top 5 months by churn count:', topMonths);
  
  // Calculate percentage for Dec 2024
  const dec2024Count = monthlyMap.get('2024-12') || 0;
  const dec2024Percentage = ((dec2024Count / records.length) * 100).toFixed(1);
  console.log(`⚠️  December 2024: ${dec2024Count} churns (${dec2024Percentage}% of total ${records.length} records)`);
  
  // Show date distribution for Dec 2024
  if (dateFrequencyMap.size > 0) {
    const topDates = Array.from(dateFrequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    console.log('📅 December 2024 date distribution (top 10):');
    topDates.forEach(([date, count]) => {
      console.log(`  ${date}: ${count} churns (${((count / dec2024Count) * 100).toFixed(1)}% of Dec)`);
    });
    console.log(`  Total unique dates in Dec 2024: ${dateFrequencyMap.size}`);
  }
  const monthlyTrend: MonthlyTrendData[] = Array.from(monthlyMap.entries())
    .map(([month, churns]) => ({
      month,
      churns,
      reactivations: 0, // Calculated in monthly-report API
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Monthly churn by category (for stacked bar chart)
  const monthlyCategoryMap = new Map<string, Map<string, number>>();
  records.forEach(r => {
    if (r.churnDate) {
      try {
        const month = format(startOfMonth(parseFlexibleDate(r.churnDate)), 'yyyy-MM');
        if (!monthlyCategoryMap.has(month)) {
          monthlyCategoryMap.set(month, new Map());
        }
        const categoryMap = monthlyCategoryMap.get(month)!;
        const count = categoryMap.get(r.churnCategory) || 0;
        categoryMap.set(r.churnCategory, count + 1);
      } catch (error) {
        // Skip invalid dates
        console.warn(`Failed to parse churn date for monthly category: ${r.churnDate}`);
      }
    }
  });

  // Get top 5 categories for the chart
  const topCategories = topChurnCategories.slice(0, 5).map(c => c.category);
  
  // Build monthly data with category breakdown
  const monthlyChurnByCategory = Array.from(monthlyCategoryMap.entries())
    .map(([month, categoryMap]) => {
      const monthData: any = { month };
      topCategories.forEach(category => {
        monthData[category] = categoryMap.get(category) || 0;
      });
      // Add "Other" category for remaining churns
      const otherCount = Array.from(categoryMap.entries())
        .filter(([cat]) => !topCategories.includes(cat))
        .reduce((sum, [, count]) => sum + count, 0);
      if (otherCount > 0) {
        monthData['Other'] = otherCount;
      }
      return monthData;
    })
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalChurns,
    averageReactivationDays,
    totalMRRLost,
    averageMRRPerChurn,
    topChurnCategories,
    topServiceCategories,
    clientFeedbackCategories,
    competitorAnalysis,
    reactivationByChurnCategory,
    monthlyTrend,
    monthlyChurnByCategory,
  };
}

