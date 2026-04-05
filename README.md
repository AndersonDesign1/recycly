# Recycly

Recycly is being rebuilt from scratch as a pickup-first recycling rewards platform for an initial Nigeria urban launch.

## Current State

This repository is now in a fresh rebuild phase. The legacy implementation has been removed from the active workspace so the new product can be built cleanly against the latest stack decisions.

## Core Documents

- [PRD.md](./PRD.md): product requirements and scope definition
- [PHASES.md](./PHASES.md): step-by-step build tracker and milestone plan

## Code Quality

- Biome and Ultracite are the only code-quality tools used in this repo.
- Run `pnpm lint` or `pnpm check` for read-only validation.
- Run `pnpm fix` to apply safe automated fixes.
- Generated Drizzle metadata under `drizzle/meta` is excluded from Biome checks.

## Intended Stack

- Monorepo architecture with separate apps/services
- Next.js App Router (frontend apps)
- Elysia.js (backend API service)
- TypeScript
- Clerk
- Postgres
- Drizzle
- UploadThing
- Zod
- Tailwind CSS

## Next Step

Begin with Phase 1 in [PHASES.md](./PHASES.md): finalize monorepo app boundaries (landing, dashboard, docs, backend), wire frontend/backend contracts, and establish auth architecture for the fresh build.
