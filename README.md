# Recycly

Fresh Turborepo workspace for the Recycly rebuild.

## Workspace

- `apps/web`: main Next.js application
- `apps/api`: Elysia backend API
- `apps/docs`: docs/help app placeholder (Fumadocs planned)
- `packages/config`: shared environment helpers
- `packages/contracts`: shared API contracts and domain enums
- `PRD.md`: product requirements
- `PHASES.md`: execution tracker

## Tooling

- Turborepo
- Bun workspaces
- Next.js App Router
- Elysia
- Biome
- Ultracite
- Drizzle ORM
- Neon Postgres

## Commands

```sh
bun install
bun run dev
bun run lint
bun run typecheck
bun run build
bun run test
bun run check
bun run fix
```

## Notes

- Root scripts delegate to `turbo run ...`.
- Package-level scripts own the actual `build`, `dev`, `lint`, and `typecheck` work.
- Biome configuration is centralized at the repo root through `ultracite`.
- `apps/web` owns WorkOS authentication UX and forwards trusted auth context to `apps/api`.
- `apps/api` owns business logic, validation, RBAC, and database access.
- WorkOS AuthKit expects `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD`, and `NEXT_PUBLIC_WORKOS_REDIRECT_URI` (default local callback: `http://localhost:3000/auth/callback`).
