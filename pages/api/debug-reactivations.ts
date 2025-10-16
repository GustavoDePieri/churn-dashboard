import type { NextApiRequest, NextApiResponse } from 'next';
import { getReactivationsData } from '@/lib/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reactivationRecords = await getReactivationsData();
    
    // Debug info
    const debug = {
      totalRecords: reactivationRecords.length,
      recordsWithBothDates: reactivationRecords.filter(r => r.churnDate && r.reactivationDate).length,
      recordsWithChurnDate: reactivationRecords.filter(r => r.churnDate).length,
      recordsWithReactivationDate: reactivationRecords.filter(r => r.reactivationDate).length,
      sampleRecord: reactivationRecords[0] || null,
      firstThreeRecords: reactivationRecords.slice(0, 3),
    };

    res.status(200).json(debug);
  } catch (error) {
    console.error('Error debugging reactivations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reactivation data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

