import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if environment variables are set (without exposing actual values)
  const config = {
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasSheetId: !!process.env.GOOGLE_SHEETS_ID,
    hasSheetTab: !!process.env.GOOGLE_SHEETS_TAB,
    hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    sheetTab: process.env.GOOGLE_SHEETS_TAB,
    // Show first/last few chars of IDs for verification (safe to show)
    sheetIdPrefix: process.env.GOOGLE_SHEETS_ID?.substring(0, 5) + '...',
    serviceEmailDomain: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.split('@')[1],
  };

  res.status(200).json(config);
}

