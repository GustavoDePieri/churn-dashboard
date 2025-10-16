# 🚨 CRITICAL SECURITY WARNING

## Credentials Were Exposed in Early Commits

**IMPORTANT**: Early commits in this repository may have contained sensitive credentials including:
- Google Gemini API Key
- Google Sheets ID
- Google Service Account Email
- Google Service Account Private Key

## Immediate Actions Required

### 1. Rotate ALL Credentials Immediately

You MUST rotate/regenerate all credentials that were exposed:

#### Rotate Gemini API Key:
1. Go to https://aistudio.google.com/app/apikey
2. Delete the old API key
3. Create a new API key
4. Update your `.env.local` file with the new key

#### Rotate Google Service Account:
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Navigate to IAM & Admin > Service Accounts
3. Delete the old service account or create a new one
4. Generate new credentials (JSON key file)
5. Update your `.env.local` with the new credentials

#### Update Google Sheets:
1. Remove access from the old service account
2. Share with the new service account email
3. Consider using a different sheet if possible

### 2. Update Environment Variables

After rotating credentials, update:

**Local Development (.env.local):**
```env
GEMINI_API_KEY=your_NEW_api_key_here
GOOGLE_SHEETS_ID=your_sheets_id
GOOGLE_SHEETS_TAB=All-history-churns
GOOGLE_SERVICE_ACCOUNT_EMAIL=new_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[new private key]\n-----END PRIVATE KEY-----\n"
```

**Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Update all the variables with new values
4. Redeploy the application

### 3. Git History Cleanup (Optional but Recommended)

If you've already pushed to GitHub, consider:

**Option A: Delete and recreate the repository (simplest)**
1. Delete the GitHub repository
2. Create a new one with the same name
3. Force push the cleaned code

**Option B: Use BFG Repo-Cleaner or git-filter-repo**
1. Install BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Clean the history
3. Force push to GitHub

**⚠️ Note**: Once credentials are in Git history, assume they are compromised even after removal.

## Prevention: What Changed

The repository has been updated to remove all hardcoded credentials from:
- ✅ DEPLOYMENT_GUIDE.md
- ✅ SETUP_INSTRUCTIONS.md
- ✅ GITHUB_PUSH_INSTRUCTIONS.txt
- ✅ All documentation files

All files now contain placeholder values instead of actual credentials.

## Best Practices Going Forward

1. **Never commit credentials** - use `.env.local` (which is gitignored)
2. **Use environment variables** - keep secrets out of code
3. **Use secret management tools** - like Vercel Environment Variables, AWS Secrets Manager, etc.
4. **Regular rotation** - rotate credentials periodically
5. **Monitor for leaks** - use tools like GitGuardian or GitHub secret scanning

## Verification Checklist

- [ ] Rotated Gemini API Key
- [ ] Rotated Google Service Account
- [ ] Updated Google Sheets permissions
- [ ] Updated local `.env.local` with new credentials
- [ ] Updated Vercel environment variables
- [ ] Redeployed application
- [ ] Verified application works with new credentials
- [ ] (Optional) Cleaned Git history or recreated repository

## Questions?

If you need help with any of these steps, consult:
- Google Cloud Console documentation
- Vercel documentation on environment variables
- GitHub documentation on removing sensitive data

---

**This is a critical security issue. Please address it immediately before deploying to production.**

