# Better Auth Setup Guide for Recycly

## 🚀 Overview

This project uses **Better Auth** for authentication instead of NextAuth. Better Auth provides a modern, secure, and flexible authentication solution with built-in support for:

- ✅ Email and password authentication
- ✅ Social login (Google OAuth)
- ✅ Multi-factor authentication (Email codes via Resend)
- ✅ Email verification
- ✅ Role-based user management (4 user types)
- ✅ Rate limiting
- ✅ Session management

## 👥 User Types

The system supports 4 user roles:

1. **Regular User** (`USER`) - Basic user with access to waste disposal tracking
2. **Waste Manager** (`WASTE_MANAGER`) - Can manage waste bins and verify disposals
3. **Admin** (`ADMIN`) - Administrative access to user management
4. **Super Admin** (`SUPERADMIN`) - Full system access and configuration

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables (see `env.example` for template):

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/recycly"

# Better Auth
BETTER_AUTH_SECRET="your-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email Service (Resend)
RESEND_API_KEY="your_resend_api_key"
FROM_EMAIL="noreply@recycly.onresend.com"

# Other services...
```

### Database Setup

1. **Generate Prisma client:**

   ```bash
   pnpm run db:generate
   ```

2. **Run migrations:**

   ```bash
   pnpm run db:migrate
   ```

3. **Seed the database with 4 users:**
   ```bash
   pnpm run db:seed
   ```

## 🧪 Testing Your Authentication

### 1. Pre-configured Test Accounts

After running the seed script, you'll have these accounts:

- **Super Admin**: `superadmin@recycly.com` / `superadmin123`
- **Admin**: `admin@recycly.com` / `admin123`
- **Waste Manager**: `manager@recycly.com` / `manager123`
- **Regular User**: `user@recycly.com` / `user123`

### 2. Sign Up Flow

1. Go to `/auth/signup`
2. Fill out the form with:
   - **Name**: Your full name
   - **Email**: A valid email address
   - **Password**: Must meet requirements:
     - At least 8 characters
     - Uppercase letter
     - Lowercase letter
     - Number
     - Special character
3. Submit the form
4. You'll be redirected to email verification
5. Check your email for verification link
6. After verification, you can sign in

### 3. Sign In Flow

1. Go to `/auth/signin`
2. Enter your email and password
3. If 2FA is enabled, you'll be redirected to `/auth/verify-2fa`
4. Enter the 6-digit verification code sent to your email
5. Access your dashboard or role selection

### 4. Google OAuth Flow

1. Click "Continue with Google" on signup/signin forms
2. Complete Google OAuth flow
3. You'll be redirected to role selection
4. Choose your role to access the system

### 5. Email Verification

1. After signup, check your email for verification link
2. Click the link to verify your email
3. You'll be redirected to the verification page
4. Once verified, you can sign in

## 🔒 Security Features

### Password Requirements

- **Minimum length**: 8 characters
- **Complexity**: Must include:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&\*...)

### Multi-Factor Authentication

- **Email codes**: 6-digit verification codes sent via Resend
- **Code expiration**: 10 minutes
- **Automatic resend**: Available after 60 seconds

### Rate Limiting

- **Window**: 1 minute
- **Maximum requests**: 100 per minute
- **Protection**: Against brute force attacks

### Session Management

- **Strategy**: Database-stored sessions
- **Expiration**: 7 days
- **Update frequency**: Every 24 hours

## 🚨 Troubleshooting

### Common Issues

1. **"Port 3000 is in use"**

   - Solution: The app will automatically use the next available port (e.g., 3001)
   - Update your `NEXT_PUBLIC_APP_URL` to match the actual port

2. **Database connection errors**

   - Ensure PostgreSQL is running
   - Check your `DATABASE_URL` format
   - Run `pnpm run db:generate` and `pnpm run db:migrate`

3. **Authentication not working**

   - Check browser console for errors
   - Verify environment variables are set
   - Ensure the auth API route is accessible at `/api/auth/[...all]`

4. **Email verification not working**

   - Check if email service is configured
   - Verify `RESEND_API_KEY` is set (if using Resend)
   - Check email service logs

5. **2FA not working**
   - Ensure `BETTER_AUTH_SECRET` is set
   - Check if 2FA is enabled in auth configuration
   - Verify Resend API key is valid

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

## 📱 Social Login (Google)

### Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/auth/callback/google`

### Testing

1. Click "Continue with Google" on signup/signin forms
2. Complete Google OAuth flow
3. Verify user is created/logged in successfully
4. Check role assignment and redirects

## 🔄 API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/2fa/verify` - 2FA verification
- `POST /api/auth/2fa/resend` - Resend 2FA code

### Protected Routes

All routes under `/dashboard/*` require authentication. Unauthenticated users will be redirected to `/auth/signin`.

## 🎯 Next Steps

1. **Configure Email Service**: Set up Resend for verification emails
2. **Customize User Roles**: Modify the role system in `src/lib/auth.ts`
3. **Add More Social Providers**: Implement additional OAuth providers
4. **Enhance 2FA**: Add QR code generation for TOTP apps
5. **User Management**: Build admin panels for user management

## 📚 Resources

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth GitHub](https://github.com/next-auth/better-auth)
- [Resend Documentation](https://resend.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Review the server logs
3. Verify all environment variables are set
4. Ensure database is properly configured
5. Check if all dependencies are installed

For Better Auth specific issues, refer to their [GitHub issues](https://github.com/next-auth/better-auth/issues) or [Discord community](https://discord.gg/nextauth).
