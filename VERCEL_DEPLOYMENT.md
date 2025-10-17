# 🚀 Vercel Deployment Guide

Quick guide to deploy the Ontop Churn Dashboard on Vercel.

---

## 📋 Prerequisites

- GitHub account with repository
- Vercel account (free tier works)
- All environment variables ready

---

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import to Vercel

1. Visit [vercel.com](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repo: `churn-dashboard`
5. Click **"Import"**

### 3. Configure Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**

Add ALL these variables:

#### Google Sheets & AI
```
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SHEETS_ID=your_churn_sheet_id
GOOGLE_SHEETS_TAB=your_churn_tab_name
GOOGLE_REACTIVATIONS_SHEETS_ID=your_reactivations_sheet_id
GOOGLE_REACTIVATIONS_TAB=your_reactivations_tab_name
```

#### Google Service Account
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Full_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**⚠️ Important for GOOGLE_PRIVATE_KEY:**
- Copy entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep `\n` for line breaks (don't replace with actual line breaks in Vercel UI)

#### Authentication
```
NEXTAUTH_SECRET=generate_new_secret_for_production
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**⚠️ Important for NEXTAUTH_URL:**
- Use your actual Vercel URL (found after first deployment)
- Include `https://` (not `http://`)
- No trailing slash
- Example: `https://churn-dashboard-ontop.vercel.app`

### 4. Deploy

Click **"Deploy"** button in Vercel.

Wait 2-3 minutes for build to complete.

---

## ✅ Post-Deployment Checklist

### Test Authentication
1. Visit your Vercel URL
2. Should redirect to `/login`
3. Login with: `admin@ontop.com` / `ontop2025`
4. Should show dashboard with header

### Test Data Loading
1. Check if churns display
2. Check if reactivations load
3. Wait for AI insights (loads async)
4. Check last updated timestamp

### Test All Pages
- [x] Main dashboard (`/`)
- [x] Reactivations (`/reactivations`)
- [x] Monthly Report (`/monthly-report`)
- [x] Logout button works
- [x] Logo click returns to home

---

## 🐛 Common Issues

### Issue 1: "NEXTAUTH_SECRET is not defined"

**Cause:** Missing environment variable

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add `NEXTAUTH_SECRET` with generated value
3. Redeploy:
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

### Issue 2: Infinite Redirect Loop

**Cause:** Wrong `NEXTAUTH_URL`

**Solution:**
1. Check `NEXTAUTH_URL` matches your Vercel URL exactly
2. Ensure `https://` is included
3. No trailing slash
4. Example: `https://your-app.vercel.app` ✅
5. Wrong: `http://your-app.vercel.app` ❌
6. Wrong: `https://your-app.vercel.app/` ❌

---

### Issue 3: "Cannot connect to Google Sheets"

**Cause:** Wrong private key format

**Solution:**
1. Get private key from service account JSON
2. In Vercel, paste with `\n` for line breaks:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...\n-----END PRIVATE KEY-----\n
```
3. **DON'T** use actual line breaks in Vercel UI

---

### Issue 4: Build Failed

**Check build logs in Vercel:**
1. Go to Deployments
2. Click failed deployment
3. View logs
4. Common causes:
   - Missing dependencies → Run `npm install` locally first
   - TypeScript errors → Run `npm run build` locally
   - Environment variables → Double check all are set

---

### Issue 5: 500 Error on API Routes

**Cause:** Missing or incorrect environment variables

**Solution:**
1. Check Vercel logs: Deployments → Click deployment → Runtime Logs
2. Look for "variable not defined" errors
3. Add missing variables
4. Redeploy

---

## 🔄 Redeployment

### Automatic (Recommended)
Push to GitHub → Vercel auto-deploys

```bash
git add .
git commit -m "your changes"
git push origin main
```

### Manual
1. Vercel dashboard → Deployments
2. Click ⋯ menu on latest deployment
3. Click "Redeploy"

### Force Redeploy (trigger rebuild)
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## 🔐 Security Checklist

### Before Going Live
- [x] Generate unique `NEXTAUTH_SECRET` (don't reuse from dev)
- [x] Verify no secrets in GitHub repository
- [x] Check `.gitignore` includes `.env*`
- [x] Test login works on production
- [x] Change default password or disable demo account
- [x] Enable Vercel security headers
- [x] Set up custom domain (optional)

---

## 📊 Performance Optimization

### Vercel Settings (Optional)

**Enable Edge Functions:**
- Settings → Functions
- Select "Edge Runtime" for faster responses

**Custom Domains:**
- Settings → Domains
- Add your custom domain
- Update `NEXTAUTH_URL` after adding domain

---

## 🔄 Updating Environment Variables

1. Vercel → Settings → Environment Variables
2. Find variable to update
3. Click ⋯ → Edit
4. Update value
5. Choose environments (Production, Preview, Development)
6. Save
7. Redeploy (automatic or manual)

---

## 📱 Multiple Environments

### Production
```
NEXTAUTH_URL=https://your-app.vercel.app
```

### Preview (PR deployments)
```
NEXTAUTH_URL=https://churn-dashboard-git-[branch]-[team].vercel.app
```

### Development
```
NEXTAUTH_URL=http://localhost:3000
```

**Tip:** Set different values for each environment in Vercel

---

## 🎯 Quick Reference

### Vercel CLI (Optional)

Install:
```bash
npm install -g vercel
```

Deploy from terminal:
```bash
vercel
```

Deploy to production:
```bash
vercel --prod
```

---

## ✅ Success Checklist

After deployment, verify:

- [x] Dashboard loads at Vercel URL
- [x] Login page appears
- [x] Can login with credentials
- [x] Header displays with logo
- [x] Last updated timestamp shows
- [x] Churns display on main dashboard
- [x] Reactivations page works
- [x] Monthly report loads
- [x] AI insights appear (may take 10-15 seconds)
- [x] Logout button works
- [x] Logo click returns to home
- [x] Mobile responsive design works

---

## 📞 Support

**Issues?**
1. Check Vercel deployment logs
2. Check browser console (F12)
3. Review this guide
4. Check main README.md

**Login:**
- Email: `admin@ontop.com`
- Password: `ontop2025`

---

## 🎉 You're Live!

Your dashboard is now deployed and accessible at:
```
https://your-app-name.vercel.app
```

Share the URL with your team and start analyzing churn data! 🚀

---

**Deployed with Vercel** ⚡

