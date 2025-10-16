# 🔧 Fix: Google Private Key Error

## Error You're Seeing

```
error:1E08010C:DECODER routines::unsupported
Error fetching reactivations data
```

## Root Cause

The `GOOGLE_PRIVATE_KEY` in your `.env.local` file is not properly formatted. This is a very common issue!

## Solution

### Step 1: Get Your Private Key

Your private key from the Google Service Account JSON looks like this:
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
}
```

### Step 2: Fix Your `.env.local` File

**IMPORTANT**: The private key must be:
1. Wrapped in **double quotes**
2. Keep the `\n` characters (do NOT replace with actual line breaks)
3. Include the BEGIN and END markers

**Correct Format:**
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Step 3: Common Mistakes to Avoid

❌ **WRONG** - No quotes:
```env
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
```

❌ **WRONG** - Single quotes:
```env
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n...'
```

❌ **WRONG** - Actual line breaks instead of \n:
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkq...
-----END PRIVATE KEY-----"
```

✅ **CORRECT** - Double quotes with \n:
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
```

---

## Quick Fix Steps

### 1. Open Your `.env.local` File

### 2. Find the `GOOGLE_PRIVATE_KEY` Line

It probably looks like one of the wrong examples above.

### 3. Replace It With the Correct Format

Copy the `private_key` value from your service account JSON file and paste it **exactly as is** (with `\n` characters).

Make sure it's wrapped in **double quotes**.

### 4. Your Complete `.env.local` Should Look Like:

```env
GEMINI_API_KEY=your_api_key_here

GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SHEETS_TAB=All-history-churns
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

GOOGLE_REACTIVATIONS_SHEET_ID=your_sheet_id
GOOGLE_REACTIVATIONS_TAB=Reactivations
```

### 5. Restart Your Dev Server

Stop the current server (Ctrl+C) and restart:
```bash
npm run dev
```

---

## Verification

After fixing, you should see:
```
✅ Google Sheets environment variables validated
```

And when you visit the dashboard or debug endpoint, NO MORE decoder errors!

---

## For Vercel Deployment

In Vercel, when adding the `GOOGLE_PRIVATE_KEY` environment variable:

1. Go to Project Settings → Environment Variables
2. Add `GOOGLE_PRIVATE_KEY`
3. Paste the ENTIRE key including:
   - `-----BEGIN PRIVATE KEY-----\n`
   - The key content with `\n` characters
   - `-----END PRIVATE KEY-----\n`
4. Vercel will handle the quotes automatically

**Example Value to Paste:**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAAS...(long string)...\n-----END PRIVATE KEY-----\n
```

---

## Still Not Working?

### Check These:

1. **Key is complete**: Make sure you copied the ENTIRE key from BEGIN to END
2. **No extra spaces**: No spaces before/after the key
3. **Quotes are correct**: Must be double quotes `"`, not single `'`
4. **Backslash-n preserved**: Keep `\n` as `\n`, don't convert to actual line breaks

### Get a Fresh Key:

If still having issues, generate a new service account key:
1. Go to Google Cloud Console
2. IAM & Admin → Service Accounts
3. Click your service account
4. Keys tab → Add Key → Create New Key → JSON
5. Download the JSON
6. Copy the `private_key` value exactly as it appears in the JSON

---

## After Fixing

Once the key is correct:
1. Dashboard will load successfully ✅
2. Reactivation metrics will calculate ✅
3. All API endpoints will work ✅


