# Recycly Build Phases

## Working Rules

- `PRD.md` is the strategic source of truth.
- `PHASES.md` is the tactical execution tracker.
- Stay inside MVP scope unless the PRD is explicitly updated first.
- Complete phases in order unless a dependency-free task is clearly safe to parallelize.
- Mark progress by updating status labels, not by adding ad hoc notes everywhere.
- Do not introduce new stack decisions unless they support the PRD direction: Next.js (frontend), Elysia.js (backend), WorkOS, Postgres, Drizzle, UploadThing, Zod, Tailwind.

## Status Key

- `Not started`
- `In progress`
- `Blocked`
- `Done`

## Phase 0: Repo Reset And Bootstrap

- Status: `Done`
- Objective: reset the repository to a clean planning-first baseline and prepare for the fresh rebuild.
- Completion target: repo contains only core config files plus planning docs needed to start implementation.
- Prerequisites: approved PRD.

### Checklist

- Remove legacy app code and outdated supporting docs.
- Keep base config files that are still useful for bootstrapping.
- Create `PRD.md` as the product source of truth.
- Create `PHASES.md` as the execution tracker.
- Replace the repo `README.md` with a rebuild-oriented entry point.

### Definition Of Done

- Legacy directories are removed from the active repo.
- The repo clearly reads as a fresh rebuild workspace.
- Product and execution docs exist and are easy to find.

### Risks / Blockers

- Hidden legacy assumptions may survive in config or dependency files.
- Old package metadata may need cleanup in the next phase.

## Phase 1: Fresh App Foundation

- Status: `Done`
- Objective: establish the new technical foundation for Recycly.
- Completion target: a runnable monorepo foundation exists with frontend app surfaces and an Elysia.js backend service scaffold.
- Prerequisites: Phase 0 done.

### Checklist

- Refresh `package.json` for the new stack and remove legacy dependencies.
- Scaffold monorepo app/service layout (landing, dashboard, docs, backend).
- Scaffold Next.js App Router structure for frontend surfaces.
- Scaffold Elysia.js API service.
- Set up TypeScript, Tailwind, and base linting conventions.
- Integrate WorkOS authentication.
- Establish frontend app boundaries for public, dashboard, and docs surfaces.
- Define frontend-to-backend API integration boundary.
- Define the initial design system direction and layout shell.
- Add environment variable templates and setup notes for the new stack.

### Definition Of Done

- Frontend apps and backend API service run locally in the monorepo.
- Public, dashboard, and docs surfaces are clearly separated.
- WorkOS is wired and ready for role-based access work.
- The codebase no longer reflects the deleted legacy architecture.
- Validation complete: `pnpm check`, `pnpm typecheck`, and `pnpm build` all pass.

### Risks / Blockers

- Dependency conflicts from retained config files.
- WorkOS integration details may affect route structure early.

## Phase 2: Data Model And RBAC Foundation

- Status: `Done`
- Objective: define the business schema and core permissions model.
- Completion target: Drizzle schema and role model support the MVP entities and access patterns.
- Prerequisites: Phase 1 done.

### Checklist

- Set up Postgres connection strategy.
- Add Drizzle and define the initial schema for core entities.
- Model the four MVP roles: User, Collector, Staff, Super Admin.
- Define pickup, verification, redemption, support, and dispute status models.
- Add backend authorization guards and role checks in Elysia middleware and service layer.
- Add UploadThing foundations for proof uploads and attachments.

### Definition Of Done

- Core tables/entities are represented in Drizzle.
- Role-restricted access rules are enforceable at backend API and frontend route access layers.
- UploadThing is ready for operational file flows.
- Validation complete: `pnpm db:generate`, `pnpm check`, `pnpm typecheck`, and `pnpm build` all pass.

### Risks / Blockers

- Schema over-design could slow MVP delivery.
- Role and workflow assumptions may need one more pass before coding business features.

## Phase 3: User And Collector Workflows

- Status: `Done`
- Objective: deliver the core pickup workflow from request creation to collector fulfillment.
- Completion target: users can create pickups and collectors can receive and work assigned jobs.
- Prerequisites: Phase 2 done.

### Checklist

- Build user onboarding and profile basics.
- Build pickup request creation flow.
- Add waste type, quantity, location, and scheduling inputs.
- Build user request history and status tracking.
- Build collector availability and job queue views.
- Implement location-based assignment logic.
- Add collector job acceptance and status updates.
- Add proof upload flow for completed pickups.
- Ensure all workflow mutations are executed through Elysia backend endpoints (no Next.js API routes).

### Definition Of Done

- A user can create and track a pickup request.
- An eligible collector can see, accept, and progress a nearby job.
- Pickup states update correctly through the operational flow.
- Validation complete: `pnpm check`, `pnpm typecheck`, and `pnpm build` all pass.

### Risks / Blockers

- Matching logic can balloon in complexity if not kept simple.
- Scheduling rules may need a constrained v1 shape to stay shippable.

## Phase 4: Verification, Rewards, And Operations

- Status: `Done`
- Objective: add the back-office workflows that make the product operationally real.
- Completion target: staff can verify pickups, issue points, and manage redemptions and exceptions.
- Prerequisites: Phase 3 done.

### Checklist

- Build Staff dashboard queues for verification, support, disputes, and redemptions.
- Implement verification and rejection actions with required reasons.
- Add points ledger logic and user balance views.
- Build reward catalog and redemption request flows.
- Build Staff review for reward and cashout requests.
- Build Super Admin controls for staff access and reward rules.
- Add basic audit logging for sensitive actions.

### Definition Of Done

- Verified pickups issue points correctly.
- Users can submit redemption requests and see statuses.
- Staff can process operational queues.
- Super Admin can manage access and key reward settings.
- Validation complete: `pnpm check`, `pnpm typecheck`, and `pnpm build` all pass.

### Risks / Blockers

- Reward logic can become a finance system if left unconstrained.
- Audit requirements may expand once real approval flows are in place.

## Phase 5: Marketing, Docs, And Launch Hardening

- Status: `In progress`
- Objective: complete the public-facing product experience and harden the app for early launch.
- Completion target: Recycly has a coherent landing experience, usable docs, and enough polish for a realistic MVP release.
- Prerequisites: Phase 4 done.

### Checklist

- Build the landing page and core public marketing sections.
- Add docs/help content in a separate docs app within the monorepo.
- Add trust, FAQ, and how-it-works pages.
- Improve empty states, errors, loading states, and mobile responsiveness.
- Add notification flows for important user and staff events.
- Add reporting views for operational health and launch KPIs.
- Run final QA across user, collector, staff, and Super Admin journeys.

### Definition Of Done

- Public and authenticated experiences both feel intentional and coherent.
- Monorepo app separation (landing, dashboard, docs, backend) is production-ready and documented.
- Core help and docs content exists.
- MVP acceptance criteria from the PRD can be validated end to end.

### Risks / Blockers

- Marketing and app polish can quietly become a second product.
- Launch hardening may expose gaps in earlier phases that require focused cleanup.
