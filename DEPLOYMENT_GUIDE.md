# Deployment Guide

## Step 1: Create GitHub Repository

Since GitHub CLI is not installed, please follow these steps:

1. Go to https://github.com/new
2. Repository name: `churn-dashboard`
3. Description: `AI-powered Monthly Churn Dashboard with Google Gemini 2.5 and Google Sheets integration`
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
   GEMINI_API_KEY=AIzaSyDTSQMAOh_6o8qctMAmOTbH0RPXz1xd0wc
   GOOGLE_SHEETS_ID=1HTlc5fgzdfR_b0DSUNseI1iZkGdhljU_AgjkNzztz0A
   GOOGLE_SHEETS_TAB=All-history-churns
   GOOGLE_SERVICE_ACCOUNT_EMAIL=whatsappvalidaor@omega-cosmos-469700-v8.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6e3uQuKYM8+XB
   ouBddLE5Z9uWeFBCRs4b+kEj1YE1OgnPxloc4gKYgEIVrRhJyoDctC/eO6+Vq19e
   oTdvsjE7Uvt7bjYPEwUSS2BGfs3YMQi96ilzoJ6LWLZRwIl5rXm5xjBRR5zmtYyX
   jM0ikBMggjaM5kkjd0HgR3cHXVBxW9rXslehFS0Zzacvrkx6j6wQmfJk104+8jdT
   IACUwIemKe/kWeZ75IQXFodNVVjDeqAmYjhrNd43sgwHaXo064qrtaft7b3xl71R
   ThetCojhN8x6XNYfO9J0Oostzmnkw8R6MTh2C9Fj1pvc98iqMXIXUpnErU+QY5FW
   K+51GZ1jAgMBAAECggEAAwBH8Bkz1um5ho29laA/CYD4SDbxRISWMZFFj7MsBdrE
   W9soPRnBpLzZRp1tn1ZkD4LScf2jT3UEFZl7mZxHbY1Ibc3LjrklvKWI5Zy9ArmU
   5FWKsdX7NAJLLaXVfVqDQHzSvAqIGTBnx4XLd77UB/kzsb3NBIYy6BsBhkiEQ5nw
   F634A7WmITXBfB7SfhngYgEh+m/Ci68Xt8gTEUswEZfT/KpAl4WDHLvmI3qmBgT9
   WlGDrBI/fvGu3JGKWEhidh3x9WEwf+KWCVOl6Pd1OY2whnR+vPYNO7a6TbGPBiFi
   a5VtokaTGYEOYxAs04xUk8q2NFye+TTVQoTLmF9zdQKBgQDlawWUFQcHCyMBXj7w
   s7IZrwKaI1rgjnZ7Zdbrp5mCrhIyBwl8ap4bTJfqtz9vwv+/MBiDh4OZGr3vSSCo
   kAzNBRLyYZE1TGBvW9yRcplA3md7CswH1SfTVebeGFwXImunf27TGAiljUlaWhSg
   CiAVP4fzL/wJPaaNDc2zVx/6ZwKBgQDQFufqulPAiUT/Hyc30ul+UAndnYRxUc/i
   vpyXQInjvra656s6O62CiF/EqkiEbNpGkGBhFKYRqGD44W4lf8yTDXnKwZpu5g0E
   Vnavdp8PmXG1t9f5T35JTZH6mrXxENa6wdpyD4m3958S7ZLFd53LyUeIWA3XOOMC
   1oq3+0dfpQKBgQCJjjzfCCiZiYzoohi8/BGaoru9rdssb18NKAfQbkJ1/2c7hcqj
   Rc4c8jTYcB1iJppviSf5nURDhaxCkCc7yntSZmtw1x1Yxr2/p2W98+d95JxJQzUI
   sT7a0VPG8PYujN3dpWPOwEdW9Dr6KK7bMpcABoK+RpQo+kUlqBQhJukumwKBgGv+
   N0YehTC7DM/KfzP9hahEKZqWERIuf1ER03q7x9QmOfcuHDMQna/MzsbmCNSRGYbd
   judTLAyl8g24EM3tUWJP8BFGALvlMIQ7y0Ssr0gNPnIsgy2kD8pDM6t3d00wjABI
   cvIXFkYfgLL2EOHifkYwo6si56v2nfnvFfb9tcDxAoGAGrBaeENeo9LiqYEWR1kG
   BN8JsNDkBOtWye31rbP3mpAfchkN0lauhjow6iOQ7sOO0N0HSjBPSZylM5CDEYrQ
   l3RLOHwBmA2IOv6pG5oGUcZbfpoubxu3lEleA+brTd5PfPgSWVDxV8NkByHVLF18
   Y7bYQ6NUD5jTZd54G4xxODg=
   -----END PRIVATE KEY-----"
   ```

   **Note**: For `GOOGLE_PRIVATE_KEY`, paste the entire private key including the BEGIN and END markers as shown above. Make sure to preserve the line breaks (`\n`).

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
3. Add the service account email: `whatsappvalidaor@omega-cosmos-469700-v8.iam.gserviceaccount.com`
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

