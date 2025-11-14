import { ChurnRecord, ReactivationRecord } from '@/types';
import { DatePeriod } from '@/components/DateFilter';
import { parseISO, parse } from 'date-fns';

export function getDateRange(period: DatePeriod): { start: Date; end: Date } | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'all-time':
      return null; // No filter
      
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
      
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: yesterday,
        end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    }
      
    case 'this-week': {
      const dayOfWeek = today.getDay();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - dayOfWeek); // Sunday
      return {
        start: weekStart,
        end: now,
      };
    }
      
    case 'last-week': {
      const dayOfWeek = today.getDay();
      const lastWeekEnd = new Date(today);
      lastWeekEnd.setDate(today.getDate() - dayOfWeek - 1); // Last Saturday
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Last Sunday
      return {
        start: lastWeekStart,
        end: new Date(lastWeekEnd.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    }
      
    case 'this-month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return {
        start: monthStart,
        end: monthEnd,
      };
    }
      
    case 'last-month': {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return {
        start: lastMonthStart,
        end: lastMonthEnd,
      };
    }
      
    case 'last-30-days': {
      const start = new Date(today);
      start.setDate(today.getDate() - 30);
      return {
        start,
        end: now,
      };
    }
      
    case 'last-90-days': {
      const start = new Date(today);
      start.setDate(today.getDate() - 90);
      return {
        start,
        end: now,
      };
    }
      
    case 'last-180-days': {
      const start = new Date(today);
      start.setDate(today.getDate() - 180);
      return {
        start,
        end: now,
      };
    }
      
    case 'this-year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: now,
      };
      
    case 'custom-range':
      // This would be handled separately with a date picker
      return null;
      
    default:
      return null;
  }
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  try {
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
    
    // Fallback to native Date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    return null;
  } catch {
    return null;
  }
}

export function filterChurnRecords(
  records: ChurnRecord[],
  period: DatePeriod
): ChurnRecord[] {
  const dateRange = getDateRange(period);

  if (!dateRange) {
    return records; // Return all if no filter
  }

  return records.filter((record) => {
    if (!record.deactivationDate) return false;
    const churnDate = parseDate(record.deactivationDate);
    if (!churnDate) return false;

    return churnDate >= dateRange.start && churnDate <= dateRange.end;
  });
}

export function filterReactivationRecords(
  records: ReactivationRecord[],
  period: DatePeriod
): ReactivationRecord[] {
  const dateRange = getDateRange(period);
  
  if (!dateRange) {
    return records; // Return all if no filter
  }
  
  return records.filter((record) => {
    const reactivationDate = parseDate(record.reactivationDate);
    if (!reactivationDate) return false;
    
    return reactivationDate >= dateRange.start && reactivationDate <= dateRange.end;
  });
}

