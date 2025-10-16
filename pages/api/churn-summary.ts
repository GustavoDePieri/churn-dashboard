import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData, getReactivationsData } from '@/lib/googleSheets';
import { analyzeChurnData } from '@/lib/churnAnalytics';
import { parseISO, differenceInDays } from 'date-fns';

interface ChurnSummary {
  totalChurns: number;
  averageReactivationDays: number;
  topChurnCategory: string;
  topChurnCategoryCount: number;
  topCompetitor: string;
  topCompetitorMRR: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChurnSummary | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch both data sources
    const [churnRecords, reactivationRecords] = await Promise.all([
      getGoogleSheetsData(),
      getReactivationsData(),
    ]);

    const analysis = analyzeChurnData(churnRecords);

    // Calculate average reactivation time directly from reactivations sheet
    // No matching needed - each reactivation record now has its own churnDate!
    const reactivationDays: number[] = [];
    let validReactivations = 0;
    let dateParseErrors = 0;
    
    reactivationRecords.forEach(reactivation => {
      // Both dates are now in the same reactivations sheet
      if (reactivation.churnDate && reactivation.reactivationDate) {
        try {
          const churnDate = parseISO(reactivation.churnDate);
          const reactivationDate = parseISO(reactivation.reactivationDate);
          const days = differenceInDays(reactivationDate, churnDate);
          
          // Only consider reactivations after churn (positive days)
          if (days > 0) {
            reactivationDays.push(days);
            validReactivations++;
          }
        } catch (error) {
          dateParseErrors++;
          console.error('Date parse error:', error, {
            churnDate: reactivation.churnDate,
            reactivationDate: reactivation.reactivationDate,
            accountName: reactivation.accountName
          });
        }
      }
    });
    
    // Calculate average
    const averageReactivationDays = reactivationDays.length > 0
      ? Math.round(reactivationDays.reduce((sum, days) => sum + days, 0) / reactivationDays.length)
      : 0;
    
    // Debug logging
    console.log('Churn Summary Debug:', {
      totalChurns: churnRecords.length,
      totalReactivations: reactivationRecords.length,
      validReactivations,
      dateParseErrors,
      averageDays: averageReactivationDays,
      sampleDays: reactivationDays.slice(0, 5), // Show first 5 calculated days
    });

    const response: ChurnSummary = {
      totalChurns: churnRecords.length,
      averageReactivationDays,
      topChurnCategory: analysis.topChurnCategories[0]?.category || 'N/A',
      topChurnCategoryCount: analysis.topChurnCategories[0]?.count || 0,
      topCompetitor: analysis.competitorAnalysis[0]?.competitor || 'N/A',
      topCompetitorMRR: analysis.competitorAnalysis[0]?.totalMRR || 0,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in churn-summary API:', error);
    res.status(500).json({ error: 'Failed to fetch churn summary' });
  }
}

