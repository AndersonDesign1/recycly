# Recycling Rewards App - Backend Development Guide

## Overview

This backend powers a Recycling Rewards App.
The app pays users for recycling different types of waste (plastic, iron, etc.) using an in-app token/coin system.

## Roles

- **Super Admin** → Full control over the entire system.
- **Admin** → High-level management with some restrictions.
- **Waste Manager** → Receives waste requests, manages collection, also earns rewards.
- **User** → Submits waste, earns rewards in tokens/coins, converts them into usable value.

## Core Tech Stack

- **Next.js (with TypeScript)** → API Routes, Server Actions, App Router.
- **tRPC** → Type-safe API layer.
- **Prisma** → ORM for database queries.
- **Better Auth + Resend** → ✅ Already implemented for authentication & emails.
- **pnpm** → Package manager.

## Step 1: Project Organization

Follow a modular structure to keep code maintainable.

Suggested folders under `/src`:

\`\`\`
/src
 ├── server
 │    ├── trpc         → tRPC router definitions
 │    ├── db           → Prisma client and helpers
 │    ├── services     → Business logic (rewards, waste processing)
 │    └── utils        → Shared utilities
 ├── app
 │    ├── api          → Next.js API routes
 │    └── actions      → Server actions
 └── types             → Shared TypeScript types
\`\`\`

## Step 2: Define Roles & Permissions

Create a role-based access system that plugs into your existing auth.

**Roles:** `SUPER_ADMIN`, `ADMIN`, `WASTE_MANAGER`, `USER`.

Permissions should be enforced inside tRPC middleware.

### Example design principle:

- **Super Admin** → Can manage roles, approve rewards, oversee all activity.
- **Admin** → Can manage waste categories, approve waste submissions, moderate users.
- **Waste Manager** → Gets notified of assigned waste collections, marks waste as disposed, earns tokens.
- **User** → Submits waste, earns tokens, redeems tokens.

## Step 3: Rewards & Token System

- **Token Model:** Users earn tokens when submitting valid waste.
- **Conversion System:** Tokens can be converted into money or in-app actions.
- **Waste Manager Rewards:** They earn for properly processing/disposing of assigned waste.

Business logic goes inside `/src/server/services/rewards.ts`.

### Design principle:

- On waste submission → Check type, validate, assign tokens.
- On waste approval/disposal → Tokens distributed to both user + waste manager.
- Provide API endpoints for checking balances, redeeming tokens, and transaction history.

## Step 4: tRPC Router Setup

Use tRPC as the main API layer for type-safe communication.

### Organize routers:

- **authRouter** → 🔒 Already handled (Better Auth). Only plug into session checks.
- **userRouter** → User profile, waste submissions, token balance.
- **wasteRouter** → Waste categories, submission handling, status tracking.
- **rewardRouter** → Token earnings, redemptions, transaction history.
- **adminRouter** → Admin tools (approve waste, manage users).
- **superAdminRouter** → Full control (manage admins, system configs).

## Step 5: Middleware & Access Control

Add tRPC middleware that checks:

- If a session exists (Better Auth).
- If the user has the correct role for the requested action.

### Example flow:

- User submits waste → must be `USER`.
- Waste Manager approves → must be `WASTE_MANAGER`.
- Admin moderates → must be `ADMIN`.
- Super Admin actions → restricted to `SUPER_ADMIN`.

## Step 6: Database Integration (Prisma)

Use Prisma for:

- Users & Roles (already linked with Better Auth).
- Waste submissions (type, status, assigned manager).
- Rewards (token transactions, balances, redemptions).
- Notifications (optional, e.g., waste assigned to manager).

Keep all business logic out of raw API routes → delegate to Prisma services.

## Step 7: Next.js Integration

- Use App Router + Server Actions for operations that directly affect UI (e.g., waste submission form).
- Use API Routes for external clients or background jobs.
- Expose tRPC handlers inside `/app/api/trpc/[trpc]`.
- Keep server-only logic (like token calculations) inside `/src/server/services`.

## Step 8: Notifications (Optional)

Use Resend (already installed) for system notifications.

### Examples:

- **Waste Manager** → "New waste assigned to you."
- **User** → "Your waste has been approved, you earned X tokens."
- **Admin** → "Pending waste submissions to review."

## Step 9: Testing Strategy

Write unit tests for reward calculation and role-based access.
Write integration tests for tRPC routers.

### Test edge cases:

- Invalid waste type.
- Insufficient role permissions.
- Double submission attempts.
- Token conversion limits.

## Step 10: Install Dependencies (Last Step)

Since you are using pnpm, install dependencies at the very end.

\`\`\`bash
# Backend essentials
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query

# Prisma ORM
pnpm add prisma @prisma/client

# Zod for input validation
pnpm add zod

# Types
pnpm add -D typescript ts-node @types/node

# Optional utilities
pnpm add date-fns
