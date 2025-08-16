# 🚀 Recycly Backend Setup Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🔧 Installation Steps

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <repository-url>
cd recycly-backend
npm install
\`\`\`

### 2. Environment Configuration

Copy the example environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables in `.env.local`:

\`\`\`env
# Database - Use your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/recycly_db"

# Better Auth - Generate a secure secret (min 32 characters)
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars-long"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Add other services as needed...
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your application!

## 🧪 Test Accounts

After seeding, you can use these test accounts:

- **Superadmin**: `superadmin@recycly.com` / `superadmin123`
- **Admin**: `admin@recycly.com` / `admin123`
- **Waste Manager**: `wastemanager@recycly.com` / `wastemanager123`
- **User**: `user@recycly.com` / `user123`

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running

2. **tRPC Errors**
   - Make sure all environment variables are set
   - Check that the database is migrated

3. **Build Errors**
   - Run `npm run type-check` to find TypeScript issues
   - Ensure all dependencies are installed

### Useful Commands:

\`\`\`bash
# Type checking
npm run type-check

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:push        # Push schema changes
npm run db:studio      # Open Prisma Studio

# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server
\`\`\`

## 📚 Next Steps

1. Configure your external services (Google OAuth, Resend, etc.)
2. Customize the application for your needs
3. Deploy to Vercel or your preferred platform

Happy coding! 🌱♻️
