import { google } from 'googleapis';
import { ChurnRecord } from '@/types';

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
    const range = `${process.env.GOOGLE_SHEETS_TAB}!A:K`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and map data
    const records: ChurnRecord[] = rows.slice(1).map((row, index) => {
      const churnDate = row[2] || '';
      const reactivationDate = row[3] || '';
      
      let reactivationDays: number | undefined;
      if (churnDate && reactivationDate) {
        const churnTime = new Date(churnDate).getTime();
        const reactivationTime = new Date(reactivationDate).getTime();
        reactivationDays = Math.floor((reactivationTime - churnTime) / (1000 * 60 * 60 * 24));
      }

      return {
        id: row[0] || `record-${index}`,
        clientName: row[1] || 'Unknown',
        churnDate: churnDate,
        reactivationDate: reactivationDate || undefined,
        reactivationDays,
        churnCategory: row[4] || 'Uncategorized',
        serviceCategory: row[5] || 'Unknown',
        competitor: row[6] || undefined,
        mrr: row[7] ? parseFloat(row[7]) : undefined,
        price: row[8] ? parseFloat(row[8]) : undefined,
        feedback: row[9] || undefined,
      };
    });

    return records;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Failed to fetch churn data from Google Sheets');
  }
}

