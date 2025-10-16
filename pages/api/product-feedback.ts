import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData } from '@/lib/googleSheets';
import { generateProductFeedbackInsights } from '@/lib/geminiAI';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ insights: string; feedbackCount: number } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const churnRecords = await getGoogleSheetsData();
    const feedbackCount = churnRecords.filter(r => r.feedback).length;
    const insights = await generateProductFeedbackInsights(churnRecords);

    res.status(200).json({ insights, feedbackCount });
  } catch (error) {
    console.error('Error in product-feedback API:', error);
    res.status(500).json({ error: 'Failed to generate product feedback insights' });
  }
}

