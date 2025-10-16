import { differenceInDays, parseISO } from 'date-fns';

export interface ReactivationMetrics {
  totalReactivations: number;
  averageDaysToReactivation: number;
  reactivationRate: number;
  validCalculations: number;
  parseErrors: number;
}

/**
 * Calculates reactivation metrics from reactivations sheet data
 * This is the SINGLE SOURCE OF TRUTH for reactivation calculations
 * 
 * @param reactivationRecords - Array of reactivation records with churnDate and reactivationDate
 * @param totalChurns - Total number of churns to calculate rate against
 * @returns ReactivationMetrics object with all calculated metrics
 */
export function calculateReactivationMetrics(
  reactivationRecords: Array<{
    churnDate?: string;
    reactivationDate?: string;
  }>,
  totalChurns: number
): ReactivationMetrics {
  const reactivationDays: number[] = [];
  let validCalculations = 0;
  let parseErrors = 0;

  reactivationRecords.forEach(record => {
    if (!record.churnDate || !record.reactivationDate) {
      return; // Skip records without both dates
    }

    try {
      const churnDate = parseISO(record.churnDate);
      const reactivationDate = parseISO(record.reactivationDate);
      const days = differenceInDays(reactivationDate, churnDate);

      // Only count reactivations AFTER churn (positive days)
      if (days > 0) {
        reactivationDays.push(days);
        validCalculations++;
      } else if (days < 0) {
        console.warn(`⚠️  Invalid: Reactivation date before churn date (${days} days)`);
      }
    } catch (error) {
      parseErrors++;
      console.error('❌ Date parse error:', {
        churnDate: record.churnDate,
        reactivationDate: record.reactivationDate,
        error,
      });
    }
  });

  const averageDaysToReactivation = 
    reactivationDays.length > 0
      ? Math.round(reactivationDays.reduce((sum, days) => sum + days, 0) / reactivationDays.length)
      : 0;

  const reactivationRate = 
    totalChurns > 0 
      ? (validCalculations / totalChurns) * 100 
      : 0;

  // Log summary for debugging
  console.log('📊 Reactivation Metrics Calculated:', {
    totalReactivations: reactivationRecords.length,
    validCalculations,
    averageDays: averageDaysToReactivation,
    rate: `${reactivationRate.toFixed(1)}%`,
    parseErrors,
  });

  return {
    totalReactivations: reactivationRecords.length,
    averageDaysToReactivation,
    reactivationRate,
    validCalculations,
    parseErrors,
  };
}

