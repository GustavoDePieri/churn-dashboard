# ⚠️ Reactivations Not Working - Environment Variables Missing

## Problem

The "Avg Reactivation Time" shows **0 days** because the reactivations sheet environment variables are not configured.

## Root Cause

After Phase 1 fixes, the reactivation calculation now uses a **separate Google Sheet** for accuracy (single source of truth). This requires additional environment variables.

## Solution

### Option 1: Same Sheet, Different Tab (Recommended)

If your reactivations data is in a **different tab** of the same Google Sheet:

**Add to `.env.local` (local) and Vercel Environment Variables (production):**

```env
# Reactivations sheet configuration
GOOGLE_REACTIVATIONS_SHEET_ID=<same_as_GOOGLE_SHEETS_ID>
GOOGLE_REACTIVATIONS_TAB=Reactivations  # Or your actual tab name
```

### Option 2: Different Sheet

If your reactivations data is in a **completely different Google Sheet**:

```env
# Reactivations sheet configuration
GOOGLE_REACTIVATIONS_SHEET_ID=<your_reactivations_sheet_id>
GOOGLE_REACTIVATIONS_TAB=Sheet1  # Or your actual tab name
```

---

## Required Sheet Structure

Your reactivations sheet/tab needs these columns:

| Column | Name | Description |
|--------|------|-------------|
| A | Platform Client ID | For matching with churns |
| B | Customer Success Path | CS workflow |
| C | Account Owner | Owner name |
| D | Account Name | Client name |
| E | MRR | Monthly recurring revenue |
| F | Active Contracts | Number of contracts |
| G | Reactivation: ID | Unique ID |
| H | Reactivation Date | When they came back |
| I | Reactivation Reason | Why they returned |
| J | **Churn Date** | When they originally churned |

**Critical**: Column J (Churn Date) is required for calculating reactivation time!

---

## Quick Fix Steps

### 1. Local Development

Edit `.env.local`:
```bash
# Add these lines
GOOGLE_REACTIVATIONS_SHEET_ID=your_sheet_id_here
GOOGLE_REACTIVATIONS_TAB=your_tab_name_here
```

Restart dev server:
```bash
npm run dev
```

### 2. Vercel Production

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add two new variables:
   - `GOOGLE_REACTIVATIONS_SHEET_ID` = your sheet ID
   - `GOOGLE_REACTIVATIONS_TAB` = your tab name
3. Redeploy or trigger new deployment

---

## Alternative: Use Same Sheet for Now

If you don't have a separate reactivations sheet yet, you can temporarily calculate from the churn sheet:

**Update `pages/api/churn-summary.ts`:**

```typescript
// Temporary fix - use churn sheet for both
const [churnRecords, reactivationRecords] = await Promise.all([
  getGoogleSheetsData(),
  getGoogleSheetsData(), // Use same sheet temporarily
]);
```

**Note**: This is less accurate but will show a number instead of 0.

---

## Verify Configuration

After adding environment variables, check:

1. **Local**: Visit `http://localhost:3000`
2. **Verify**: "Avg Reactivation Time" should show a number (not 0)
3. **Console**: Check for environment validation logs

---

## What Went Wrong?

The Phase 1 fixes improved data accuracy by:
- ✅ Creating single source of truth for reactivations
- ✅ Using dedicated reactivations sheet
- ❌ But forgot to update environment variable documentation

This is a **configuration issue**, not a code issue. Once environment variables are set, it will work correctly.

---

## Testing

After setting environment variables:

```bash
# Local test
npm run dev

# Check browser console for:
# ✅ Google Sheets environment variables validated
# 📊 Reactivation Metrics Calculated: ...

# Dashboard should show:
# Avg Reactivation Time: XX days (not 0)
```

---

## Need Help?

**Don't have a reactivations sheet?**
1. Create a new tab in your Google Sheet
2. Name it "Reactivations"
3. Add the columns listed above
4. Set environment variables
5. Populate with reactivation data

**Still showing 0 days?**
- Check that Column J (Churn Date) exists in reactivations sheet
- Verify dates are in YYYY-MM-DD format
- Check Vercel logs for errors
- Ensure service account has access to the sheet

---

**Once configured, redeploy and the dashboard will work correctly!** ✅


