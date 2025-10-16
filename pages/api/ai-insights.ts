import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData } from '@/lib/googleSheets';
import { analyzeChurnData } from '@/lib/churnAnalytics';
import { generateChurnInsights } from '@/lib/geminiAI';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ insights: string } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const records = await getGoogleSheetsData();
    const analysis = analyzeChurnData(records);
    const aiInsightsResult = await generateChurnInsights(records, analysis);
    const insights = typeof aiInsightsResult === 'string' 
      ? aiInsightsResult 
      : aiInsightsResult.insights || '';

    res.status(200).json({ insights });
  } catch (error) {
    console.error('API Error generating AI insights:', error);
    res.status(500).json({ error: 'Failed to generate AI insights' });
  }
}

