import {
  ChurnRecord,
  ChurnAnalysis,
  CategoryCount,
  CompetitorData,
  ReactivationCorrelation,
  MonthlyTrendData,
} from '@/types';
import { format, parseISO, startOfMonth } from 'date-fns';

export function analyzeChurnData(records: ChurnRecord[]): Omit<ChurnAnalysis, 'aiInsights'> {
  const totalChurns = records.length;

  // Calculate average reactivation days
  const reactivatedRecords = records.filter(r => r.reactivationDays !== undefined);
  const averageReactivationDays = reactivatedRecords.length > 0
    ? reactivatedRecords.reduce((sum, r) => sum + (r.reactivationDays || 0), 0) / reactivatedRecords.length
    : 0;

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

  return {
    totalChurns,
    averageReactivationDays,
    topChurnCategories,
    topServiceCategories,
    competitorAnalysis,
    reactivationByChurnCategory,
    monthlyTrend,
  };
}

