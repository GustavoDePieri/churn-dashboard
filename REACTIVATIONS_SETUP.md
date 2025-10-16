# Reactivations Dashboard Setup

## Google Sheets Column Mapping

Your reactivations sheet has been mapped to the dashboard with the following structure:

### Column Structure (A-I)

| Column | Letter | Field Name | Data Type | Usage |
|--------|--------|------------|-----------|-------|
| 1 | **A** | Platform Client ID | Text | Client identifier |
| 2 | **B** | Customer Success Path | Text | CS approach/strategy |
| 3 | **C** | Account Owner | Text | Account manager name |
| 4 | **D** | Account Name | Text | Client display name |
| 5 | **E** | MRR | Number | Monthly Recurring Revenue |
| 6 | **F** | Active Contracts | Number | Number of active contracts |
| 7 | **G** | Reactivation: ID | Text | Unique reactivation identifier |
| 8 | **H** | Reactivation Reason | Text | Why customer returned |
| 9 | **I** | Reactivation Date | Date | Date of reactivation (YYYY-MM-DD) |

## Dashboard Features

The Reactivations Dashboard provides:

### 📊 Key Metrics
- **Total Reactivations**: Count of customers who returned
- **MRR Recovered**: Total monthly recurring revenue recovered
- **Average MRR**: Average revenue per reactivation

### 📈 Visualizations
1. **Top Reactivation Reasons** - Bar chart showing why customers came back
2. **Customer Success Path Distribution** - Pie chart of CS approaches
3. **Monthly Reactivation Trend** - Line chart showing reactivations and MRR over time
4. **Detailed Breakdown Table** - Complete list of reactivation reasons with percentages

### 🤖 AI Insights
Google Gemini 2.0 Flash analyzes your data to provide:
- Key insights about reactivation patterns
- Customer Success Path effectiveness
- Recommendations to improve reactivation rates
- Strategies to prevent future churn
- Financial impact analysis

## Environment Variables

Add these to Vercel (and your local `.env.local`):

```env
# Reactivations Sheet
GOOGLE_REACTIVATIONS_SHEET_ID=1gbwXZduwUTo1JoBgldH_U_byPSEDo0hlP7jyUooS98E
GOOGLE_REACTIVATIONS_TAB=reactivations
```

Your existing credentials (GEMINI_API_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY) are reused.

## Grant Sheet Access

Make sure your service account has access to the reactivations sheet:

1. Open: https://docs.google.com/spreadsheets/d/1gbwXZduwUTo1JoBgldH_U_byPSEDo0hlP7jyUooS98E
2. Click **Share**
3. Add: `whatsappvalidaor@omega-cosmos-469700-v8.iam.gserviceaccount.com`
4. Permission: **Viewer**
5. Uncheck "Notify people"
6. Click **Share**

## Navigation

- **Churn Dashboard** → Click "View Reactivations →" button (top right)
- **Reactivations Dashboard** → Click "← Back to Churn Dashboard" link (top left)

## API Endpoint

Access reactivations data programmatically:

```
GET /api/reactivations
```

Returns:
```json
{
  "totalReactivations": 123,
  "totalMRRRecovered": 45000,
  "averageMRR": 365,
  "topReactivationReasons": [...],
  "reactivationsByCSPath": [...],
  "monthlyReactivations": [...],
  "aiInsights": "..."
}
```

## Data Quality Tips

1. Keep **Reactivation Date (Column I)** in YYYY-MM-DD format
2. Use consistent **Reactivation Reason (Column H)** categories
3. Ensure **MRR (Column E)** contains numeric values only
4. Fill **Customer Success Path (Column B)** to track CS effectiveness
5. Keep **Reactivation: ID (Column G)** unique for each record

## Example Data

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **Platform Client ID** | **Customer Success Path** | **Account Owner** | **Account Name** | **MRR** | **Active Contracts** | **Reactivation: ID** | **Reactivation Reason** | **Reactivation Date** |
| 12345 | High-Touch | John Doe | Acme Corp | 5000 | 3 | REACT-001 | Improved features | 2024-03-15 |
| 67890 | Low-Touch | Jane Smith | TechStart Inc | 800 | 1 | REACT-002 | Better pricing | 2024-03-20 |

## Deployment

### Update Vercel:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add two new variables:
   - `GOOGLE_REACTIVATIONS_SHEET_ID` = `1gbwXZduwUTo1JoBgldH_U_byPSEDo0hlP7jyUooS98E`
   - `GOOGLE_REACTIVATIONS_TAB` = `reactivations`
3. Click **Save**
4. Vercel will automatically redeploy

### Test:

1. Wait ~1 minute for deployment
2. Visit: `https://your-vercel-url.vercel.app/reactivations`
3. View the complete reactivations analysis!

---

**Need Help?** Check the main README.md or DEPLOYMENT_GUIDE.md for more information.

