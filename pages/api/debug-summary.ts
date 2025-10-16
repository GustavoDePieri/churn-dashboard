import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleSheetsData, getReactivationsData } from '@/lib/googleSheets';
import { calculateReactivationMetrics } from '@/lib/utils/reactivationCalculator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 DEBUG: Starting debug-summary...');
    
    // Fetch both data sources
    const churnRecords = await getGoogleSheetsData();
    console.log(`🔍 DEBUG: Got ${churnRecords.length} churn records`);
    
    const reactivationRecords = await getReactivationsData();
    console.log(`🔍 DEBUG: Got ${reactivationRecords.length} reactivation records`);

    // Calculate metrics
    const metrics = calculateReactivationMetrics(reactivationRecords, churnRecords.length);
    console.log('🔍 DEBUG: Metrics calculated:', metrics);

    // Check sample reactivation records
    const samplesWithBothDates = reactivationRecords
      .filter(r => r.churnDate && r.reactivationDate)
      .slice(0, 3)
      .map(r => ({
        accountName: r.accountName,
        churnDate: r.churnDate,
        reactivationDate: r.reactivationDate,
      }));

    const debug = {
      status: 'success',
      churnRecords: {
        total: churnRecords.length,
        sample: churnRecords[0] ? {
          id: churnRecords[0].id,
          clientName: churnRecords[0].clientName,
          churnDate: churnRecords[0].churnDate,
        } : null,
      },
      reactivationRecords: {
        total: reactivationRecords.length,
        withChurnDate: reactivationRecords.filter(r => r.churnDate).length,
        withReactivationDate: reactivationRecords.filter(r => r.reactivationDate).length,
        withBothDates: reactivationRecords.filter(r => r.churnDate && r.reactivationDate).length,
        samples: samplesWithBothDates,
      },
      metrics: {
        totalReactivations: metrics.totalReactivations,
        validCalculations: metrics.validCalculations,
        averageDaysToReactivation: metrics.averageDaysToReactivation,
        reactivationRate: `${metrics.reactivationRate.toFixed(1)}%`,
        parseErrors: metrics.parseErrors,
      },
      diagnosis: metrics.averageDaysToReactivation === 0 
        ? '⚠️ ISSUE: Average is 0. Check if Column J (Churn Date) exists in reactivations sheet.'
        : '✅ Calculation working correctly!',
    };

    res.status(200).json(debug);
  } catch (error) {
    console.error('❌ DEBUG ERROR:', error);
    res.status(500).json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

