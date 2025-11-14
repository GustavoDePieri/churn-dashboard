import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData, getReactivationsData } from '@/lib/googleSheets';
import { analyzeChurnData } from '@/lib/churnAnalytics';
import { analyzeReactivationData } from '@/lib/reactivationAnalytics';
import { generateChurnInsights } from '@/lib/geminiAI';
import { parseISO, isWithinInterval, differenceInDays } from 'date-fns';
import { calculateReactivationMetrics } from '@/lib/utils/reactivationCalculator';

interface MonthlyReportData {
  // Filtered data
  churnAnalysis: any;
  reactivationAnalysis: any;
  
  // Cross-analysis
  crossAnalysis: {
    totalChurns: number;
    totalReactivations: number;
    reactivatedFromChurns: number;
    reactivationRate: number;
    averageDaysToReactivation: number;
    matchedClients: Array<{
      clientName: string;
      churnDate: string;
      reactivationDate: string;
      daysToReactivate: number;
      churnCategory: string;
      reactivationReason: string;
      mrrRecovered: number;
    }>;
    churnsByCategory: any[];
    reactivationsByChurnCategory: any[];
  };
  
  aiInsights: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MonthlyReportData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { startDate, endDate } = req.query;
    
    // Fetch both data sources
    const [churnRecords, reactivationRecords] = await Promise.all([
      getGoogleSheetsData(),
      getReactivationsData(),
    ]);

    // Filter by date range if provided
    let filteredChurns = churnRecords;
    let filteredReactivations = reactivationRecords;

    if (startDate && endDate) {
      const start = parseISO(startDate as string);
      const end = parseISO(endDate as string);

      filteredChurns = churnRecords.filter(record => {
        if (!record.deactivationDate) return false;
        try {
          const churnDate = parseISO(record.deactivationDate);
          return isWithinInterval(churnDate, { start, end });
        } catch {
          return false;
        }
      });

      filteredReactivations = reactivationRecords.filter(record => {
        if (!record.reactivationDate) return false;
        try {
          const reactivationDate = parseISO(record.reactivationDate);
          return isWithinInterval(reactivationDate, { start, end });
        } catch {
          return false;
        }
      });
    }

    // Analyze filtered data
    const churnAnalysis = analyzeChurnData(filteredChurns);
    const reactivationAnalysis = analyzeReactivationData(filteredReactivations);

    // Cross-analysis: Match churned clients with reactivations
    const matchedClients: any[] = [];
    const churnMap = new Map<string, any>();
    
    // Helper function to normalize names for matching
    const normalizeName = (name: string): string => {
      if (!name) return '';
      return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[.,\-()]/g, '')
        .replace(/\b(inc|llc|ltd|corp|corporation|sa|sas|spa)\b/g, '')
        .trim();
    };
    
    // Index churns by multiple identifiers for better matching
    filteredChurns.forEach(churn => {
      // Index by Platform Client ID (most reliable)
      if (churn.id) {
        churnMap.set(`id:${churn.id}`, churn);
      }
      // Index by normalized account name
      const nameKey = normalizeName(churn.clientName);
      if (nameKey) {
        churnMap.set(`name:${nameKey}`, churn);
      }
    });


    // Match reactivations with churns using the churnDate from REACTIVATIONS SHEET (Column J)
    filteredReactivations.forEach((reactivation, index) => {
      let matchedChurn = null;
      
      // Try matching by Platform Client ID first (most reliable)
      if (reactivation.id) {
        matchedChurn = churnMap.get(`id:${reactivation.id}`);
      }
      
      // Fallback to name matching
      if (!matchedChurn) {
        const nameKey = normalizeName(reactivation.accountName);
        if (nameKey) {
          matchedChurn = churnMap.get(`name:${nameKey}`);
        }
      }
      
      // Use churnDate from REACTIVATIONS SHEET (Column J) - this is the key fix!
      if (reactivation.churnDate && reactivation.reactivationDate) {
        try {
          const churnDate = parseISO(reactivation.churnDate);
          const reactivationDate = parseISO(reactivation.reactivationDate);
          const daysToReactivate = differenceInDays(reactivationDate, churnDate);
          
          // Only consider reactivations after churn (positive days)
          if (daysToReactivate > 0) {
            matchedClients.push({
              clientName: reactivation.accountName || 'Unknown',
              churnDate: reactivation.churnDate,
              reactivationDate: reactivation.reactivationDate,
              daysToReactivate,
              churnCategory: matchedChurn?.churnCategory || 'Unknown',
              reactivationReason: reactivation.reactivationReason || 'Unknown',
              mrrRecovered: reactivation.mrr || 0,
            });
          } else {
            console.warn(`⚠️  Reactivation #${index + 1}: Invalid days (${daysToReactivate})`);
          }
        } catch (error) {
          console.error(`❌ Error parsing dates for reactivation #${index + 1}:`, error);
        }
      }
    });


    // Calculate cross-analysis metrics using the centralized calculator
    const reactivationMetrics = calculateReactivationMetrics(filteredReactivations, filteredChurns.length);
    
    const reactivatedFromChurns = matchedClients.length;
    const reactivationRate = filteredChurns.length > 0 
      ? (reactivatedFromChurns / filteredChurns.length) * 100 
      : 0;
    
    // Use centralized calculator for consistency with main dashboard
    const averageDaysToReactivation = reactivationMetrics.averageDaysToReactivation;

    // Analyze reactivations by churn category
    const reactivationsByChurnCategoryMap = new Map<string, number>();
    matchedClients.forEach(client => {
      const count = reactivationsByChurnCategoryMap.get(client.churnCategory) || 0;
      reactivationsByChurnCategoryMap.set(client.churnCategory, count + 1);
    });

    const reactivationsByChurnCategory = Array.from(reactivationsByChurnCategoryMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / matchedClients.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    // Generate AI insights
    const aiInsightsResult = await generateChurnInsights(filteredChurns, churnAnalysis);
    const aiInsights = typeof aiInsightsResult === 'string' 
      ? aiInsightsResult 
      : aiInsightsResult.insights || '';

    const response: MonthlyReportData = {
      churnAnalysis,
      reactivationAnalysis,
      crossAnalysis: {
        totalChurns: filteredChurns.length,
        totalReactivations: filteredReactivations.length,
        reactivatedFromChurns,
        reactivationRate,
        averageDaysToReactivation,
        matchedClients: matchedClients.sort((a, b) => a.daysToReactivate - b.daysToReactivate),
        churnsByCategory: churnAnalysis.topChurnCategories,
        reactivationsByChurnCategory,
      },
      aiInsights,
      dateRange: {
        start: (startDate as string) || 'All time',
        end: (endDate as string) || 'All time',
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('API Error fetching monthly report:', error);
    res.status(500).json({ error: 'Failed to fetch monthly report data' });
  }
}

