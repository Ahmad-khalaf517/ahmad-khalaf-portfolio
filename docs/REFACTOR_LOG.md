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
| 2 | Canonical published portfolio snapshot and local adapter | Planned |
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
