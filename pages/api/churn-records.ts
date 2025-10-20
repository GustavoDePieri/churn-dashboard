import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData } from '@/lib/googleSheets';
import { ChurnRecord } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChurnRecord[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const records = await getGoogleSheetsData();
    res.status(200).json(records);
  } catch (error) {
    console.error('❌ Error fetching churn records:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch churn records' 
    });
  }
}

