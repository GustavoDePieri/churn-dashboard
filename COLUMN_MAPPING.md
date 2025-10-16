# Google Sheets Column Mapping

## Your Actual Column Structure

This document shows how your Google Sheets columns are mapped to the dashboard data model.

### Complete Column List (A-T) - UPDATED October 2025

| Column | Letter | Field Name | Maps To | Usage |
|--------|--------|------------|---------|-------|
| 1 | **A** | Account Name | `clientName` | Client display name in dashboard |
| 2 | **B** | CS Group | `serviceCategory` (primary) | Main service category for grouping |
| 3 | **C** | Platform Client ID | `id` (fallback) | Alternative identifier |
| 4 | **D** | Cs Sub-Group | `serviceCategory` (fallback) | Used if CS Group is empty |
| 5 | **E** | Last Invoice MRR | `mrr` (primary) | Monthly recurring revenue |
| 6 | **F** | TPV Last Month | `price` | Transaction processing volume |
| 7 | **G** | Warning Metrics | - | Not currently used |
| 8 | **H** | Warning Explanation | `feedback` (fallback) | Used if Churn Explanation ST is empty |
| 9 | **I** | Churn Explanation ST | `feedback` (primary) | Main feedback for AI analysis |
| 10 | **J** | Primary Churn Category | `churnCategory` | **Main churn reason** |
| 11 | **K** | Warning Reason | - | Not currently used |
| 12 | **L** | Account ID | `id` (primary) | Primary unique identifier |
| 13 | **M** | Avg MRR | `mrr` (fallback) | Used if Last Invoice MRR is empty |
| 14 | **N** | Avg TPV | `price` (fallback) | Used if TPV Last Month is empty |
| 15 | **O** | Last Effective Payment Date | - | Not currently used |
| 16 | **P** | **Competitor Name** | `competitor` | **Actual competitor name (MOVED!)** |
| 17 | **Q** | Last Invoice Date | - | Not currently used |
| 18 | **R** | Owner Area | - | Not currently used |
| 19 | **S** | Account Owner | - | Not currently used |
| 20 | **T** | **Estimated Churn Date** | `churnDate` | **Date of churn (MOVED!)** |

## Key Mappings

### Dashboard Internal Model

```typescript
{
  id: Account ID (L) or Platform Client ID (C),
  clientName: Account Name (A),
  churnDate: Estimated Churn Date (T), ✅ UPDATED!
  churnCategory: Primary Churn Category (J),
  serviceCategory: CS Group (B) or Cs Sub-Group (D),
  competitor: Competitor Name (P), ✅ UPDATED!
  mrr: Last Invoice MRR (E) or Avg MRR (M),
  price: TPV Last Month (F) or Avg TPV (N),
  feedback: Churn Explanation ST (I) or Warning Explanation (H)
}
```

## Critical Columns for Analysis

### Must Have Data:
1. **Column T (Estimated Churn Date)** - Required for time-based analysis ✅ UPDATED!
2. **Column J (Primary Churn Category)** - Main reason for churn
3. **Column A (Account Name)** - Client identification

### Recommended for Rich Analysis:
4. **Column E or M (MRR)** - Financial impact analysis
5. **Column I (Churn Explanation ST)** - AI insights generation
6. **Column B (CS Group)** - Service category grouping
7. **Column P (Competitor Name)** - Competitor analysis ✅ UPDATED!

### Nice to Have:
8. **Column F or N (TPV)** - Additional financial metrics
9. **Column Q (Last Invoice Date)** - Payment history

## Dashboard Features by Column

### Main Churn Categories Chart
- Uses: **Column J (Primary Churn Category)**
- Groups and counts churn reasons

### Service Categories Distribution
- Uses: **Column B (CS Group)** or **Column D (Cs Sub-Group)**
- Shows which service types churn most

### Monthly Trend Analysis
- Uses: **Column P (Churn Date)** + **Column O (Last Effective Payment Date)**
- Tracks churns vs reactivations over time

### Competitor Analysis Table
- Uses: **Column Q (Competitor Name)** ✅ UPDATED!
- Identifies which competitors are winning
- Combines with **Column E/M (MRR)** and **Column F/N (TPV)** for financial impact

### Reactivation Correlation
- Uses: **Column J (Primary Churn Category)** + **Column O (Last Effective Payment Date)**
- Shows which churn reasons have highest return rates

### AI Insights
- Uses: **Column I (Churn Explanation ST)** + all other columns
- Google Gemini analyzes the data and generates recommendations

## Data Quality Notes

### Automatic Handling:
- Empty cells are handled gracefully
- Falls back to alternative columns when primary is empty
- Numeric values are cleaned (removes currency symbols, commas, etc.)
- Dates are validated before calculating reactivation days

### Best Practices:
1. Keep **Column P (Churn Date)** filled for all records
2. Use consistent **Column J (Primary Churn Category)** values
3. Fill **Column I (Churn Explanation ST)** for better AI insights
4. Ensure **Column E or M (MRR)** has numeric values

## Reactivation Detection

The dashboard uses **Column O (Last Effective Payment Date)** as a potential reactivation indicator:
- If Last Effective Payment Date > Churn Date → Customer may have returned
- Days to reactivation = (Last Effective Payment Date - Churn Date)

**Note**: If this mapping doesn't match your use case, you may need to add a dedicated "Reactivation Date" column to your sheet, or we can adjust the logic.

## Future Enhancements

Additional columns that could be tracked (if added to your sheet):
- Actual Reactivation Date (if different from Last Effective Payment Date)
- Specific Competitor Name
- Account Manager Name
- Contract Length
- Payment Method
- Customer Segment

---

**Last Updated**: Adapted for your actual Google Sheets structure

