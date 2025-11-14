import { google } from 'googleapis';
import { ChurnRecord, ReactivationRecord } from '@/types';

// Validate environment variables on module load (server-side only)
if (typeof window === 'undefined') {
  const requiredEnvVars = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SHEETS_ID',
    'GOOGLE_SHEETS_TAB',
    'GOOGLE_REACTIVATIONS_SHEET_ID',
    'GOOGLE_REACTIVATIONS_TAB',
  ];

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not configured. Check your .env.local file. See REACTIVATIONS_ENV_SETUP.md for details.`);
    }
  });
  
  console.log('✅ Google Sheets environment variables validated');
}

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
    const range = `${process.env.GOOGLE_SHEETS_TAB}!A:S`; // Extended to column S for Created Date

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and map data
    // UPDATED Column mapping (January 2025 - Latest):
    // A=Account Name, B=CS Group, C=Platform Client ID, D=Cs Sub-Group,
    // E=Last Invoice MRR, F=TPV Last Month, G=Warning Metrics, H=Warning Explanation,
    // I=Churn Explanation ST, J=Primary Churn Category, K=Warning Reason,
    // L=Account ID, M=Avg MRR, N=Avg TPV, O=Last Effective Payment Date,
    // P=Estimated Churn Date, Q=Deactivation Date, R=Competitor Name, S=Created Date
    // NOTE: Using Deactivation Date (Q) for churn tracking accuracy
    const records: ChurnRecord[] = rows.slice(1).map((row, index) => {
      const estimatedChurnDate = row[15] || ''; // Column P - Estimated Churn Date
      const deactivationDate = row[16] || ''; // Column Q - Deactivation Date
      const createdDate = row[18] || ''; // Column S - Created Date
      
      // Helper function to parse and validate monetary values
      const parseMoney = (value: any, clientName: string): number | undefined => {
        if (!value) return undefined;
        const parsed = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
        if (isNaN(parsed)) return undefined;
        if (parsed < 0) {
          console.warn(`⚠️  Negative value detected: ${parsed} for ${clientName}, converting to 0`);
          return 0;
        }
        return parsed;
      };
      
      const clientName = row[0] || 'Unknown'; // Column A - Account Name
      
      // Use Avg MRR if Last Invoice MRR is not available
      const mrrValue = row[4] || row[12]; // Column E (Last Invoice MRR) or M (Avg MRR)
      const tpvValue = row[5] || row[13]; // Column F (TPV Last Month) or N (Avg TPV)

      // Use deactivationDate if available, otherwise fall back to estimatedChurnDate
      const primaryChurnDate = deactivationDate || estimatedChurnDate;

      // Calculate months before churn
      let monthsBeforeChurn: number | undefined = undefined;
      if (createdDate && primaryChurnDate) {
        try {
          const created = new Date(createdDate);
          const churned = new Date(primaryChurnDate);
          if (!isNaN(created.getTime()) && !isNaN(churned.getTime())) {
            const diffTime = Math.abs(churned.getTime() - created.getTime());
            const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
            monthsBeforeChurn = diffMonths;
          }
        } catch (error) {
          console.warn(`⚠️  Error calculating months before churn for ${clientName}`);
        }
      }

      return {
        id: row[2] || row[11] || `record-${index}`, // Column C (Platform Client ID) or L (Account ID) - prioritize Platform Client ID for matching
        clientName, // Column A - Account Name
        csGroup: row[1] || undefined, // Column B - CS Group
        platformClientId: row[2] || undefined, // Column C - Platform Client ID
        csSubGroup: row[3] || undefined, // Column D - Cs Sub-Group
        lastInvoiceMRR: parseMoney(row[4], clientName), // Column E - Last Invoice MRR
        tpvLastMonth: parseMoney(row[5], clientName), // Column F - TPV Last Month
        warningMetrics: row[6] || undefined, // Column G - Warning Metrics
        warningExplanation: row[7] || undefined, // Column H - Warning Explanation
        churnExplanationST: row[8] || undefined, // Column I - Churn Explanation ST
        churnCategory: row[9] || 'Uncategorized', // Column J - Primary Churn Category
        warningReason: row[10] || undefined, // Column K - Warning Reason
        accountId: row[11] || undefined, // Column L - Account ID
        avgMRR: parseMoney(row[12], clientName), // Column M - Avg MRR
        avgTPV: parseMoney(row[13], clientName), // Column N - Avg TPV
        lastEffectivePaymentDate: row[14] || undefined, // Column O - Last Effective Payment Date
        estimatedChurnDate: estimatedChurnDate || undefined, // Column P - Estimated Churn Date (kept for reference)
        deactivationDate: primaryChurnDate, // Column Q - Deactivation Date (primary churn date, falls back to estimated if empty)
        competitor: row[17] || undefined, // Column R - Competitor Name
        createdDate: createdDate, // Column S - Created Date
        monthsBeforeChurn: monthsBeforeChurn, // Calculated months from creation to churn
        mrr: parseMoney(mrrValue, clientName), // Use Last Invoice MRR or Avg MRR
        price: parseMoney(tpvValue, clientName), // Use TPV Last Month or Avg TPV
        serviceCategory: row[1] || row[3] || 'Unknown', // Column B (CS Group) or D (Cs Sub-Group)
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

