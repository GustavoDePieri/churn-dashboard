import {
  ChurnRecord,
  ChurnAnalysis,
  CategoryCount,
  CompetitorData,
  ReactivationCorrelation,
  MonthlyTrendData,
} from '@/types';
import { format, parseISO, startOfMonth } from 'date-fns';

export function analyzeChurnData(records: ChurnRecord[]): Omit<ChurnAnalysis, 'aiInsights' | 'executiveSummary'> {
  const totalChurns = records.length;

  // Calculate average reactivation days
  const reactivatedRecords = records.filter(r => r.reactivationDays !== undefined);
  const averageReactivationDays = reactivatedRecords.length > 0
    ? reactivatedRecords.reduce((sum, r) => sum + (r.reactivationDays || 0), 0) / reactivatedRecords.length
    : 0;

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
  const clientFeedbackCategories: CategoryCount[] = Array.from(feedbackCategoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / records.filter(r => r.feedback).length) * 100,
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
  const reactivationMap = new Map<string, { total: number; reactivated: number; totalDays: number }>();
  records.forEach(r => {
    const existing = reactivationMap.get(r.churnCategory) || { total: 0, reactivated: 0, totalDays: 0 };
    reactivationMap.set(r.churnCategory, {
      total: existing.total + 1,
      reactivated: existing.reactivated + (r.reactivationDate ? 1 : 0),
      totalDays: existing.totalDays + (r.reactivationDays || 0),
    });
  });
  const reactivationByChurnCategory: ReactivationCorrelation[] = Array.from(reactivationMap.entries())
    .map(([churnCategory, data]) => ({
      churnCategory,
      reactivationRate: (data.reactivated / data.total) * 100,
      averageDaysToReactivation: data.reactivated > 0 ? data.totalDays / data.reactivated : 0,
      totalCount: data.total,
    }))
    .sort((a, b) => b.reactivationRate - a.reactivationRate);

  // Monthly trend
  const monthlyMap = new Map<string, { churns: number; reactivations: number }>();
  records.forEach(r => {
    if (r.churnDate) {
      try {
        const month = format(startOfMonth(parseISO(r.churnDate)), 'yyyy-MM');
        const existing = monthlyMap.get(month) || { churns: 0, reactivations: 0 };
        monthlyMap.set(month, {
          churns: existing.churns + 1,
          reactivations: existing.reactivations + (r.reactivationDate ? 1 : 0),
        });
      } catch (error) {
        // Skip invalid dates
      }
    }
  });
  const monthlyTrend: MonthlyTrendData[] = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      churns: data.churns,
      reactivations: data.reactivations,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Monthly churn by category (for stacked bar chart)
  const monthlyCategoryMap = new Map<string, Map<string, number>>();
  records.forEach(r => {
    if (r.churnDate) {
      try {
        const month = format(startOfMonth(parseISO(r.churnDate)), 'yyyy-MM');
        if (!monthlyCategoryMap.has(month)) {
          monthlyCategoryMap.set(month, new Map());
        }
        const categoryMap = monthlyCategoryMap.get(month)!;
        const count = categoryMap.get(r.churnCategory) || 0;
        categoryMap.set(r.churnCategory, count + 1);
      } catch (error) {
        // Skip invalid dates
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

