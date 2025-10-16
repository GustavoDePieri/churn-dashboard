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

    // Cross-match churns with reactivations for ACCURATE reactivation time
    const churnMap = new Map<string, any>();
    churnRecords.forEach(churn => {
      const key = (churn.clientName || '').toLowerCase().trim();
      if (key) {
        churnMap.set(key, churn);
      }
    });

    const matchedReactivations: number[] = [];
    reactivationRecords.forEach(reactivation => {
      const key = (reactivation.accountName || '').toLowerCase().trim();
      const churn = churnMap.get(key);
      
      if (churn && churn.churnDate && reactivation.reactivationDate) {
        try {
          const churnDate = parseISO(churn.churnDate);
          const reactivationDate = parseISO(reactivation.reactivationDate);
          const days = differenceInDays(reactivationDate, churnDate);
          
          // Only consider reactivations after churn (positive days)
          if (days > 0) {
            matchedReactivations.push(days);
          }
        } catch (error) {
          // Skip invalid dates
        }
      }
    });

    // Calculate REAL average reactivation time
    const averageReactivationDays = matchedReactivations.length > 0
      ? Math.round(matchedReactivations.reduce((sum, days) => sum + days, 0) / matchedReactivations.length)
      : 0;

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

