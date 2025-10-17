# 🔐 Authentication Guide

Complete guide for authentication features in the Ontop Churn Dashboard.

---

## 🎯 Overview

The dashboard uses **NextAuth.js** with secure JWT sessions for authentication.

### Default Credentials
```
Email: admin@ontop.com
Password: ontop2025
```

---

## 🔑 Features

### 1. Login Page (`/login`)
- Ontop-branded design with logo
- Glassmorphism UI
- Form validation
- Error handling
- Demo credentials displayed

### 2. Navigation Header
- **Clickable logo** → Returns to homepage
- **User info** → Display name and email
- **Last updated** → Data freshness indicator
- **Logout button** → Sign out

### 3. Route Protection
All dashboard pages require authentication:
- `/` - Main dashboard
- `/reactivations` - Reactivations
- `/monthly-report` - Monthly report

Unauthenticated users → Redirected to `/login`

---

## 🛠️ Configuration

### Environment Variables

Required in `.env.local`:
```bash
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**Generate secret:**
```bash
openssl rand -base64 32
```

---

## 👤 User Management

### Add New Users

Edit `pages/api/auth/[...nextauth].ts`:

```typescript
const users = [
  {
    id: '1',
    email: 'admin@ontop.com',
    password: '$2b$10$...', // bcrypt hash
    name: 'Ontop Admin',
  },
  // Add more users here
];
```

### Generate Password Hash

```bash
# Install bcrypt CLI
npm install -g bcrypt-cli

# Generate hash
bcrypt your-password 10
```

**Example:**
```bash
$ bcrypt ontop2025 10
$2b$10$C3lmnEQr25O9hRi.YeJYaOmf1L.vz3grXnkf92gdtj2aBMhylkhDC
```

---

## 🔒 Security Features

### Implemented
- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT sessions with encryption
- ✅ HTTP-only cookies (prevents XSS)
- ✅ CSRF protection (NextAuth built-in)
- ✅ 30-day session expiry
- ✅ Secure environment variables

### Production Recommendations
1. Use unique `NEXTAUTH_SECRET` per environment
2. Rotate secrets periodically
3. Use database for user management (not in-memory)
4. Enable 2FA (optional)
5. Add rate limiting for login attempts

---

## 📊 Session Management

### Session Details
- **Type**: JWT (JSON Web Tokens)
- **Duration**: 30 days
- **Storage**: HTTP-only cookies
- **Encryption**: AES-256 (via NEXTAUTH_SECRET)

### Configuration

In `pages/api/auth/[...nextauth].ts`:

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

**Change duration:**
```typescript
maxAge: 7 * 24 * 60 * 60, // 7 days
```

---

## 🎨 UI Components

### Header Component
Location: `components/Header.tsx`

**Features:**
- Ontop logo (clickable)
- Last updated timestamp
- User info display
- Logout button
- Responsive design

**Usage:**
```typescript
import Header from '@/components/Header';

<Header lastUpdated={new Date()} />
```

### Login Page
Location: `pages/login.tsx`

**Features:**
- Email/password form
- Loading states
- Error messages
- Demo credentials box
- Animated background

---

## 🐛 Troubleshooting

### Issue: "NEXTAUTH_SECRET not defined"
**Solution:** Add to `.env.local`:
```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### Issue: Infinite redirect loop
**Solution:** Check `NEXTAUTH_URL`:
- Development: `http://localhost:3000`
- Production: `https://your-app.vercel.app`
- No trailing slash!

### Issue: "Cannot get session"
**Solution:**
1. Clear browser cookies
2. Try incognito mode
3. Restart dev server

### Issue: Wrong password but no error
**Solution:** Verify password hash:
```bash
node -e "console.log(require('bcryptjs').compareSync('ontop2025', 'your_hash_here'))"
```

---

## 📱 User Flow

```
1. Visit dashboard
   ↓
2. Not authenticated? → Redirect to /login
   ↓
3. Enter credentials → Validate
   ↓
4. Valid? → Create session → Redirect to dashboard
   Invalid? → Show error
   ↓
5. Use dashboard → Header shows user info
   ↓
6. Click logout → Destroy session → Redirect to /login
```

---

## 🔧 Advanced Configuration

### Custom Login Page URL

In `pages/api/auth/[...nextauth].ts`:
```typescript
pages: {
  signIn: '/custom-login', // Change this
}
```

### Custom Callbacks

```typescript
callbacks: {
  async jwt({ token, user }) {
    // Add custom data to token
    if (user) {
      token.customField = 'value';
    }
    return token;
  },
  async session({ session, token }) {
    // Add custom data to session
    session.customField = token.customField;
    return session;
  },
}
```

---

## 📚 Resources

### NextAuth.js Documentation
- Website: https://next-auth.js.org
- GitHub: https://github.com/nextauthjs/next-auth

### Related Files
- Auth API: `pages/api/auth/[...nextauth].ts`
- Login Page: `pages/login.tsx`
- Header: `components/Header.tsx`
- Middleware: `middleware.ts`
- App Wrapper: `pages/_app.tsx`

---

## ✅ Checklist

### Development Setup
- [x] Install dependencies (`next-auth`, `bcryptjs`)
- [x] Add environment variables (`.env.local`)
- [x] Configure NextAuth
- [x] Create login page
- [x] Add SessionProvider to `_app.tsx`
- [x] Test login flow

### Production Deployment
- [x] Generate strong `NEXTAUTH_SECRET`
- [x] Add environment variables in Vercel
- [x] Update `NEXTAUTH_URL` to production URL
- [x] Test authentication on production
- [x] Verify session persistence

---

**Questions?** Check the main README.md or VERCEL_AUTH_SETUP.md

---

**Built with NextAuth.js & Ontop brand identity**
