# Recycly Build Phases

## Working Rules

- `PRD.md` is the strategic source of truth.
- `PHASES.md` is the tactical execution tracker.
- Track implementation reality, not planned intent.
- Every completed item must have repo evidence.
- A phase cannot be marked `Done` if any required implementation work under it is still unchecked.
- Docs are intentionally deferred while the main `apps/web` product surface is prioritized.
- The first screenshot-ready UI target is the recycler dashboard in `apps/web`.

## Status Key

- `Not started`
- `In progress`
- `Blocked`
- `Done`

## Phase 0: Repo Reset And Bootstrap

- Status: `Done`
- Objective: reset the repository to a clean planning-first baseline and prepare for the fresh rebuild.

### Checklist

- [x] Remove the legacy application code and outdated support files.
- [x] Preserve `PRD.md` and `PHASES.md` as the planning source of truth.
- [x] Keep the existing Git history intact.
- [x] Commit the planning-only reset baseline.

### Reality Check

- The legacy pre-rebuild app was cleared out before the fresh scaffold was introduced.
- The planning docs remained in place and continue to anchor the rebuild.

## Phase 1: Fresh App Foundation

- Status: `In progress`
- Objective: establish the new technical foundation for Recycly.

### Checklist

- [x] Initialize the Turborepo workspace with pnpm.
- [x] Create the `apps/web` Next.js app as the main product surface.
- [x] Keep `apps/docs` as a placeholder folder with a Fumadocs note.
- [x] Set up Biome and Ultracite at the workspace level.
- [x] Add the initial shadcn setup in `apps/web`.
- [x] Create the first screenshot-ready recycler dashboard shell in `apps/web`.
- [x] Define the first-pass design system direction with green primary tokens, warm neutrals, and a restrained accent.
- [x] Verify the current scaffold with `pnpm check`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- [ ] Add the Elysia.js backend app to the monorepo.
- [ ] Add WorkOS authentication foundations.
- [ ] Add environment variable templates and setup notes.
- [ ] Define and document the frontend-to-backend integration boundary.
- [ ] Establish shared package structure beyond the empty `packages` placeholder.

### Reality Check

- The repo contains a working root workspace, `apps/web`, and a placeholder `apps/docs`.
- There is no backend service, auth integration, or environment setup yet.
- The foundation exists, but the platform architecture is still incomplete.

## Phase 2: Data Model And RBAC Foundation

- Status: `Not started`
- Objective: define the business schema and core permissions model.

### Checklist

- [ ] Set up the Neon Postgres connection strategy.
- [ ] Add Drizzle configuration for application schema work.
- [ ] Model the four MVP roles: User, Collector, Staff, Super Admin.
- [ ] Define pickup, verification, rewards, support, and dispute states.
- [ ] Add backend authorization guards in the Elysia service layer.
- [ ] Add UploadThing foundations for proof uploads and attachments.

### Reality Check

- No backend app, schema, RBAC implementation, or upload flow exists yet.
- Provider choice is Neon Postgres so the backend can lean on serverless Postgres branching for safe schema work, previews, and operational environment isolation.

## Phase 3: User And Collector Workflows

- Status: `Not started`
- Objective: deliver the core pickup workflow from request creation to collector fulfillment.

### Checklist

- [ ] Build recycler onboarding and profile basics.
- [ ] Build pickup request creation.
- [ ] Add waste type, quantity, address, and scheduling inputs.
- [ ] Build recycler request history and pickup status tracking.
- [ ] Build collector availability and job queue views.
- [ ] Implement assignment and collector status updates.
- [ ] Add proof upload for completed pickups.
- [ ] Ensure workflow mutations run through the Elysia backend, not Next.js route handlers.

### Reality Check

- The current dashboard is a visual shell only and does not implement product workflows.

## Phase 4: Verification, Rewards, And Operations

- Status: `Not started`
- Objective: add the back-office workflows that make the product operationally real.

### Checklist

- [ ] Build staff verification, support, dispute, and redemption queues.
- [ ] Implement verification approval and rejection actions with reasons.
- [ ] Add points ledger logic and recycler balance views.
- [ ] Build reward catalog and redemption request flows.
- [ ] Build staff review for reward and cashout requests.
- [ ] Build Super Admin controls for access and reward rules.
- [ ] Add audit logging for sensitive actions.

### Reality Check

- No rewards engine, staff console, or admin controls exist yet.

## Phase 5: Marketing, Docs, And Launch Hardening

- Status: `Not started`
- Objective: complete the public-facing product experience and harden the app for early launch.

### Checklist

- [ ] Build the landing page using the approved design system and dashboard screenshots.
- [ ] Set up `apps/docs` with Fumadocs.
- [ ] Add trust, FAQ, and how-it-works content.
- [ ] Improve empty states, errors, loading states, and mobile responsiveness across product surfaces.
- [ ] Add notification flows for important user and staff events.
- [ ] Add reporting views for operational health and launch KPIs.
- [ ] Run final QA across recycler, collector, staff, and Super Admin journeys.

### Reality Check

- Landing, docs implementation, and launch-hardening work have not started.
