# 📊 Data Flow Analysis

**Visual guide to how data moves through your application**

---

## Current Data Flow (With Issues)

```
┌─────────────────────────────────────────────────────────────┐
│                     GOOGLE SHEETS                            │
│                                                              │
│  ┌─────────────────────┐      ┌────────────────────────┐   │
│  │   Churn Sheet       │      │  Reactivations Sheet   │   │
│  │  (Main data)        │      │  (Dedicated tracking)  │   │
│  │                     │      │                        │   │
│  │  - Account Name     │      │  - Platform Client ID  │   │
│  │  - Churn Date       │      │  - Account Name        │   │
│  │  - Primary Churn    │      │  - Churn Date         │   │
│  │  - Last Payment Date│      │  - Reactivation Date  │   │
│  │  - MRR              │      │  - Reactivation Reason │   │
│  │  - Feedback         │      │  - MRR                │   │
│  └──────────┬──────────┘      └───────────┬───────────┘   │
└─────────────┼───────────────────────────────┼──────────────┘
              │                               │
              │ lib/googleSheets.ts           │
              │ getGoogleSheetsData()         │ getReactivationsData()
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│  ChurnRecord[]          │    │  ReactivationRecord[]    │
│                         │    │                          │
│  ❌ Has reactivationDate│    │  ✅ Has churnDate        │
│  ❌ Calculated from     │    │  ✅ Has reactivationDate │
│     "Last Payment Date" │    │  ✅ Dedicated tracking   │
└────────┬────────────────┘    └────────┬─────────────────┘
         │                              │
         │                              │
         ├──────────────────────────────┼─────────────┐
         │                              │             │
         ▼                              ▼             ▼
┌────────────────┐        ┌─────────────────┐  ┌─────────────┐
│ /api/churn-data│        │/api/churn-summary│  │/api/monthly-│
│                │        │                 │  │   report    │
│ Uses Churn     │        │ Uses BOTH       │  │             │
│ Sheet Only     │        │ Sheets          │  │ Uses BOTH   │
│                │        │                 │  │ Sheets      │
│ ❌ Calculates  │        │ ✅ Calculates   │  │ ✅ Matches  │
│ reactivation   │        │ correctly from  │  │ clients by  │
│ from "Last     │        │ reactivations   │  │ name & ID   │
│ Payment Date"  │        │ sheet           │  │             │
└────────┬───────┘        └────────┬────────┘  └──────┬──────┘
         │                         │                  │
         │                         │                  │
         ▼                         ▼                  ▼
    ┌─────────┐            ┌──────────────┐   ┌──────────────┐
    │Dashboard│            │Summary Cards │   │Monthly Report│
    │         │            │              │   │              │
    │Shows:   │            │Shows:        │   │Shows:        │
    │X days   │            │Y days        │   │Z days        │
    │         │            │              │   │              │
    │❌ WRONG │            │✅ CORRECT    │   │✅ CORRECT    │
    └─────────┘            └──────────────┘   └──────────────┘

PROBLEM: X ≠ Y ≠ Z (inconsistent metrics shown to users!)
```

---

## Issue #1: Dual Reactivation Calculation

### Problem Scenario:

**Churn Sheet says:**
- Client "ABC Corp" churned on `2024-01-15`
- Last Payment Date: `2024-03-20`
- **Dashboard calculates**: 65 days to reactivation

**Reactivations Sheet says:**
- Client "ABC Corp" (matched by name)
- Actual churn date: `2024-01-10` (different!)
- Reactivation date: `2024-03-25` (different!)
- **Correct calculation**: 75 days to reactivation

**Result**: User sees **65 days** on main dashboard but **75 days** on monthly report!

---

## Issue #2: Client Matching Logic

```
┌──────────────────────────────────────────────────────────────┐
│              CLIENT MATCHING PROCESS                          │
└──────────────────────────────────────────────────────────────┘

Churn Sheet:                    Reactivations Sheet:
┌─────────────────┐            ┌──────────────────┐
│ ABC Corporation │            │ ABC Corp         │
└────────┬────────┘            └─────────┬────────┘
         │                               │
         │ Normalize: "abc corporation"  │ Normalize: "abc corp"
         │                               │
         └───────────────┬───────────────┘
                         │
                    ❌ NO MATCH!
                    (lowercase match failed)

Better approach:
┌─────────────────┐            ┌──────────────────┐
│ ABC Corporation │            │ ABC Corp         │
│ ID: 12345       │            │ ID: 12345        │
└────────┬────────┘            └─────────┬────────┘
         │                               │
         │ Match by ID first!            │
         │                               │
         └───────────────┬───────────────┘
                         │
                    ✅ MATCHED!
                    (ID match succeeded)
```

---

## Proposed Fixed Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     GOOGLE SHEETS                            │
│                                                              │
│  ┌─────────────────────┐      ┌────────────────────────┐   │
│  │   Churn Sheet       │      │  Reactivations Sheet   │   │
│  │  (Churn info only)  │      │  (SOURCE OF TRUTH)     │   │
│  │                     │      │                        │   │
│  │  - Account Name     │      │  - Platform Client ID  │   │
│  │  - Churn Date       │      │  - Account Name        │   │
│  │  - Primary Churn    │      │  ✅ Churn Date         │   │
│  │  - MRR              │      │  ✅ Reactivation Date  │   │
│  │  - Feedback         │      │  ✅ Reactivation Reason│   │
│  │  (No reactivation)  │      │  - MRR                │   │
│  └──────────┬──────────┘      └───────────┬───────────┘   │
└─────────────┼───────────────────────────────┼──────────────┘
              │                               │
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│  ChurnRecord[]          │    │  ReactivationRecord[]    │
│  (No reactivation data) │    │  (Complete data)         │
└────────┬────────────────┘    └────────┬─────────────────┘
         │                              │
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │ lib/utils/                   │
         │ reactivationCalculator.ts    │
         │                              │
         │ ✅ SINGLE SOURCE OF TRUTH    │
         │ ✅ Uses reactivations sheet  │
         │ ✅ Consistent calculation    │
         └──────────────┬───────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    All pages use the SAME calculation
    
    ┌─────────┐   ┌──────────────┐   ┌──────────────┐
    │Dashboard│   │Summary Cards │   │Monthly Report│
    │         │   │              │   │              │
    │Shows: X │   │Shows: X      │   │Shows: X      │
    │         │   │              │   │              │
    │✅ SAME  │   │✅ SAME       │   │✅ SAME       │
    └─────────┘   └──────────────┘   └──────────────┘

SOLUTION: X = X = X (consistent everywhere!)
```

---

## Data Processing Pipeline

### Current (Broken)

```
Step 1: Fetch from Google Sheets
  ├─ Churn Sheet    → ChurnRecord[] (with reactivation estimate)
  └─ Reactivations  → ReactivationRecord[] (with actual data)

Step 2: Process separately
  ├─ Dashboard      → Uses ChurnRecord.reactivationDays
  ├─ Summary        → Calculates from ReactivationRecord
  └─ Monthly Report → Matches both sheets

Step 3: Display
  ├─ Dashboard      → Shows "65 days avg"
  ├─ Summary        → Shows "75 days avg"
  └─ Monthly Report → Shows "70 days avg"

❌ INCONSISTENT!
```

### Proposed (Fixed)

```
Step 1: Fetch from Google Sheets
  ├─ Churn Sheet    → ChurnRecord[] (NO reactivation data)
  └─ Reactivations  → ReactivationRecord[] (complete data)

Step 2: Process with shared utility
  └─ reactivationCalculator.ts
       └─ calculateReactivationMetrics()
            ├─ Input: ReactivationRecord[]
            └─ Output: { avgDays, rate, total }

Step 3: All pages use same calculation
  ├─ Dashboard      → Uses shared calculator
  ├─ Summary        → Uses shared calculator
  └─ Monthly Report → Uses shared calculator

Step 4: Display
  ├─ Dashboard      → Shows "75 days avg"
  ├─ Summary        → Shows "75 days avg"
  └─ Monthly Report → Shows "75 days avg"

✅ CONSISTENT!
```

---

## API Call Flow

### Current Flow (Inefficient)

```
User visits Dashboard
  └─ GET /api/churn-data
       └─ getGoogleSheetsData()              [API Call 1]
            └─ Fetch from Google Sheets
  └─ GET /api/churn-summary
       └─ getGoogleSheetsData()              [API Call 2] ❌ DUPLICATE!
       └─ getReactivationsData()             [API Call 3]
  └─ GET /api/ai-insights
       └─ getGoogleSheetsData()              [API Call 4] ❌ DUPLICATE!
       └─ generateChurnInsights()            [AI Call 1]

User clicks "Monthly Report"
  └─ GET /api/monthly-report
       └─ getGoogleSheetsData()              [API Call 5] ❌ DUPLICATE!
       └─ getReactivationsData()             [API Call 6] ❌ DUPLICATE!
       └─ generateChurnInsights()            [AI Call 2] ❌ DUPLICATE!

TOTAL: 6 Google Sheets calls + 2 AI calls (in 30 seconds!)
```

### Proposed Flow (With Caching)

```
User visits Dashboard
  └─ GET /api/churn-data
       └─ getGoogleSheetsData()              [API Call 1]
            ├─ Fetch from Google Sheets
            └─ Cache for 5 minutes           [Cache Set]
  └─ GET /api/churn-summary
       └─ getGoogleSheetsData()              [Cache Hit!] ✅
       └─ getReactivationsData()             [API Call 2]
            └─ Cache for 5 minutes           [Cache Set]
  └─ GET /api/ai-insights
       └─ getGoogleSheetsData()              [Cache Hit!] ✅
       └─ generateChurnInsights()            [AI Call 1]
            └─ Cache for 10 minutes          [Cache Set]

User clicks "Monthly Report" (3 seconds later)
  └─ GET /api/monthly-report
       └─ getGoogleSheetsData()              [Cache Hit!] ✅
       └─ getReactivationsData()             [Cache Hit!] ✅
       └─ generateChurnInsights()            [Cache Hit!] ✅

TOTAL: 2 Google Sheets calls + 1 AI call
SAVED: 4 API calls + 1 expensive AI call!
```

---

## Type Safety Flow

### Current (Unsafe)

```typescript
// monthly-report.tsx
const [data, setData] = useState<any>(null);  // ❌ any type

fetch('/api/monthly-report')
  .then(res => res.json())
  .then(data => setData(data));  // No validation!

// Later in render:
<Bar dataKey="totalChurns" />  // Property doesn't exist!
// TypeScript doesn't catch this error
```

### Proposed (Safe)

```typescript
// types/index.ts
interface MonthlyReportData {
  churnAnalysis: ChurnAnalysis;
  reactivationAnalysis: ReactivationAnalysis;
  crossAnalysis: CrossAnalysis;
  aiInsights: string;
  dateRange: DateRange;
}

// monthly-report.tsx
const [data, setData] = useState<MonthlyReportData | null>(null);

fetch('/api/monthly-report')
  .then(res => res.json())
  .then(data => {
    // Validate response shape
    if (validateMonthlyReport(data)) {
      setData(data);
    }
  });

// Later in render:
<Bar dataKey="totalChurns" />  // TypeScript ERROR!
// Must use: dataKey="totalCount" ✅
```

---

## Error Propagation

### Current (Silent Failures)

```
Google Sheets API Error
  ↓
lib/googleSheets.ts throws
  ↓
pages/api/churn-data.ts catches
  ↓
Returns: { error: "Failed to fetch" }
  ↓
pages/index.tsx shows generic error
  ↓
User sees: "Error Loading Dashboard"
  ↓
❌ No details, hard to debug!
```

### Proposed (Helpful Errors)

```
Google Sheets API Error: "Invalid credentials"
  ↓
lib/googleSheets.ts throws with context
  ↓
pages/api/churn-data.ts catches
  ↓
Returns: { 
  error: "Authentication failed",
  details: "Check GOOGLE_SERVICE_ACCOUNT_EMAIL",
  code: "AUTH_ERROR"
}
  ↓
pages/index.tsx shows specific error
  ↓
User sees: "Authentication failed. Check your Google Sheets credentials in .env.local"
  ↓
✅ Clear action to take!
```

---

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                            │
└─────────────────────────────────────────────────────────────┘

Layer 1: In-Memory Cache (Server)
  ├─ TTL: 5 minutes
  ├─ Stores: Google Sheets data
  └─ Invalidate: Manual trigger or TTL

Layer 2: AI Response Cache (Server)
  ├─ TTL: 10 minutes
  ├─ Stores: Generated AI insights
  └─ Invalidate: Data change or manual

Layer 3: Browser Cache (Client)
  ├─ TTL: Controlled by API headers
  ├─ Stores: API responses
  └─ Invalidate: User refresh

Cache Keys:
  ├─ "churn-data"           → ChurnRecord[]
  ├─ "reactivations-data"   → ReactivationRecord[]
  └─ "ai-insights-{hash}"   → AI generated text
```

---

## Data Validation Pipeline

```
Step 1: Raw Data from Google Sheets
  ├─ Row arrays with mixed types
  └─ Potential issues:
       ├─ Empty cells
       ├─ Invalid dates
       ├─ Negative numbers
       ├─ Wrong formats
       └─ Duplicates

Step 2: Parse & Validate
  ├─ parseMoney() → validate & sanitize
  ├─ parseDate() → validate format
  ├─ normalizeText() → clean strings
  └─ validateRecord() → check required fields

Step 3: Transform
  ├─ Map to typed interfaces
  ├─ Apply business rules
  └─ Calculate derived fields

Step 4: Deduplicate
  ├─ Check by ID + date
  ├─ Log duplicates
  └─ Keep first occurrence

Step 5: Ready for Analysis
  └─ Clean, validated, typed data ✅
```

---

## Component Data Flow

```
                    ┌──────────────┐
                    │  index.tsx   │
                    │  (Dashboard) │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌──────────┐     ┌──────────┐    ┌──────────┐
   │MetricCard│     │ChartCard │    │AIInsights│
   └──────────┘     └──────────┘    └──────────┘
          │                │                │
          │ Props          │ Props          │ Props
          │                │                │
          ▼                ▼                ▼
   Display value    Recharts render   Stream AI text

Data flows DOWN, never UP ✅
Parent owns state ✅
Children are presentational ✅
```

---

## Summary of Issues

| Component | Issue | Fix |
|-----------|-------|-----|
| `lib/googleSheets.ts` | Calculates reactivation incorrectly | Remove reactivation logic |
| `lib/churnAnalytics.ts` | Division by zero possible | Add zero check |
| `pages/api/churn-data.ts` | No caching | Add request cache |
| `pages/api/monthly-report.ts` | Weak client matching | Use ID + fuzzy name |
| `pages/monthly-report.tsx` | Wrong chart properties | Fix dataKey names |
| All pages | No error boundaries | Wrap in ErrorBoundary |

---

**Visual Analysis Complete** ✅

*See LOGIC_REVIEW_REPORT.md for detailed explanations and FIXES_ACTION_PLAN.md for implementation code.*


