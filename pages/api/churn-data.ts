import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData } from '@/lib/googleSheets';
import { analyzeChurnData } from '@/lib/churnAnalytics';
import { generateChurnInsights, generateProductFeedbackInsights } from '@/lib/geminiAI';
import { ChurnAnalysis } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChurnAnalysis | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch data from Google Sheets
    const churnRecords = await getGoogleSheetsData();

    if (churnRecords.length === 0) {
      return res.status(404).json({ error: 'No churn data found' });
    }

    // Perform analytics
    const analysisData = analyzeChurnData(churnRecords);

    // Generate AI insights
    const aiInsights = await generateChurnInsights(churnRecords, analysisData);

    const response: ChurnAnalysis = {
      ...analysisData,
      aiInsights,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in churn-data API:', error);
    res.status(500).json({ error: 'Failed to fetch and analyze churn data' });
  }
}

