import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData, getReactivationsData } from '@/lib/googleSheets';
import { analyzeChurnData } from '@/lib/churnAnalytics';
import { calculateReactivationMetrics } from '@/lib/utils/reactivationCalculator';

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
    console.log('📊 churn-summary: Fetching data...');
    
    // Fetch both data sources
    const [churnRecords, reactivationRecords] = await Promise.all([
      getGoogleSheetsData(),
      getReactivationsData(),
    ]);

    console.log(`📊 churn-summary: Got ${churnRecords.length} churns, ${reactivationRecords.length} reactivations`);

    const analysis = analyzeChurnData(churnRecords);

    // Use the centralized reactivation calculator (SINGLE SOURCE OF TRUTH)
    const metrics = calculateReactivationMetrics(reactivationRecords, churnRecords.length);

    console.log(`📊 churn-summary: Avg days = ${metrics.averageDaysToReactivation}`);

    const response: ChurnSummary = {
      totalChurns: churnRecords.length,
      averageReactivationDays: metrics.averageDaysToReactivation,
      topChurnCategory: analysis.topChurnCategories[0]?.category || 'N/A',
      topChurnCategoryCount: analysis.topChurnCategories[0]?.count || 0,
      topCompetitor: analysis.competitorAnalysis[0]?.competitor || 'N/A',
      topCompetitorMRR: analysis.competitorAnalysis[0]?.totalMRR || 0,
    };

    console.log('✅ churn-summary: Success', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ churn-summary API ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch churn summary' });
  }
}

