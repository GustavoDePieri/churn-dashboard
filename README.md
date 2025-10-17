# 📊 Ontop Churn Analytics Dashboard

> AI-powered churn analysis dashboard with real-time insights from Google Sheets

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

---

## 🎯 Features

### 📈 **Analytics Dashboards**
- **Main Dashboard** - Overview of churn metrics and trends
- **Reactivations Dashboard** - Track customer returns and recovery
- **Monthly Report** - Comprehensive monthly analysis with date filtering

### 🤖 **AI-Powered Insights**
- Powered by **Google Gemini 2.5 Flash**
- Concise executive summaries
- Actionable recommendations
- Pattern recognition and trend analysis

### 🔐 **Authentication & Security**
- Secure login with NextAuth.js
- JWT-based sessions (30-day expiry)
- Bcrypt password hashing
- Protected routes

### 🎨 **Modern UI/UX**
- Ontop brand identity (purple-to-pink gradients)
- Glassmorphism design
- Dark-first theme
- Fully responsive (mobile, tablet, desktop)
- Real-time data freshness indicator

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Project with Sheets API enabled
- Google Gemini API key
- Vercel account (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/GustavoDePieri/churn-dashboard.git
cd churn-dashboard
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```bash
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Sheets - Churn Data
GOOGLE_SHEETS_ID=your_churn_sheet_id
GOOGLE_SHEETS_TAB=your_churn_tab_name

# Google Sheets - Reactivations
GOOGLE_REACTIVATIONS_SHEETS_ID=your_reactivations_sheet_id
GOOGLE_REACTIVATIONS_TAB=your_reactivations_tab_name

# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_secure_random_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

**Default Login:**
- Email: `admin@ontop.com`
- Password: `ontop2025`

---

## 📊 Google Sheets Setup

### Churn Sheet Structure

Required columns (A-S):

| Column | Field | Description |
|--------|-------|-------------|
| A | Account Name | Client name |
| B | CS Group | Customer success group |
| C | Platform Client ID | Unique identifier |
| D | CS Sub-Group | Customer success sub-group |
| E | Last Invoice MRR | Monthly recurring revenue |
| F | TPV Last Month | Total payment volume |
| G | Warning Metrics | Warning indicators |
| H | Warning Explanation | Warning details |
| I | Churn Explanation ST | Short churn explanation |
| J | Primary Churn Category | Main churn reason |
| K | Warning Reason | Warning reason |
| L | Account ID | Account identifier |
| M | Avg MRR | Average MRR |
| N | Avg TPV | Average TPV |
| O | Last Effective Payment Date | Last payment date |
| P | Churn Date | Date of churn |
| Q | Last Invoice Date | Last invoice date |
| R | Owner Area | Owner area |
| S | Account Owner | Account owner name |

### Reactivations Sheet Structure

Required columns (A-J):

| Column | Field | Description |
|--------|-------|-------------|
| A | Platform Client ID | Unique identifier |
| B | Customer Success Path | CS path |
| C | Account Owner | Owner name |
| D | Account Name | Client name |
| E | MRR | Monthly recurring revenue |
| F | Active Contracts | Number of contracts |
| G | Reactivation ID | Reactivation identifier |
| H | Reactivation Date | Date of reactivation |
| I | Reactivation Reason | Reason for return |
| J | Churn Date | Original churn date |

### Google Cloud Setup

1. **Create Service Account**:
   - Go to Google Cloud Console
   - Create new service account
   - Download JSON key file

2. **Enable APIs**:
   - Google Sheets API
   - Google Drive API

3. **Share Sheets**:
   - Share your Google Sheets with service account email
   - Grant "Editor" permissions

---

## 🚀 Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 2. Import to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables

### 3. Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

**Required Variables:**
- `GEMINI_API_KEY`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SHEETS_TAB`
- `GOOGLE_REACTIVATIONS_SHEETS_ID`
- `GOOGLE_REACTIVATIONS_TAB`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `NEXTAUTH_SECRET` (generate new for production)
- `NEXTAUTH_URL` (your Vercel URL)

**Important Notes:**
- For `GOOGLE_PRIVATE_KEY`: Copy entire key including `-----BEGIN/END-----`
- For `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- For `NEXTAUTH_URL`: Use your actual Vercel URL (e.g., `https://your-app.vercel.app`)

### 4. Deploy

Vercel will auto-deploy when you push to GitHub.

---

## 🎨 Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless functions
- **NextAuth.js** - Authentication
- **Google Sheets API** - Data source
- **Google Gemini 2.5** - AI insights

### Libraries
- `date-fns` - Date manipulation
- `bcryptjs` - Password hashing
- `next-auth` - Authentication

---

## 📁 Project Structure

```
churn-dashboard/
├── components/           # React components
│   ├── Header.tsx       # Navigation header
│   ├── MetricCard.tsx   # Metric display card
│   ├── ChartCard.tsx    # Chart wrapper
│   └── ...
├── lib/                 # Utility functions
│   ├── googleSheets.ts  # Google Sheets integration
│   ├── geminiAI.ts      # AI insights generation
│   ├── churnAnalytics.ts      # Churn analysis logic
│   ├── reactivationAnalytics.ts # Reactivation analysis
│   └── utils/
│       └── reactivationCalculator.ts # Centralized calculations
├── pages/               # Next.js pages
│   ├── index.tsx        # Main dashboard
│   ├── login.tsx        # Login page
│   ├── reactivations.tsx # Reactivations dashboard
│   ├── monthly-report.tsx # Monthly report
│   └── api/             # API routes
│       ├── auth/        # NextAuth endpoints
│       ├── churn-data.ts
│       ├── reactivations.ts
│       └── ...
├── styles/              # Global styles
├── types/               # TypeScript types
├── public/              # Static assets
└── middleware.ts        # Route protection
```

---

## 🔐 Authentication

### Default Credentials
- **Email**: `admin@ontop.com`
- **Password**: `ontop2025`

### Adding New Users

Edit `pages/api/auth/[...nextauth].ts`:

```typescript
const users = [
  {
    id: '1',
    email: 'admin@ontop.com',
    password: 'bcrypt_hash_here',
    name: 'User Name',
  },
  // Add more users
];
```

**Generate password hash:**
```bash
npm install -g bcrypt-cli
bcrypt your-password 10
```

### Session Management
- **Duration**: 30 days
- **Type**: JWT (encrypted)
- **Security**: HTTP-only cookies

---

## 📊 Dashboard Features

### Main Dashboard (`/`)
- Total churns and average reactivation time
- Top churn categories (stacked by month)
- Monthly churn trends
- Competitor analysis
- AI insights with executive summary

### Reactivations Dashboard (`/reactivations`)
- Total reactivations and MRR recovered
- Reactivation reasons breakdown
- Monthly reactivation trends
- Customer success path analysis

### Monthly Report (`/monthly-report`)
- Date range filtering
- Churn vs reactivation comparison
- Client journey tracking
- Correlation analysis
- Service categories breakdown
- Competitor win analysis

---

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'navy-main': '#1a0d2e',
  'navy-dark': '#0f0819',
  'purple-main': '#8b5cf6',
  'pink-main': '#ec4899',
  'coral-main': '#f43f5e',
}
```

### Logo

Replace `public/logo.jpg` with your logo (recommended size: 512x256px)

---

## 🐛 Troubleshooting

### "Cannot find module 'next-auth'"
```bash
npm install next-auth bcryptjs
npm install --save-dev @types/bcryptjs
```

### "NEXTAUTH_SECRET is not defined"
Add to `.env.local`:
```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### "Error fetching data from Google Sheets"
1. Check service account email has access to sheets
2. Verify `GOOGLE_SHEETS_ID` is correct
3. Ensure private key format is correct (with `\n` for line breaks)

### "Average reactivation time showing 0 days"
Ensure reactivations sheet has:
- Column H: Reactivation Date
- Column J: Churn Date (same format as Churn sheet)

---

## 📈 Performance

- **Initial Load**: < 2 seconds
- **AI Insights**: Loads asynchronously (non-blocking)
- **Data Refresh**: Real-time from Google Sheets
- **Session Duration**: 30 days

---

## 🔒 Security Best Practices

### Production Checklist
- [x] Use strong `NEXTAUTH_SECRET`
- [x] Never commit `.env.local` to Git
- [x] Rotate API keys periodically
- [x] Use HTTPS only (Vercel default)
- [x] Enable Vercel security headers
- [x] Keep dependencies updated

### Environment Variables
Never commit these files:
- `.env.local`
- `.env.production`
- Service account JSON files

---

## 📝 License

Private project for Ontop internal use.

---

## 🤝 Support

For issues or questions:
1. Check this README
2. Review `AUTHENTICATION_GUIDE.md` for auth details
3. Check `VERCEL_AUTH_SETUP.md` for deployment help

---

## 🎉 Features Roadmap

### ✅ Implemented
- Authentication system
- AI-powered insights
- Multi-dashboard interface
- Real-time data freshness
- Mobile-responsive design
- Monthly report with filtering

### 🔜 Future Enhancements
- Export reports to PDF
- Email notifications for alerts
- Custom date range analytics
- User role management
- API rate limiting
- Webhook integrations

---

**Built with ❤️ for Ontop**

*Powered by Google Gemini 2.5 Flash & Google Sheets*
