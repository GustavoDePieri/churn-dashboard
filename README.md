# AI Churn Dashboard

A powerful AI-powered monthly churn report dashboard built with Next.js, Google Gemini 1.5 AI, and Google Sheets integration.

## Features

- 📊 **Real-time Churn Analytics**: Fetch and analyze churn data from Google Sheets
- 🤖 **AI-Powered Insights**: Google Gemini 1.5 Flash generates actionable insights from your churn data
- 📈 **Interactive Visualizations**: Beautiful charts showing:
  - Top churn categories
  - Service category distribution
  - Monthly churn and reactivation trends
  - Reactivation rates by churn category
  - Competitor analysis with MRR/pricing data
- 💡 **Product Feedback Analysis**: AI-driven insights from customer feedback
- 🎨 **Modern UI**: Built with Tailwind CSS for a responsive, accessible design

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI**: Google Gemini 1.5 API
- **Data Source**: Google Sheets API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Cloud Project with Sheets API enabled
- Google Gemini API key
- Service account credentials for Google Sheets access

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd churnDashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_SHEETS_TAB=All-history-churns
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="your_private_key"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Google Sheets Format

See `COLUMN_MAPPING.md` for the complete column structure. Your main churn sheet should include:
- Account Name, Platform Client ID
- Churn Date
- Primary Churn Category
- Service Categories (CS Group)
- Competitor Name
- MRR and pricing data
- Feedback and explanations

**Note**: For accurate reactivation metrics, you also need a separate reactivations sheet.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

## Key Analyses Provided

1. **Main Categories Provided by Clients**: Distribution of service categories
2. **Main Churn Categories**: Top reasons why clients churn
3. **Client Reactivation Timing**: Average time for clients to return
4. **Churn-Reactivation Correlation**: Which churn categories have highest reactivation rates
5. **Competitor Analysis**: Which competitors are winning and associated pricing/MRR data
6. **Product Feedback Insights**: AI analysis of customer feedback for product improvements

## Project Structure

```
churnDashboard/
├── components/              # React components
│   ├── MetricCard.tsx      # Metric display cards
│   ├── ChartCard.tsx       # Chart container
│   ├── AIInsightsEnhanced.tsx # AI insights display
│   ├── DateRangeFilter.tsx # Date filtering
│   └── LoadingSpinner.tsx  # Loading states
├── lib/                     # Core business logic
│   ├── googleSheets.ts     # Google Sheets API
│   ├── geminiAI.ts         # AI integration
│   ├── churnAnalytics.ts   # Churn calculations
│   ├── reactivationAnalytics.ts # Reactivation calculations
│   ├── chartStyles.ts      # Chart styling
│   └── utils/
│       └── reactivationCalculator.ts # Single source of truth
├── pages/
│   ├── api/                 # API routes
│   │   ├── churn-data.ts   # Main analytics
│   │   ├── churn-summary.ts # Summary metrics
│   │   ├── ai-insights.ts  # AI generation
│   │   ├── monthly-report.ts # Full report
│   │   ├── reactivations.ts # Reactivation data
│   │   └── product-feedback.ts # Feedback analysis
│   ├── index.tsx           # Main dashboard
│   ├── monthly-report.tsx  # Detailed report page
│   └── reactivations.tsx   # Reactivations page
├── types/
│   └── index.ts            # TypeScript definitions
└── styles/
    └── globals.css         # Global styles
```

## Documentation

- **`README.md`** - This file (project overview)
- **`PROJECT_SUMMARY.md`** - Detailed project summary and features
- **`SETUP_INSTRUCTIONS.md`** - Step-by-step setup guide
- **`DEPLOYMENT_GUIDE.md`** - Production deployment instructions
- **`COLUMN_MAPPING.md`** - Google Sheets column reference
- **`SECURITY_WARNING.md`** - Important security considerations
- **`PHASE_1_FIXES_COMPLETE.md`** - Recent bug fixes and improvements

## Recent Improvements

✅ **Phase 1 Critical Fixes (Oct 2025)**:
- Fixed type mismatches in charts
- Centralized reactivation calculations (single source of truth)
- Added environment variable validation
- Implemented negative value sanitization
- Fixed competitor column mapping

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own purposes.

