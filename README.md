# Recycly Backend

A comprehensive waste disposal incentive application backend built with Next.js 15, Better Auth, tRPC, and Prisma Postgres.

## 🚀 Features

- **Better Auth Integration**: Direct client-side authentication with Google OAuth
- **tRPC API**: End-to-end type-safe API for business logic
- **Multi-Role System**: Support for superadmin, admin, waste-manager, and user roles
- **Prisma Postgres**: PostgreSQL database with Prisma ORM
- **Real-time Capabilities**: Pusher integration for live updates
- **File Upload**: UploadThing for secure file handling
- **Email Service**: Resend for transactional emails
- **Push Notifications**: Web Push with VAPID keys

## 🛠️ **Final Tech Stack**

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Better Auth (direct client usage)
- **API Layer**: tRPC (business logic only)
- **Database**: Prisma Postgres
- **Email Service**: Resend
- **File Upload**: UploadThing
- **Real-time**: Pusher
- **Push Notifications**: Web Push with VAPID
- **Validation**: Zod schema validation
- **TypeScript**: Full type safety with import aliases

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Prisma Postgres recommended)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Environment Setup

\`\`\`env
# Database
DATABASE_URL="your_prisma_postgres_connection_string"

# Better Auth
BETTER_AUTH_SECRET="your-better-auth-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Services
RESEND_API_KEY="your_resend_api_key"
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
PUSHER_APP_ID="your_pusher_app_id"
PUSHER_KEY="your_pusher_key"
PUSHER_SECRET="your_pusher_secret"
PUSHER_CLUSTER="your_pusher_cluster"
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"
VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PRIVATE_KEY="your_vapid_private_key"
VAPID_EMAIL="admin@recycly.com"
\`\`\`

### 2. Install and Setup

\`\`\`bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
\`\`\`

## 🔐 Authentication Architecture

Authentication is handled directly on the client-side using Better Auth:

\`\`\`tsx
import { signIn, signUp, useSession } from "@/lib/auth-client"

// Email/Password Sign Up
const { data, error } = await signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe"
})

// Google OAuth
const { data, error } = await signIn.social({
  provider: "google",
  callbackURL: "/dashboard"
})

// Session Management
const { data: session, isPending } = useSession()
\`\`\`

## 📡 tRPC API Usage

tRPC is used only for business logic:

\`\`\`tsx
import { api } from "@/lib/trpc/client"

// Waste disposal
const disposeMutation = api.waste.dispose.useMutation()

// Get user profile
const { data: profile } = api.user.getProfile.useQuery()

// Admin operations
const { data: users } = api.admin.getUsers.useQuery()
\`\`\`

## 🗄️ Database: Prisma Postgres

Using standard PostgreSQL with Prisma ORM:
- Type-safe database operations
- Automatic migrations
- Comprehensive schema for waste management

## 📧 Email Integration (Resend)

Automated emails for:
- Welcome messages
- Email verification
- Password reset
- Points earned notifications

## 📁 File Upload (UploadThing)

Secure file upload endpoints:
- Waste disposal photos
- User avatars
- Waste bin images
- Report photos
- Reward images

## 🔔 Real-time & Push Notifications

### Pusher Integration
- Points earned notifications
- Waste bin status updates
- Admin alerts

### Web Push Notifications
- Browser notifications for achievements
- Nearby waste bin alerts
- New rewards available

## 🔧 Development Commands

\`\`\`bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
\`\`\`

## 🧪 Testing

### Sample Test Users

\`\`\`bash
# Superadmin
Email: superadmin@recycly.com
Password: superadmin123

# Admin  
Email: admin@recycly.com
Password: admin123

# Waste Manager
Email: wastemanager@recycly.com  
Password: wastemanager123

# Regular User
Email: user@recycly.com
Password: user123
\`\`\`

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set Environment Variables**
   - Add all environment variables in Vercel dashboard

3. **Database Setup**
   - Use Prisma Postgres or any PostgreSQL service
   - Run migrations: `npx prisma migrate deploy`

---

**Happy Recycling! 🌱♻️**
