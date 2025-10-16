import {
  ReactivationRecord,
  ReactivationAnalysis,
  CategoryCount,
} from '@/types';
import { format, parseISO, startOfMonth } from 'date-fns';

export function analyzeReactivationData(records: ReactivationRecord[]): Omit<ReactivationAnalysis, 'aiInsights'> {
  const totalReactivations = records.length;

  // Calculate total MRR recovered
  const totalMRRRecovered = records.reduce((sum, r) => sum + r.mrr, 0);
  const averageMRR = totalReactivations > 0 ? totalMRRRecovered / totalReactivations : 0;

  // Top reactivation reasons
  const reasonMap = new Map<string, number>();
  records.forEach(r => {
    const count = reasonMap.get(r.reactivationReason) || 0;
    reasonMap.set(r.reactivationReason, count + 1);
  });
  const topReactivationReasons: CategoryCount[] = Array.from(reasonMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalReactivations) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Reactivations by Customer Success Path
  const csPathMap = new Map<string, number>();
  records.forEach(r => {
    const count = csPathMap.get(r.customerSuccessPath) || 0;
    csPathMap.set(r.customerSuccessPath, count + 1);
  });
  const reactivationsByCSPath: CategoryCount[] = Array.from(csPathMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalReactivations) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Monthly reactivations
  const monthlyMap = new Map<string, { count: number; mrr: number }>();
  records.forEach(r => {
    if (r.reactivationDate) {
      try {
        const month = format(startOfMonth(parseISO(r.reactivationDate)), 'yyyy-MM');
        const existing = monthlyMap.get(month) || { count: 0, mrr: 0 };
        monthlyMap.set(month, {
          count: existing.count + 1,
          mrr: existing.mrr + r.mrr,
        });
      } catch (error) {
        // Skip invalid dates
      }
    }
  });
  const monthlyReactivations = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      count: data.count,
      mrr: data.mrr,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalReactivations,
    totalMRRRecovered,
    averageMRR,
    topReactivationReasons,
    reactivationsByCSPath,
    monthlyReactivations,
  };
}

