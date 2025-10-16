# Setup Instructions

## Environment Variables Setup

**⚠️ SECURITY WARNING: Never commit your actual credentials to Git!**

Create a `.env.local` file with your credentials (use your actual values from secure storage):

```env
# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_google_sheets_id_here
GOOGLE_SHEETS_TAB=All-history-churns

# Google Service Account (for Sheets API)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[Your full private key here]\n-----END PRIVATE KEY-----\n"
```

**Where to get your actual credentials:**
- Gemini API Key: https://aistudio.google.com/app/apikey
- Google Sheets ID: From your sheet URL
- Service Account: From your Google Cloud Console

## Vercel Deployment

When deploying to Vercel, add these environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable from above
4. Make sure to select all environments (Production, Preview, Development)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with the credentials above

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Important Notes

- The `.env.local` file is gitignored for security
- Never commit API keys or credentials to version control
- Make sure your Google Service Account has access to the Google Sheet
- The sheet must have the correct column format (see README.md)

