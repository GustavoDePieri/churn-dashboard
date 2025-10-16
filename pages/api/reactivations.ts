import type { NextApiRequest, NextApiResponse } from 'next';
import { getReactivationsData } from '@/lib/googleSheets';
import { analyzeReactivationData } from '@/lib/reactivationAnalytics';
import { generateReactivationInsights } from '@/lib/geminiAI';
import { ReactivationAnalysis } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReactivationAnalysis | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch data from Google Sheets
    const reactivationRecords = await getReactivationsData();

    if (reactivationRecords.length === 0) {
      return res.status(404).json({ error: 'No reactivation data found' });
    }

    // Perform analytics
    const analysisData = analyzeReactivationData(reactivationRecords);

    // Generate AI insights
    const aiInsights = await generateReactivationInsights(reactivationRecords, analysisData);

    const response: ReactivationAnalysis = {
      ...analysisData,
      aiInsights,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in reactivations API:', error);
    res.status(500).json({ error: 'Failed to fetch and analyze reactivation data' });
  }
}

