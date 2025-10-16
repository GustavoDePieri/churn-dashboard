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

Your Google Sheet should have the following columns (in order):

| Column | Description |
|--------|-------------|
| A | ID |
| B | Client Name |
| C | Churn Date (YYYY-MM-DD) |
| D | Reactivation Date (YYYY-MM-DD) |
| E | Churn Category |
| F | Service Category |
| G | Competitor |
| H | MRR |
| I | Price |
| J | Feedback |

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
├── components/          # React components
│   ├── MetricCard.tsx
│   ├── ChartCard.tsx
│   ├── AIInsights.tsx
│   └── LoadingSpinner.tsx
├── lib/                 # Utility functions
│   ├── googleSheets.ts  # Google Sheets API integration
│   ├── geminiAI.ts      # Google Gemini AI integration
│   └── churnAnalytics.ts # Analytics calculations
├── pages/
│   ├── api/             # API routes
│   │   ├── churn-data.ts
│   │   └── product-feedback.ts
│   ├── _app.tsx
│   └── index.tsx        # Main dashboard page
├── types/
│   └── index.ts         # TypeScript type definitions
└── styles/
    └── globals.css      # Global styles
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own purposes.

