# 🚀 Vercel Deployment - Authentication Setup

## Critical: Add These Environment Variables to Vercel

### Step-by-Step Guide

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `churn-dashboard`

2. **Navigate to Settings → Environment Variables**

3. **Add the following NEW variables:**

---

### Required Variables

#### 1. NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: [GENERATE A SECURE RANDOM STRING]
Environment: Production, Preview, Development
```

**How to generate a secure secret:**
```bash
# Option 1: Using OpenSSL (recommended)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

**Example value** (DO NOT USE THIS - generate your own):
```
Kv5h8N2mP9jR4tY6wE7uI8oP3aS5dF1gH2jK4lZ6xC8vB0nM1q
```

---

#### 2. NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://your-actual-app-url.vercel.app
Environment: Production
```

**Important**: 
- Replace with your actual Vercel URL
- Example: `https://churn-dashboard-omega.vercel.app`
- Find this URL in your Vercel project dashboard

For **Preview** environment (optional):
```
Value: https://churn-dashboard-git-[branch]-[team].vercel.app
```

For **Development** environment (optional):
```
Value: http://localhost:3000
```

---

## 📋 Complete Environment Variables List

Your Vercel project should have ALL these variables:

### Existing Variables (keep these)
- ✅ `GEMINI_API_KEY`
- ✅ `GOOGLE_SHEETS_ID`
- ✅ `GOOGLE_SHEETS_TAB`
- ✅ `GOOGLE_REACTIVATIONS_SHEETS_ID`
- ✅ `GOOGLE_REACTIVATIONS_TAB`
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- ✅ `GOOGLE_PRIVATE_KEY`

### NEW Variables (add these)
- 🆕 `NEXTAUTH_SECRET` - For session encryption
- 🆕 `NEXTAUTH_URL` - Your production URL

---

## 🔍 Verification Steps

After adding the environment variables:

1. **Trigger a new deployment**
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push origin main
   ```

2. **Wait for deployment to complete** (2-3 minutes)

3. **Test the authentication:**
   - Visit your Vercel URL
   - You should be redirected to `/login`
   - Login with: `admin@ontop.com` / `ontop2024`
   - You should see the dashboard with header

---

## 🐛 Common Issues

### Issue: "NEXTAUTH_SECRET is not defined"
**Solution**: 
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Add `NEXTAUTH_SECRET` with a secure random value
4. Redeploy

### Issue: Infinite redirect loop
**Solution**: 
1. Verify `NEXTAUTH_URL` matches your exact Vercel URL
2. Make sure it includes `https://` (not `http://`)
3. No trailing slash at the end
4. Redeploy

### Issue: "Unable to get session"
**Solution**:
1. Clear cookies in your browser
2. Try incognito/private mode
3. Check browser console for errors

---

## 🔐 Security Notes

### DO:
- ✅ Generate a unique NEXTAUTH_SECRET for each environment
- ✅ Use HTTPS in production (Vercel does this automatically)
- ✅ Keep secrets in Vercel dashboard (never commit them)
- ✅ Rotate NEXTAUTH_SECRET periodically

### DON'T:
- ❌ Use the same secret for dev and production
- ❌ Commit secrets to GitHub
- ❌ Share secrets publicly
- ❌ Use weak or predictable secrets

---

## 📱 Testing Checklist

After deployment, test these flows:

- [ ] Visit homepage → Redirects to login
- [ ] Login with correct credentials → Success
- [ ] Login with wrong credentials → Error shown
- [ ] Click Ontop logo → Returns to home
- [ ] Click logout → Redirects to login
- [ ] Last updated timestamp displays correctly
- [ ] All dashboards accessible after login
- [ ] Session persists after page refresh

---

## 🎉 You're Done!

Once you've added the environment variables and tested:

1. ✅ Authentication is working
2. ✅ Ontop logo is clickable
3. ✅ Logout button works
4. ✅ Last updated indicator shows
5. ✅ All dashboards are protected

**Your dashboard is now secure and production-ready!** 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Try redeploying from scratch

**Default Login:**
- Email: `admin@ontop.com`
- Password: `ontop2024`

