# 🔐 Recycly Authentication System

## Overview

Recycly uses **Better Auth** for a modern, secure authentication system supporting:

- 🔑 **Email & Password** authentication
- 🌐 **Google OAuth** social login
- 📧 **Email verification** via Resend
- 🔒 **Two-Factor Authentication (2FA)** via email codes
- 👥 **4 User Roles** with role-based access control

## 🚀 Quick Start

### 1. Environment Setup

Copy `env.example` to `.env.local` and configure:

```bash
# Required: Database
DATABASE_URL="postgresql://username:password@localhost:5432/recycly"

# Required: Better Auth
BETTER_AUTH_SECRET="your-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Required: Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Required: Email Service
RESEND_API_KEY="your_resend_api_key"
FROM_EMAIL="noreply@recycly.onresend.com"
```

### 2. Database Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Seed with 4 test users
pnpm run db:seed
```

### 3. Start Development

```bash
pnpm run dev
```

## 👥 User Types & Access

| Role              | Access Level   | Description                              |
| ----------------- | -------------- | ---------------------------------------- |
| **USER**          | Basic          | Waste disposal tracking, points, rewards |
| **WASTE_MANAGER** | Manager        | Bin management, disposal verification    |
| **ADMIN**         | Administrative | User management, system configuration    |
| **SUPERADMIN**    | Full Access    | Complete system control                  |

### Test Accounts

After seeding, use these accounts:

- **Super Admin**: `superadmin@recycly.com` / `superadmin123`
- **Admin**: `admin@recycly.com` / `admin123`
- **Waste Manager**: `manager@recycly.com` / `manager123`
- **Regular User**: `user@recycly.com` / `user123`

## 🔐 Authentication Flows

### Sign Up Flow

1. **User Registration** → `/auth/signup`
2. **Email Verification** → `/auth/verify-email`
3. **Role Selection** → `/auth/select-role`
4. **Dashboard Access** → `/dashboard`

### Sign In Flow

1. **Credentials** → `/auth/signin`
2. **2FA Verification** → `/auth/verify-2fa` (if enabled)
3. **Role-Based Redirect** → Dashboard or Role Selection

### Google OAuth Flow

1. **Social Login** → Google OAuth
2. **Role Selection** → `/auth/select-role`
3. **Dashboard Access** → `/dashboard`

## 🔒 Security Features

### Password Requirements

- Minimum 8 characters
- Uppercase + Lowercase + Numbers + Special characters

### Two-Factor Authentication

- 6-digit email codes via Resend
- 10-minute expiration
- Automatic resend after 60 seconds

### Session Management

- Database-stored sessions
- 7-day expiration
- 24-hour update frequency

## 📧 Email Integration

### Resend Configuration

- **API Key**: Set `RESEND_API_KEY` in environment
- **From Email**: Configure `FROM_EMAIL` for sender address
- **Templates**: Professional HTML + Text email templates

### Email Types

1. **Verification Emails** - Account activation
2. **2FA Codes** - Security verification
3. **Password Reset** - Account recovery

## 🌐 Google OAuth Setup

### 1. Google Cloud Console

- Create project at [console.cloud.google.com](https://console.cloud.google.com)
- Enable Google+ API
- Create OAuth 2.0 credentials

### 2. Redirect URIs

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/auth/callback/google
```

### 3. Environment Variables

```bash
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
```

## 🗄️ Database Schema

### Core Tables

- `users` - User accounts and profiles
- `sessions` - Authentication sessions
- `accounts` - OAuth provider connections
- `verifications` - Email verification tokens

### User Fields

```sql
id, email, name, image, role, points, level,
isActive, emailVerified, createdAt, updatedAt
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/[...all]` - Better Auth handler
- `POST /api/auth/2fa/verify` - 2FA verification
- `POST /api/auth/2fa/resend` - Resend 2FA code

### Session Management

- `GET /api/auth/session` - Current session
- `POST /api/auth/sign-out` - Sign out

## 🚨 Troubleshooting

### Common Issues

1. **"Better Auth not working"**

   - Check `BETTER_AUTH_SECRET` is set
   - Verify database connection
   - Check API route accessibility

2. **"2FA not working"**

   - Ensure Resend API key is valid
   - Check email delivery
   - Verify 2FA is enabled in config

3. **"Google OAuth failing"**

   - Check redirect URIs match
   - Verify client ID/secret
   - Check Google API is enabled

4. **"Database errors"**
   - Run `pnpm run db:generate`
   - Check `DATABASE_URL` format
   - Ensure PostgreSQL is running

### Debug Mode

```bash
NODE_ENV=development
```

## 📚 Resources

- [Better Auth Docs](https://better-auth.com/)
- [Resend Documentation](https://resend.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Auth](https://nextjs.org/docs/authentication)

## 🤝 Support

For issues:

1. Check browser console
2. Review server logs
3. Verify environment variables
4. Check database connectivity
5. Review Better Auth documentation

---

**Built with ❤️ using Better Auth, Next.js, Prisma, and Resend**
