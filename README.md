# Recycly

Fresh Turborepo workspace for the Recycly rebuild.

## Workspace

- `apps/web`: main Next.js application
- `apps/docs`: docs/help Next.js application
- `PRD.md`: product requirements
- `PHASES.md`: execution tracker

## Tooling

- Turborepo
- pnpm workspaces
- Next.js App Router
- Biome
- Ultracite

## Commands

```sh
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm check
pnpm fix
```

## Notes

- Root scripts delegate to `turbo run ...`.
- Package-level scripts own the actual `build`, `dev`, `lint`, and `typecheck` work.
- Biome configuration is centralized at the repo root through `ultracite`.
