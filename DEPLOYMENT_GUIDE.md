# Deployment Guide

## Step 1: Create GitHub Repository

Since GitHub CLI is not installed, please follow these steps:

1. Go to https://github.com/new
2. Repository name: `churn-dashboard`
3. Description: `AI-powered Monthly Churn Dashboard with Google Gemini 1.5 and Google Sheets integration`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository on GitHub, run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/churn-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `churn-dashboard` repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables (click "Add" for each):
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GOOGLE_SHEETS_ID=your_google_sheets_id_here
   GOOGLE_SHEETS_TAB=All-history-churns
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   [Paste your entire private key here]
   -----END PRIVATE KEY-----"
   ```

   **Important Security Notes**: 
   - NEVER commit these values to Git
   - Get your actual credentials from your secure storage
   - For `GOOGLE_PRIVATE_KEY`, paste the entire private key including the BEGIN and END markers
   - Make sure to preserve the line breaks (`\n`) in the private key

6. Click **Deploy**

### Option B: Using Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and then add the environment variables in the Vercel dashboard.

## Step 4: Verify Deployment

1. Once deployed, Vercel will provide a URL (e.g., `https://churn-dashboard-xyz.vercel.app`)
2. Open the URL in your browser
3. The dashboard should load and fetch data from Google Sheets
4. AI insights will be generated automatically using Google Gemini

## Troubleshooting

### If you see "Failed to fetch churn data":
- Check that the Google Service Account has access to the Google Sheet
- Verify all environment variables are set correctly in Vercel
- Check the Vercel function logs for detailed error messages

### If AI insights are not generating:
- Verify the Gemini API key is valid
- Check if there's sufficient data in the Google Sheet
- Review the Vercel function logs

### Google Sheets Access:
1. Go to your Google Sheet
2. Click "Share"
3. Add your service account email (from your Google Cloud Console)
4. Give it "Viewer" permissions

## Next Steps

After successful deployment:
- Share the Vercel URL with your team
- Set up custom domain (optional)
- Configure automatic deployments on push
- Monitor usage and performance in Vercel dashboard

## Support

For issues or questions:
- Check the README.md for project details
- Review the SETUP_INSTRUCTIONS.md for local development
- Check Vercel function logs for errors

