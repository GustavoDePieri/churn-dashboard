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
    // Create maps with multiple keys (name and ID) for better matching
    const churnByName = new Map<string, any>();
    const churnById = new Map<string, any>();
    
    // Sample IDs for debugging
    const sampleChurnIds: string[] = [];
    const sampleChurnNames: string[] = [];
    
    churnRecords.forEach((churn, idx) => {
      // Normalize and clean the keys
      const nameKey = (churn.clientName || '').toLowerCase().trim().replace(/\s+/g, ' ');
      const idKey = (churn.id || '').toLowerCase().trim().replace(/\s+/g, '');
      
      if (nameKey) churnByName.set(nameKey, churn);
      if (idKey && idKey !== 'unknown' && !idKey.startsWith('record-')) {
        churnById.set(idKey, churn);
        if (idx < 5) sampleChurnIds.push(idKey); // Collect first 5 for debugging
      }
      if (idx < 5) sampleChurnNames.push(nameKey);
    });

    const matchedReactivations: number[] = [];
    let matchCount = 0;
    let dateParseErrors = 0;
    let idMatches = 0;
    let nameMatches = 0;
    
    // Sample reactivation IDs for debugging
    const sampleReactivationIds: string[] = [];
    const sampleReactivationNames: string[] = [];
    
    reactivationRecords.forEach((reactivation, idx) => {
      // Try matching by Platform Client ID first (more reliable)
      const idKey = (reactivation.platformClientId || '').toLowerCase().trim().replace(/\s+/g, '');
      const nameKey = (reactivation.accountName || '').toLowerCase().trim().replace(/\s+/g, ' ');
      
      if (idx < 5) {
        sampleReactivationIds.push(idKey);
        sampleReactivationNames.push(nameKey);
      }
      
      let churn = null;
      let matchType = '';
      
      if (idKey && idKey !== 'unknown') {
        churn = churnById.get(idKey);
        if (churn) {
          matchType = 'id';
          idMatches++;
        }
      }
      
      // If no match by ID, try matching by name
      if (!churn && nameKey) {
        churn = churnByName.get(nameKey);
        if (churn) {
          matchType = 'name';
          nameMatches++;
        }
      }
      
      if (churn && churn.churnDate && reactivation.reactivationDate) {
        try {
          const churnDate = parseISO(churn.churnDate);
          const reactivationDate = parseISO(reactivation.reactivationDate);
          const days = differenceInDays(reactivationDate, churnDate);
          
          // Only consider reactivations after churn (positive days)
          if (days > 0) {
            matchedReactivations.push(days);
            matchCount++;
          }
        } catch (error) {
          dateParseErrors++;
          console.error('Date parse error:', error, {
            churnDate: churn.churnDate,
            reactivationDate: reactivation.reactivationDate
          });
        }
      }
    });
    
    // Enhanced debug logging
    console.log('Churn Summary Debug:', {
      totalChurns: churnRecords.length,
      totalReactivations: reactivationRecords.length,
      matchCount,
      idMatches,
      nameMatches,
      dateParseErrors,
      averageDays: matchedReactivations.length > 0 
        ? Math.round(matchedReactivations.reduce((sum, days) => sum + days, 0) / matchedReactivations.length)
        : 0,
      sampleChurnIds: sampleChurnIds.slice(0, 3),
      sampleReactivationIds: sampleReactivationIds.slice(0, 3),
      sampleChurnNames: sampleChurnNames.slice(0, 3),
      sampleReactivationNames: sampleReactivationNames.slice(0, 3),
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

