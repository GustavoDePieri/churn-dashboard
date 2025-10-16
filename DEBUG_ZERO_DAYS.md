# 🔍 Debugging "0 days" Reactivation Issue

## Problem
Dashboard shows "Avg Reactivation Time: 0 days" even though environment variables are set.

## Possible Causes

1. **Reactivations sheet is empty** - No reactivation records exist
2. **Missing Column J** - Churn Date column not in reactivations sheet  
3. **Date format issues** - Dates not in YYYY-MM-DD format
4. **All invalid dates** - All records have reactivation before churn date
5. **Sheet permissions** - Service account can't access reactivations sheet

## Quick Debug Steps

### Step 1: Check Debug Endpoint

Visit: `http://localhost:3000/api/debug-reactivations`

You should see JSON like:
```json
{
  "totalRecords": 50,
  "recordsWithBothDates": 45,
  "recordsWithChurnDate": 48,
  "recordsWithReactivationDate": 50,
  "sampleRecord": {
    "churnDate": "2024-01-15",
    "reactivationDate": "2024-03-20",
    ...
  }
}
```

**If you see**:
- `totalRecords: 0` → Sheet is empty or not accessible
- `recordsWithBothDates: 0` → Missing Column J (Churn Date)
- `recordsWithChurnDate: 0` → Column J is empty

### Step 2: Check Browser Console

Open browser console and look for:
```
📊 Reactivation Metrics Calculated: {
  totalReactivations: X,
  validCalculations: Y,
  averageDays: Z,
  ...
}
```

**If you see**:
- `validCalculations: 0` → All dates are invalid or reactivation before churn
- `parseErrors: >0` → Date format issues

### Step 3: Verify Google Sheet

Check your reactivations sheet has:

| Column | Data Example | Format |
|--------|--------------|--------|
| J (Churn Date) | `2024-01-15` | YYYY-MM-DD |
| H (Reactivation Date) | `2024-03-20` | YYYY-MM-DD |

**Important**: 
- Column J must exist and have dates
- Reactivation Date must be AFTER Churn Date
- Dates must be actual dates, not text

---

## Common Issues & Fixes

### Issue 1: "Churn Date column doesn't exist in reactivations sheet"

**Solution**: Add Column J to your reactivations sheet with the churn dates.

### Issue 2: "All records show validCalculations: 0"

**Cause**: Reactivation dates are BEFORE churn dates (impossible)

**Solution**: Check your data - make sure:
- Column H (Reactivation Date) is when they came BACK
- Column J (Churn Date) is when they originally left
- H should be AFTER J

### Issue 3: "Sheet is empty (totalRecords: 0)"

**Causes**:
1. Wrong sheet ID or tab name in environment variables
2. Service account doesn't have access
3. Sheet actually is empty

**Solution**:
```env
# Double-check these match your actual sheet
GOOGLE_REACTIVATIONS_SHEET_ID=your_actual_sheet_id
GOOGLE_REACTIVATIONS_TAB=your_actual_tab_name  # Case sensitive!
```

### Issue 4: "Date parse errors"

**Cause**: Dates are in wrong format (like "1/15/2024" instead of "2024-01-15")

**Solution**: Format dates in Google Sheets:
1. Select date columns (H and J)
2. Format → Number → Date
3. Choose "2024-01-15" format
4. Or use formula: `=TEXT(A1,"YYYY-MM-DD")`

---

## Manual Test

If you want to manually test the calculation:

1. Pick one reactivation record from your sheet
2. Note the Churn Date (Column J): e.g., `2024-01-15`
3. Note the Reactivation Date (Column H): e.g., `2024-03-20`
4. Calculate days: March 20 - January 15 = ~65 days

If your manual calculation works but the dashboard shows 0, there's a data format issue.

---

## Quick Fix: Use Churn Sheet Temporarily

If you can't figure it out immediately, temporarily use the churn sheet for both:

**Edit `pages/api/churn-summary.ts`**:
```typescript
// Line 25-28, change to:
const churnRecords = await getGoogleSheetsData();
const reactivationRecords = churnRecords.filter(r => r.reactivationDate); // Use churns with reactivation dates

// This will use the old logic temporarily
```

This won't be as accurate but will show a number instead of 0.

---

## Next Steps

1. Visit `/api/debug-reactivations` and share the output
2. Check browser console logs
3. Verify Column J exists in reactivations sheet
4. Check date formats in Google Sheet

Once we see the debug output, we can identify the exact issue!


