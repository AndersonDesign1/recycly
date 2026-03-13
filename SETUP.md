# Recycly Phase 1 Setup

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- Clerk account
- Postgres database
- UploadThing app and token

## Install

```bash
pnpm install
```

## Environment

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_SIGN_IN_URL`
- `CLERK_SIGN_UP_URL`
- `DATABASE_URL`
- `UPLOADTHING_TOKEN`

## Run The App

```bash
pnpm dev
```

## Database Commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```

## Current Phase 1 Deliverables

- Fresh Next.js 16 App Router shell
- Clerk-authenticated route foundation
- Public, app, and docs route groups
- Tailwind v4 design foundation
- Initial Drizzle configuration

## Next Phase

Move to Phase 2 in `PHASES.md` to define the business schema, RBAC model, and UploadThing operational flows.
