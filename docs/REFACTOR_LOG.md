# Dashboard-readiness refactor log

Branch: `codex/refactor`

Goal: prepare the public portfolio for the planned multi-portfolio dashboard without
changing its current appearance or starting dashboard UI work prematurely.

## Working agreement

Every step records:

- why the change is needed;
- the important implementation decisions;
- the files changed;
- how the step was verified;
- any intentionally deferred work.

## Progress

| Step | Scope | Status |
| --- | --- | --- |
| 1 | Runtime content schemas and schema tests | Completed |
| 2 | Canonical published portfolio snapshot and local adapter | Completed |
| 3 | Configurable section registry and portfolio renderer | Planned |
| 4 | Data-driven navigation, footer, metadata, and resume | Planned |
| 5 | Public/client boundary cleanup and reusable preview rendering | Planned |
| 6 | Theme-token boundary and shared presentation primitives | Planned |
| 7 | Contact action hardening | Planned |
| 8 | Dead-code cleanup, documentation, and full regression checks | Planned |

## Step 1 — Runtime content schemas and schema tests

### Why

The original JSON loaders used TypeScript assertions. Assertions only affect compile-time
types; malformed JSON could still reach rendering components at runtime. The dashboard will
accept persisted user input, so runtime validation must be the source of truth before a
database is introduced.

### Changes

- Added Zod as a direct runtime dependency.
- Added strict schemas for every existing content file.
- Added safe link and asset URL rules to reject unsupported protocols.
- Derived the existing TypeScript content types from the schemas, avoiding two independent
  definitions that could drift apart.
- Replaced loader assertions with validation that reports the failing content source.
- Added Vitest and schema coverage for all current JSON plus representative invalid data.

### Files

- `lib/content/schemas.ts`
- `lib/content/types.ts`
- `lib/content/loaders.ts`
- `lib/content/schemas.test.ts`
- `package.json`
- `pnpm-lock.yaml`

### Verification

- `pnpm test` — 10 tests passed.
- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — production build and static generation passed.

### Deferred

Stable entity IDs, section discriminators, and the published snapshot belong to Step 2.
This step validates the current content shape without forcing the new storage model into the
existing UI.

## Step 2 — Canonical published snapshot and local adapter

### Why

The public page previously loaded each JSON file independently and decided the section order
itself. A multi-portfolio dashboard needs one stable public contract that can be produced by
local seed content today and immutable database versions later.

### Changes

- Added a versioned `PublishedPortfolioSnapshot` schema.
- Added discriminated section schemas with stable section and item IDs.
- Added validated SEO and theme data to the published contract.
- Added duplicate section-ID and position checks.
- Added a local adapter that resolves the existing JSON into the published contract.
- Added a server-only published-portfolio data-access module.
- Changed the home page to consume the snapshot while preserving the current explicit
  section rendering. The generic renderer remains Step 3.
- Added snapshot and section-narrowing tests.

### Files

- `lib/portfolio/schemas.ts`
- `lib/portfolio/sections.ts`
- `lib/portfolio/snapshot.test.ts`
- `lib/data/local-content-adapter.ts`
- `lib/data/published-portfolios.ts`
- `app/page.tsx`
- `vitest.config.mts`

### Verification

- `pnpm test` — 14 tests passed across content and snapshot suites.
- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — production build and static generation passed through the snapshot data path.

### Decisions

- Published snapshots are renderer-facing, validated, and versioned. The future normalized
  draft tables may differ internally.
- Technologies remain resolved into the hero section because that matches the current public
  design. They can still originate from shared content entries in the future database.
- Local semantic IDs are deterministic seed IDs. Database-backed content will use persisted
  IDs rather than regenerating them from labels.

### Deferred

- Section iteration and the renderer registry are Step 3.
- Global identity extraction and metadata generation are Step 4.
- Applying theme tokens to CSS variables is Step 6.
