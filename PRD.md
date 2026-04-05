# Recycly Product Requirements Document

## Document Status

- Product: Recycly
- Version: 1.0
- Status: Draft for implementation
- Last updated: 2026-04-05
- Product type: Production-style side project with real operational workflows

## Delivery Status Legend

- `Not started`
- `Ongoing`
- `Done`

## 1. Product Summary

Recycly is a pickup-first recycling rewards platform designed for an initial Nigeria urban launch. It helps people recycle major household waste categories correctly by letting them schedule waste pickups, track collection status, and earn points after successful verification.

The product is intended to feel like a real startup product, not a toy demo. That means the system must support role-based operations, verifiable collection workflows, support and dispute handling, and a rewards economy that can later support cashout and partner rewards.

This PRD is written for a fresh rebuild. The current repository is treated as prior exploration only. Legacy implementation choices are not constraints on the new build.

## 2. Vision

Build the most trusted consumer recycling platform for urban households in Nigeria by making proper waste disposal convenient, trackable, and financially rewarding.

## 3. Problem Statement

Many people are willing to recycle, but the process is inconvenient, inconsistent, and rarely rewarding. Existing waste systems often lack visibility, incentives, and dependable collection logistics. Users need a simple way to hand over recyclable waste correctly, know what happens next, and receive a clear benefit for participating.

At the same time, operators need better tools for assigning pickups, verifying collected waste, managing exceptions, and keeping incentives financially controlled.

## 4. Product Goals

### Primary goals

- Make recycling easy enough that users can complete a pickup request in minutes.
- Give users visible value through a points-based reward system.
- Enable collectors to receive and fulfill nearby pickup work efficiently.
- Give staff a clean operational console for verification, approvals, support, and disputes.
- Give Super Admin full oversight of people, permissions, reward rules, and escalations.

### Business goals

- Prove that a pickup-based recycling model can drive repeat engagement.
- Create a trustworthy operations flow with clear states and auditable decisions.
- Establish a platform foundation that can later expand into richer rewards, campaigns, and partnerships.

### User success goals

- Users understand what waste can be submitted.
- Users can schedule pickups without confusion.
- Users can see whether waste was collected, verified, rejected, or completed.
- Users can easily understand how points are earned and redeemed.

## 5. Non-Goals

The following are explicitly out of scope for MVP:

- Native mobile apps
- Multi-country launch planning
- Referral programs
- Community feeds or leaderboards
- Complex campaign engines
- Fully automated direct cash payouts without review
- Municipality or enterprise portals
- Advanced fraud detection systems beyond basic controls
- Deep partnership management workflows
- Astro framework usage for core product surfaces

## 6. Product Principles

- Keep MVP operationally realistic but intentionally narrow.
- Prefer simple workflows over broad feature coverage.
- Trust and clarity matter more than novelty.
- Every user-facing step must have a visible status.
- Staff approval should exist where financial or verification risk is meaningful.
- Any new feature after MVP must justify its effect on launch speed and operational complexity.

## 7. Target Market And Launch Context

### Initial launch market

- Geography: Nigeria
- Launch context: urban operations
- Initial launch cities (phase 1 operations): Benin City, Lagos, Abuja, Ibadan, and Port Harcourt

### Target users

- Households and individuals with recyclable waste at home
- Early environmentally conscious users
- Users motivated by convenience, rewards, or both

### Operational users

- Collectors handling nearby pickup requests
- Staff managing support, disputes, verification, and approvals
- Super Admin overseeing the platform

## 8. Core User Roles

### 8.1 User

The User is a household or individual recycler.

Responsibilities and capabilities:

- Sign up and access the app
- Schedule a waste pickup
- Select waste categories and add supporting details
- Track pickup progress
- View points earned and redemption history
- Raise support issues or disputes

### 8.2 Collector

The Collector is an operational field actor responsible for pickups.

Responsibilities and capabilities:

- Set availability and service coverage
- Receive nearby pickup opportunities
- Accept assigned work
- Update job status during fulfillment
- Submit collection proof

### 8.3 Staff

Staff is the main operational back-office role for MVP.

Responsibilities and capabilities:

- Review pickup submissions and supporting proof
- Verify or reject submissions
- Handle user support issues
- Review disputes
- Review redemption requests
- Monitor operational queues and exceptions

### 8.4 Super Admin

Super Admin has the highest authority on the platform.

Responsibilities and capabilities:

- Manage staff accounts and permissions
- Configure points and reward rules
- View top-level analytics and operational health
- Intervene in escalations and disputes
- Audit system activity and platform decisions

## 9. Core Product Experience

### Main product promise

Users can request a recycling pickup, hand over waste correctly, follow the process from request to verification, and earn points they can later redeem.

### Waste model

The system should support major waste categories from the start. The exact category list can evolve during implementation, but MVP should cover the main household recycling cases likely to matter in urban Nigeria.

Suggested launch categories:

- Plastic
- Paper
- Glass
- Metal
- Electronic waste
- Textile
- Organic waste where operationally feasible
- Mixed recyclable waste if needed as an operational fallback

## 10. MVP Scope

### 10.1 In scope

- Authentication and onboarding
- Role-based access control
- Pickup request creation
- Waste type selection
- Pickup scheduling
- Location capture
- Collector matching by location and availability
- Pickup lifecycle status tracking
- Collection proof upload
- Staff verification and rejection flow
- Points issuance after successful verification
- Rewards and cashout redemption request flow
- Support and dispute workflows
- Super Admin access management
- Reward rule management
- Public marketing pages
- Product documentation inside the main app

### 10.2 Out of scope

- Real-time GPS route tracking
- Dynamic pricing by neighborhood or market conditions
- Complex collector compensation systems
- Loyalty tiers beyond simple visible progression if added later
- Social features
- Multilingual support
- SMS-first communication
- Hardware or IoT bin integrations

## 11. End-To-End Workflow

### 11.1 User journey

1. User signs up or signs in.
2. User completes onboarding and profile basics.
3. User creates a pickup request.
4. User selects waste type, estimated quantity, preferred pickup window, and location.
5. System creates the request and makes it available for matching.
6. User sees request progress as it moves through statuses.
7. Collector fulfills the pickup and submits proof.
8. Staff verifies or rejects the submission.
9. If verified, user receives points.
10. User can later redeem points for rewards or a reviewed cashout option.

### 11.2 Collector journey

1. Collector becomes available for work.
2. System surfaces eligible nearby pickup jobs.
3. Collector accepts a job.
4. Collector updates the request through operational states.
5. Collector uploads required proof after collection.
6. Request moves into staff review.

### 11.3 Staff journey

1. Staff sees queues for pending verification, support, disputes, and redemption requests.
2. Staff reviews evidence and request data.
3. Staff verifies or rejects a collection.
4. Staff approves, rejects, or escalates redemption and dispute cases.
5. Staff escalates high-risk or exceptional cases to Super Admin.

### 11.4 Super Admin journey

1. Super Admin manages staff accounts and permissions.
2. Super Admin reviews top-level operational dashboards.
3. Super Admin updates reward configuration and system rules.
4. Super Admin resolves escalated exceptions and access issues.

## 12. Functional Requirements

### 12.1 Authentication and access

- Users must be able to authenticate with Clerk.
- The application must support role-based access to app areas.
- Role-restricted actions must be enforced at both UI and server layers.

### 12.2 Pickup requests

- Users must be able to create pickup requests from the dashboard.
- Each request must include at minimum:
  - waste type
  - estimated quantity or weight
  - pickup address or location
  - pickup window
  - optional notes
- Users must be able to view current and past requests.

### 12.3 Collector assignment

- The system must support matching collectors to nearby pickup requests.
- Collectors should only receive work in their service radius or assigned coverage area.
- A collector must be able to accept or ignore available jobs.

### 12.4 Pickup execution

- Collectors must be able to update pickup status.
- Collectors must be able to submit collection proof through UploadThing.
- The system must preserve an audit trail of key pickup events.

### 12.5 Verification

- Staff must be able to review completed pickups.
- Staff must be able to verify or reject a submission.
- Rejected submissions must include a reason.
- Verified submissions must trigger points issuance.

### 12.6 Points and rewards

- Users must have a visible points balance.
- Points must be granted only after verification.
- Users must be able to browse available redemption options.
- Users must be able to submit redemption requests.
- Staff must be able to approve or reject redemption requests.

### 12.7 Support and disputes

- Users must be able to raise support issues.
- Users must be able to dispute rejected or problematic pickups.
- Staff must be able to update support and dispute statuses.
- Super Admin must be able to resolve escalated cases.

### 12.8 Admin operations

- Super Admin must be able to create and manage Staff access.
- Super Admin must be able to configure reward settings and points logic.
- Super Admin must be able to view audit and operational activity.

### 12.9 Public product content

- The app must include a marketing-facing landing experience.
- The monorepo must include basic docs/help content as a dedicated docs surface.
- Docs should help users understand supported waste, pickup flow, rewards, and support.

## 13. Data Model Direction

The implementation should use Postgres with Drizzle. The PRD should define the core business entities clearly enough for schema design.

### Core entities

- `User`
- `CollectorProfile`
- `PickupRequest`
- `PickupItem` or `WasteSubmission`
- `WasteType`
- `VerificationRecord`
- `PointsLedger`
- `Reward`
- `RedemptionRequest`
- `SupportTicket`
- `Dispute`
- `Notification`

### Additional likely system entities

- `RoleAssignment`
- `AuditLog`
- `Attachment`
- `Address` or `LocationSnapshot`
- `RewardRule`

## 14. Status Models

### 14.1 Pickup request status

- `draft`
- `requested`
- `assigned`
- `accepted`
- `en_route`
- `collected`
- `verified`
- `rejected`
- `completed`
- `cancelled`

### 14.2 Redemption status

- `pending`
- `approved`
- `rejected`
- `fulfilled`

### 14.3 Support and dispute status

- `open`
- `in_review`
- `escalated`
- `resolved`
- `closed`

## 15. Reward System

### Reward model

Recycly uses a points-first economy in MVP.

- Users earn points only after staff verification.
- Points are the main visible unit in the user experience.
- Rewards and cashout should be modeled as redemption options, not as immediate automatic payouts.
- Staff review should remain part of financially sensitive redemption flows.

### Reward types

MVP may support:

- cashout request
- airtime or voucher style rewards
- partner reward concepts if easy to support operationally

### Reward controls

- Super Admin configures rules
- Staff approves or rejects requests where required
- System should keep a redemption history for users and operators

## 16. Notifications

MVP notifications should include:

- pickup request created
- collector assigned or request accepted
- status updates
- verification result
- points earned
- redemption status changes
- support or dispute updates

MVP channels:

- in-app notifications
- email notifications

Deferred channels:

- SMS
- push notifications

## 17. Non-Functional Requirements

### Performance

- Core dashboard pages should feel fast on common mobile and desktop connections.
- Users should be able to submit and review requests without noticeable lag under early-stage traffic.

### Trust and auditability

- Important decisions must be traceable.
- Financially sensitive actions must be reviewable.
- Key operational actions must have timestamps and actor attribution.

### Usability

- The product should work well on mobile browsers because many users will likely access it primarily on mobile.
- Status labels and reward messaging must be easy to understand.

### Scalability

- MVP architecture must not block later growth into more cities, more staff, or more reward types.
- Initial launch operations and reporting must support city-level filtering for Benin City, Lagos, Abuja, Ibadan, and Port Harcourt.

## 18. Recommended Technical Stack

Recycly should be rebuilt on a fresh stack using the latest stable versions at implementation time.

### Required stack decisions

- Frontend framework: Next.js App Router
- Backend framework: Elysia.js (TypeScript)
- Language: TypeScript
- Auth: Clerk
- Database: Postgres
- ORM: Drizzle
- Validation: Zod
- File uploads and object handling: UploadThing
- Styling: Tailwind-based design system

### Architecture decisions

- Monorepo architecture with separate apps/services for:
  - landing page frontend
  - dashboard frontend
  - docs frontend
  - Elysia.js backend API
- No Next.js API routes for business logic (API responsibilities belong to the Elysia backend service)
- Shared packages for domain types, validation schemas, UI primitives, and configuration where helpful
- Server-first data patterns where appropriate
- Background jobs used for notifications, assignment fanout, and redemption processing
- Map and geocoding provider kept abstract so vendors can change later

### Current recommendation notes

- PlanetScale officially launched Postgres to general availability on September 22, 2025.
- PlanetScale docs currently list Postgres 17 and 18 support.
- Clerk provides current Next.js App Router quickstart support.
- The current Next.js major upgrade guide is version 16, updated on February 27, 2026.

Reference links:

- PlanetScale Postgres GA: https://planetscale.com/changelog/postgres-ga
- PlanetScale supported Postgres versions: https://planetscale.com/docs/postgres/cluster-configuration/versions
- Clerk Next.js quickstart: https://clerk.com/docs/getting-started/quickstart
- Next.js version 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16

## 19. Information Architecture

### Public experience

- Landing page
- How it works
- Supported waste
- Rewards overview
- Trust and safety
- FAQ
- Contact
- Docs/help

### Authenticated app

- User dashboard (separate frontend app)
- Collector dashboard (separate frontend app or scoped dashboard module)
- Staff dashboard (separate frontend app or scoped dashboard module)
- Super Admin dashboard (separate frontend app or scoped dashboard module)
- Shared settings and profile area

### Backend API surface

- Elysia.js service exposes endpoints for auth-integrated user workflows, pickup lifecycle, verification, rewards, disputes, and admin operations.
- Frontend apps communicate with backend over HTTP APIs (or RPC-style wrappers), not Next.js inbuilt API routes.

## 20. MVP Acceptance Criteria

MVP is successful when all of the following are true:

- A new user can sign up, create a pickup request, and track it to resolution.
- An eligible collector can receive and accept nearby work.
- A collector can progress a request through valid states only.
- Staff can verify or reject a completed collection.
- Verified submissions issue points correctly.
- Users can create redemption requests and see status outcomes.
- Staff can manage support and disputes.
- Super Admin can manage Staff access and reward rules.
- Role-restricted areas are protected.
- UploadThing supports proof uploads and support attachments.

## 21. KPIs

### Launch KPIs

- pickup completion rate
- collector acceptance rate
- verification turnaround time
- redemption completion rate
- repeat usage rate
- support and dispute resolution time

### Secondary KPIs

- percentage of verified vs rejected pickups
- average time from request creation to collection
- points redemption rate
- number of active collectors by zone

## 22. Risks And Mitigations

### Risk: feature creep

Mitigation:

- keep MVP scope fixed
- treat roadmap items as deferred by default
- require explicit approval before adding post-MVP features into the active build

### Risk: weak verification quality

Mitigation:

- require proof uploads
- preserve staff review
- record rejection reasons and audit events

### Risk: operational mismatch in early launch

Mitigation:

- keep collector matching simple
- start with one city assumption
- abstract map vendor decisions

### Risk: payout complexity

Mitigation:

- keep economy points-first
- use redemption request review instead of instant payouts

## 23. Rollout Phases

### Phase 0: foundation

- Status: `Done`

- finalize PRD
- define information architecture
- set up fresh codebase
- configure Clerk
- define Drizzle schema
- set up UploadThing
- establish role model and route structure

### Phase 1: MVP delivery

- Status: `Ongoing`

- build user pickup flow
- build collector job handling
- build staff verification flow
- build points ledger
- build redemption requests
- build support and disputes
- build Super Admin controls for staff access and reward rules

### Phase 1.1: hardening

- Status: `Not started`

- add audit logs
- improve operational reporting
- harden notifications
- improve queue management and filtering
- add better performance and exception handling

### Phase 2: growth

- Status: `Not started`

- add campaigns and bonus systems
- add referrals
- deepen educational and docs content
- improve fraud prevention
- expand reward ecosystem
- explore partnerships and growth initiatives

## 24. Implementation Defaults

- Product name must be written as `Recycly`.
- This is a full rebuild, not a migration.
- MVP launch context is Lagos-first within Nigeria urban operations.
- Staff absorbs admin-like operational duties for MVP.
- Rewards are points-first, with reviewed redemption.
- UploadThing is the default upload and object handling solution.
- The build should use the latest stable versions of core tools at implementation time.

## 25. Open Decisions For Implementation Planning

These do not block the PRD but will need follow-up before coding:

- exact waste category list for MVP
- pickup scheduling rules and time-slot model
- collector coverage radius logic
- exact points calculation formula
- reward catalog design
- whether cashout starts in MVP or Phase 1.1
- map/geocoding vendor selection
- email provider choice
- queue/job infrastructure choice
