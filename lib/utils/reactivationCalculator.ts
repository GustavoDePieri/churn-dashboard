import { differenceInDays, parseISO, parse } from 'date-fns';

export interface ReactivationMetrics {
  totalReactivations: number;
  averageDaysToReactivation: number;
  reactivationRate: number;
  validCalculations: number;
  parseErrors: number;
}

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
  if (dateString.includes('-')) {
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

  reactivationRecords.forEach((record, index) => {
    if (!record.churnDate || !record.reactivationDate) {
      return; // Skip records without both dates
    }

    try {
      const churnDate = parseFlexibleDate(record.churnDate);
      const reactivationDate = parseFlexibleDate(record.reactivationDate);
      const days = differenceInDays(reactivationDate, churnDate);

      // Only count reactivations AFTER churn (positive days)
      if (days > 0) {
        reactivationDays.push(days);
        validCalculations++;
      } else if (days < 0) {
        console.warn(`⚠️  Invalid: Reactivation date before churn date (${days} days) for record #${index + 1}`);
        console.warn(`   Churn: ${record.churnDate} -> Reactivation: ${record.reactivationDate}`);
      } else {
        console.warn(`⚠️  Same day reactivation (0 days) for record #${index + 1} - skipped`);
      }
    } catch (error) {
      parseErrors++;
      console.error(`❌ Date parse error for record #${index + 1}:`, {
        churnDate: record.churnDate,
        reactivationDate: record.reactivationDate,
        error: error instanceof Error ? error.message : error,
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

  });

  return {
    totalReactivations: reactivationRecords.length,
    averageDaysToReactivation,
    reactivationRate,
    validCalculations,
    parseErrors,
  };
}

