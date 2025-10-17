# 🔐 Authentication System - Complete Guide

## Overview
The Ontop Churn Dashboard now includes a complete authentication system with:
- ✅ Secure login page with Ontop branding
- ✅ Protected dashboard routes
- ✅ Persistent sessions (30 days)
- ✅ Logout functionality
- ✅ Header with logo, user info, and data freshness indicator

---

## 🎯 Features Implemented

### 1. **Login Page** (`pages/login.tsx`)
- Beautiful glassmorphism design matching dashboard aesthetic
- Ontop logo integration
- Animated background with gradient blobs
- Error handling and loading states
- Demo credentials displayed for convenience

### 2. **Authentication Provider** (`pages/api/auth/[...nextauth].ts`)
- NextAuth.js with credentials provider
- Bcrypt password hashing
- JWT-based sessions (30-day expiry)
- Secure authentication flow

### 3. **Navigation Header** (`components/Header.tsx`)
- Clickable Ontop logo (returns to home)
- User information display
- Logout button with smooth transition
- **Last Updated indicator** - Shows when data was last fetched from Google Sheets
- Responsive design (mobile-friendly)

### 4. **Route Protection** (`middleware.ts`)
- Automatic redirect to login for unauthenticated users
- Protected routes:
  - `/` - Main dashboard
  - `/reactivations` - Reactivations dashboard
  - `/monthly-report` - Monthly report
  - `/debug` - Debug pages

### 5. **Data Freshness Tracking**
- Each dashboard tracks `lastUpdated` timestamp
- Displays in header when data was last fetched
- Updates every time data is fetched from Google Sheets
- Real-time indicator shows data is live

---

## 🔑 Default Login Credentials

```
Email: admin@ontop.com
Password: ontop2025
```

**Security Note**: These are demo credentials. For production, change the password hash in `pages/api/auth/[...nextauth].ts`.

---

## 🚀 How to Use

### Local Development

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Visit the dashboard**:
   ```
   http://localhost:3000
   ```

3. **You'll be redirected to login**:
   ```
   http://localhost:3000/login
   ```

4. **Login with demo credentials**:
   - Email: `admin@ontop.com`
   - Password: `ontop2025`

5. **You're in!** The header shows:
   - Ontop logo (click to return home)
   - Last updated timestamp
   - Your user info
   - Logout button

---

## 📝 Environment Variables Required

### `.env.local` (Development)
```bash
# Existing variables
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SHEETS_TAB=your_tab_name
# ... other Google Sheets vars

# New: NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

### Vercel (Production)
Add these environment variables in Vercel dashboard:

1. **NEXTAUTH_SECRET**
   - Value: Generate a secure random string (use `openssl rand -base64 32`)
   - Required for JWT encryption

2. **NEXTAUTH_URL**
   - Value: `https://your-app.vercel.app`
   - Your production URL

---

## 🎨 UI/UX Features

### Login Page
- **Gradient background** with animated blobs
- **Glassmorphism card** with smooth transitions
- **Form validation** with clear error messages
- **Loading states** during authentication
- **Responsive design** - works on mobile, tablet, desktop

### Header Navigation
- **Sticky header** - stays visible when scrolling
- **Glassmorphism effect** with blur
- **Hover effects** on interactive elements
- **Mobile responsive** - collapses on small screens
- **Real-time data indicator** with pulse animation

### Last Updated Display
```
Desktop: Shows full timestamp (e.g., "Jan 15, 2025 14:30:45")
Mobile: Shows compact version (e.g., "Updated: Jan 15, 14:30")
```

---

## 🔧 Technical Implementation

### Session Management
- **Strategy**: JWT (JSON Web Tokens)
- **Duration**: 30 days
- **Storage**: HTTP-only cookies
- **Security**: Encrypted with NEXTAUTH_SECRET

### Password Security
- **Algorithm**: bcrypt
- **Rounds**: 10 (default)
- **Hashing**: Server-side only
- **Storage**: Hashed passwords only

### Protected Routes
The middleware automatically checks authentication for:
```typescript
matcher: [
  '/',
  '/reactivations',
  '/monthly-report',
  '/debug',
]
```

Public routes (no auth required):
- `/login`
- `/api/auth/*` (NextAuth endpoints)

---

## 🔐 Security Best Practices

### ✅ Implemented
1. **Password hashing** with bcrypt
2. **Secure sessions** with JWT
3. **HTTP-only cookies** (prevents XSS)
4. **Environment variables** for secrets
5. **CSRF protection** (built into NextAuth)
6. **Automatic session expiry**

### 🛡️ Recommendations for Production
1. **Change default password** - Generate new hash
2. **Use database** for user management
3. **Add rate limiting** for login attempts
4. **Enable HTTPS only** (Vercel does this automatically)
5. **Rotate NEXTAUTH_SECRET** periodically
6. **Add 2FA** for extra security (optional)

---

## 👤 Adding New Users

### Current Implementation (In-Memory)
Edit `pages/api/auth/[...nextauth].ts`:

```typescript
const users = [
  {
    id: '1',
    email: 'admin@ontop.com',
    password: '$2a$10$...', // bcrypt hash
    name: 'Ontop Admin',
  },
  // Add new users here
];
```

### Generate Password Hash
```bash
# Install bcrypt CLI
npm install -g bcrypt-cli

# Generate hash
bcrypt your-password 10
```

### Future: Database Integration
For production, replace in-memory users with:
- **PostgreSQL** (recommended)
- **MongoDB**
- **MySQL**
- Any database via Prisma/TypeORM

---

## 📊 Data Freshness Indicator

### How It Works
1. Each dashboard has a `lastUpdated` state
2. When data is fetched from APIs, timestamp is set
3. Header displays the timestamp
4. Green pulse animation shows "live" status

### Implementation
```typescript
// In dashboard component
const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

// After successful data fetch
setLastUpdated(new Date());

// Pass to Header
<Header lastUpdated={lastUpdated} />
```

---

## 🎯 User Flow

```
1. User visits dashboard → Redirected to /login
                                ↓
2. User enters credentials → NextAuth validates
                                ↓
3. Valid? → Create JWT session → Redirect to dashboard
   Invalid? → Show error → Stay on login
                                ↓
4. Dashboard loads → Show header with user info
                                ↓
5. User clicks logo → Navigate to home
   User clicks logout → Destroy session → Redirect to login
```

---

## 🐛 Troubleshooting

### Issue: "NEXTAUTH_SECRET missing"
**Solution**: Add to `.env.local`:
```bash
NEXTAUTH_SECRET=your_secret_here
```

### Issue: Redirected to login after login
**Solution**: Check NEXTAUTH_URL matches your domain:
```bash
# Development
NEXTAUTH_URL=http://localhost:3000

# Production (Vercel)
NEXTAUTH_URL=https://your-app.vercel.app
```

### Issue: Logo not displaying
**Solution**: Ensure `Ontop-logo.jpg` is in `/public/logo.jpg`

### Issue: Session expires too quickly
**Solution**: Increase maxAge in `pages/api/auth/[...nextauth].ts`:
```typescript
session: {
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

---

## 📦 Dependencies Added

```json
{
  "next-auth": "^4.x",
  "bcryptjs": "^2.x",
  "@types/bcryptjs": "^2.x"
}
```

---

## 🎨 Design System

### Colors Used
- **Background**: Navy gradient (`#1a0d2e`, `#0f0819`, `#2a1b3d`)
- **Primary**: Purple (`#8b5cf6`)
- **Secondary**: Pink (`#ec4899`)
- **Accent**: Coral (`#f43f5e`)
- **Success**: Green (`#34d399`)

### Components
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradients**: Purple-to-pink brand gradient
- **Animations**: Smooth transitions, pulse effects, hover states

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
  - Stacked layout
  - Compact header
  - Single column

- **Tablet**: 640px - 1024px
  - 2-column grid
  - Medium header

- **Desktop**: > 1024px
  - Full layout
  - Large header with all elements

---

## 🚀 Deployment Checklist

### Before Deploying to Vercel

1. ✅ Add environment variables in Vercel:
   - `NEXTAUTH_SECRET` (generate new for production)
   - `NEXTAUTH_URL` (your Vercel URL)
   - All existing Google Sheets/Gemini variables

2. ✅ Update password hash (optional but recommended)

3. ✅ Test login flow locally

4. ✅ Commit and push to GitHub

5. ✅ Vercel auto-deploys

6. ✅ Test on production URL

---

## 🎉 Success!

Your dashboard now has:
- 🔐 Secure authentication
- 🎨 Beautiful Ontop-branded login page
- 🧭 Professional navigation header
- 📊 Real-time data freshness indicator
- 🚪 Easy logout functionality
- 📱 Fully responsive design

**Ready to deploy!** 🚀

