import { google } from 'googleapis';
import { ChurnRecord, ReactivationRecord } from '@/types';

export async function getGoogleSheetsData(): Promise<ChurnRecord[]> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = `${process.env.GOOGLE_SHEETS_TAB}!A:T`; // Extended to column T for new structure

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and map data
    // UPDATED Column mapping (October 2025):
    // A=Account Name, B=CS Group, C=Platform Client ID, D=Cs Sub-Group,
    // E=Last Invoice MRR, F=TPV Last Month, G=Warning Metrics, H=Warning Explanation,
    // I=Churn Explanation ST, J=Primary Churn Category, K=Warning Reason,
    // L=Account ID, M=Avg MRR, N=Avg TPV, O=Last Effective Payment Date,
    // P=Churn Date, Q=Competitor Name (NEW!), R=Last Invoice Date, S=Owner Area, T=Account Owner
    const records: ChurnRecord[] = rows.slice(1).map((row, index) => {
      const churnDate = row[15] || ''; // Column P - Churn Date
      const reactivationDate = row[14] || ''; // Column O - Last Effective Payment Date (could indicate reactivation)
      
      let reactivationDays: number | undefined;
      if (churnDate && reactivationDate) {
        try {
          const churnTime = new Date(churnDate).getTime();
          const reactivationTime = new Date(reactivationDate).getTime();
          // Only calculate if reactivation is AFTER churn
          if (reactivationTime > churnTime) {
            reactivationDays = Math.floor((reactivationTime - churnTime) / (1000 * 60 * 60 * 24));
          }
        } catch (error) {
          // Skip invalid dates
        }
      }

      // Use Avg MRR if Last Invoice MRR is not available
      const mrrValue = row[4] || row[12]; // Column E (Last Invoice MRR) or M (Avg MRR)
      const tpvValue = row[5] || row[13]; // Column F (TPV Last Month) or N (Avg TPV)

      return {
        id: row[2] || row[11] || `record-${index}`, // Column C (Platform Client ID) or L (Account ID) - prioritize Platform Client ID for matching
        clientName: row[0] || 'Unknown', // Column A - Account Name
        churnDate: churnDate,
        reactivationDate: reactivationDate || undefined,
        reactivationDays,
        churnCategory: row[9] || 'Uncategorized', // Column J - Primary Churn Category
        serviceCategory: row[1] || row[3] || 'Unknown', // Column B (CS Group) or D (Cs Sub-Group)
        competitor: row[16] || undefined, // Column Q - Competitor Name (FIXED: was Column K)
        mrr: mrrValue ? parseFloat(mrrValue.toString().replace(/[^0-9.-]/g, '')) : undefined,
        price: tpvValue ? parseFloat(tpvValue.toString().replace(/[^0-9.-]/g, '')) : undefined,
        feedback: row[8] || row[7] || undefined, // Column I (Churn Explanation ST) or H (Warning Explanation)
      };
    });

    return records;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Failed to fetch churn data from Google Sheets');
  }
}

export async function getReactivationsData(): Promise<ReactivationRecord[]> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_REACTIVATIONS_SHEET_ID;
    const range = `${process.env.GOOGLE_REACTIVATIONS_TAB}!A:J`; // Extended to column J for Churn Date

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and map data
    // Column mapping for reactivations sheet (UPDATED):
    // A=Platform Client ID, B=Customer Success Path, C=Account Owner, D=Account Name,
    // E=MRR, F=Active Contracts, G=Reactivation: ID, H=Reactivation Date,
    // I=Reactivation Reason, J=Churn Date
    const records: ReactivationRecord[] = rows.slice(1).map((row, index) => {
      return {
        id: row[6] || `reactivation-${index}`, // Column G - Reactivation: ID
        platformClientId: row[0] || '', // Column A - Platform Client ID
        customerSuccessPath: row[1] || 'Unknown', // Column B - Customer Success Path
        accountOwner: row[2] || 'Unknown', // Column C - Account Owner
        accountName: row[3] || 'Unknown', // Column D - Account Name
        mrr: row[4] ? parseFloat(row[4].toString().replace(/[^0-9.-]/g, '')) : 0, // Column E - MRR
        activeContracts: row[5] ? parseInt(row[5].toString()) : 0, // Column F - Active Contracts
        reactivationId: row[6] || '', // Column G - Reactivation: ID
        reactivationReason: row[8] || 'Not specified', // Column I - Reactivation Reason
        reactivationDate: row[7] || '', // Column H - Reactivation Date
        churnDate: row[9] || undefined, // Column J - Churn Date (NEW!)
      };
    });

    return records;
  } catch (error) {
    console.error('Error fetching reactivations data:', error);
    throw new Error('Failed to fetch reactivations data from Google Sheets');
  }
}

