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
| 3 | Configurable section registry and portfolio renderer | Completed |
| 4 | Data-driven navigation, footer, metadata, and resume | Completed |
| 5 | Public/client boundary cleanup and reusable preview rendering | Completed |
| 6 | Theme-token boundary and shared presentation primitives | Completed |
| 7 | Contact action hardening | Completed |
| 8 | Dead-code cleanup, documentation, and full regression checks | Completed |
| 9 | React Hook Form and shared Zod contact validation | Completed |

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

## Step 3 — Configurable section registry and portfolio renderer

### Why

Although Step 2 introduced a configurable snapshot, the home page still listed every section
manually. Dashboard ordering and visibility cannot work until rendering follows the snapshot
rather than source-code order.

### Changes

- Added a pure helper that filters disabled sections and sorts enabled sections by position.
- Added an exhaustive section registry for every published section discriminator.
- Added `PortfolioRenderer` as the shared public/preview rendering entry point.
- Changed section components to accept their stable snapshot section ID while retaining their
  existing ID as a default.
- Replaced list-level index keys with published item IDs where stable entities are available.
- Changed the home page to render the snapshot through `PortfolioRenderer`.
- Added coverage for ordering, visibility, and registry completeness.

### Files

- `components/portfolio/portfolio-renderer.tsx`
- `components/portfolio/section-registry.tsx`
- `components/portfolio/section-registry.test.ts`
- `components/sections/*.tsx`
- `lib/portfolio/rendering.ts`
- `lib/portfolio/rendering.test.ts`
- `lib/portfolio/schemas.ts`
- `lib/data/local-content-adapter.ts`
- `app/page.tsx`

### Verification

- `pnpm test` — 17 tests passed across four suites.
- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — production build and static generation passed with registry rendering.

### Decisions

- The registry is exhaustive at compile time and also has a completeness test. Adding a new
  published section kind therefore requires an explicit renderer.
- Filtering and sorting are pure domain logic, independent of React, so they can be reused by
  public pages and authenticated previews.
- Snapshot section IDs are also DOM anchor IDs. This supports repeated/reordered dashboard
  sections without hard-coded anchors in the renderer.

### Deferred

- Header and footer navigation still use fixed links until Step 4.
- Client-component and animation boundary refinement remains Step 5.

## Step 4 — Data-driven portfolio shell and public routes

### Why

The section renderer followed snapshot configuration, but the header, footer, personal
identity, resume actions, and page metadata still contained assumptions for one portfolio.
Those shell elements must change with the selected published portfolio as well.

### Changes

- Moved display name, logo, social links, and resume information into snapshot identity data.
- Removed the duplicated global identity fields from published hero-section content.
- Derived navigation links and active-section IDs from ordered enabled sections.
- Made header and footer navigation, social links, copyright, logo, and resume actions consume
  snapshot data.
- Added a shared `PublishedPortfolioPage` composition for default, slug, and future preview
  routes.
- Generated title, description, canonical, Open Graph, and Twitter metadata from the snapshot.
- Added the statically generated `/p/[slug]` public portfolio route with runtime slug
  validation and 404 handling.
- Added navigation and metadata tests.

### Files

- `app/layout.tsx`
- `app/page.tsx`
- `app/p/[slug]/page.tsx`
- `components/layout/header.tsx`
- `components/layout/navbar.tsx`
- `components/layout/footer.tsx`
- `components/portfolio/published-portfolio-page.tsx`
- `components/portfolio/section-registry.tsx`
- `components/sections/hero.tsx`
- `lib/data/local-content-adapter.ts`
- `lib/data/published-portfolios.ts`
- `lib/portfolio/metadata.ts`
- `lib/portfolio/metadata.test.ts`
- `lib/portfolio/rendering.ts`
- `lib/portfolio/rendering.test.ts`
- `lib/portfolio/schemas.ts`

### Verification

- `pnpm test` — 19 tests passed across five suites.
- `pnpm typecheck` — passed after correcting registry call arity.
- `pnpm lint` — passed.
- `pnpm build` — passed; `/` is static and `/p/full-stack` is generated as SSG output.

### Decisions

- The default `/` route and `/p/full-stack` use the same rendering component and snapshot.
- Dynamic route params are awaited as required by Next.js 16 and known slugs are supplied by
  `generateStaticParams` for build-time generation.
- `NEXT_PUBLIC_SITE_URL` can set the metadata base; the current production URL is the fallback.

### Deferred

- The data source still exposes one local published portfolio. Supabase will replace the data
  adapter after authentication, migrations, and RLS are established.
- Dashboard/preview shell differences remain Step 5.

## Step 5 — Public Client Component boundary cleanup

### Why

The shared renderer was ready for public and preview routes, but complete Contact and
Experience sections were Client Components even though most of their markup was static. The
header also registered two independent listeners for the same scroll event.

### Changes

- Split the interactive contact form from the server-rendered contact section.
- Gave contact fields section-scoped IDs so repeated contact sections do not duplicate label
  targets.
- Added an accessible live status region for contact submission feedback.
- Split the animated experience timeline from the server-rendered experience heading and
  section shell.
- Consolidated header scroll state and progress into one request-animation-frame listener.
- Memoized navigation so progress updates do not rerender the entire navigation tree.
- Retained `PublishedPortfolioPage` and `PortfolioRenderer` as the shared composition and
  canvas boundaries future authenticated previews will consume.

### Files

- `components/sections/contact.tsx`
- `components/sections/contact-form.tsx`
- `components/sections/experience.tsx`
- `components/sections/experience-timeline.tsx`
- `components/layout/header.tsx`
- `components/layout/navbar.tsx`
- `hooks/useHeaderScroll.ts`
- Removed `hooks/useScrollProgress.ts`
- Removed `hooks/useScrolledY.ts`

### Verification

- `pnpm test` — 19 tests passed.
- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed with both public routes prerendered.

### Decisions

- Interactive islands receive fully validated serializable snapshot props from Server
  Components; they do not fetch portfolio content themselves.
- Section reveal behavior remains in the small shared `Section` client wrapper for now. It
  does not pull section content modules into the client graph because content is passed as
  rendered children.

### Deferred

- Authenticated preview routing belongs to the dashboard authentication phase. This refactor
  establishes the shared renderer it will call without exposing draft data publicly.

## Step 6 — Scoped theme tokens and presentation primitives

### Why

Theme data was validated in the published snapshot but not applied to rendering. In addition,
three section headers repeated the same presentation markup, making future theme changes easy
to apply inconsistently.

### Changes

- Expanded the explicit theme contract to cover every current semantic color rather than
  storing arbitrary CSS.
- Added a pure mapper from validated theme tokens to scoped CSS variables, font, radius, and
  density values.
- Applied each portfolio theme at the shared published-page boundary.
- Made section and content spacing consume density variables while preserving the current
  comfortable values.
- Added a minimal-motion preset in addition to the existing operating-system reduced-motion
  protection.
- Replaced remaining hard-coded accent colors in components with semantic theme variables.
- Added a shared `SectionHeading` presentation primitive for Experience, Projects, and
  Contact.
- Added theme-mapping tests.

### Files

- `lib/portfolio/schemas.ts`
- `lib/portfolio/theme.ts`
- `lib/portfolio/theme.test.ts`
- `lib/data/local-content-adapter.ts`
- `components/portfolio/published-portfolio-page.tsx`
- `components/app/section.tsx`
- `components/app/section-content.tsx`
- `components/app/section-heading.tsx`
- `components/sections/about.tsx`
- `components/sections/contact.tsx`
- `components/sections/experience.tsx`
- `components/sections/experience-timeline.tsx`
- `components/sections/hero.tsx`
- `components/sections/projects.tsx`
- `app/globals.css`

### Verification

- `pnpm test` — 20 tests passed across six suites.
- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed with scoped theme variables compiled by Tailwind.

### Decisions

- Theme values are an allowlisted schema of semantic tokens and presets. Snapshots cannot
  contain arbitrary CSS.
- Themes are scoped to the portfolio wrapper, which prevents future dashboard styles from
  inheriting portfolio appearance settings.
- The local theme uses the exact current colors and comfortable spacing to avoid a visual
  redesign during this architectural step.

### Deferred

- Dashboard controls, contrast warnings, and preset selection belong to the appearance-editor
  phase. This step only establishes the validated rendering contract.

## Step 7 — Contact mutation hardening

### Why

Server Actions are public mutation endpoints. The original action manually trimmed expected
strings, had no maximum lengths or request timeout, logged provider response bodies, and had
no application-level abuse bound.

### Changes

- Added a strict Zod input schema with trimming, email normalization, and field-size limits.
- Added validated EmailJS environment configuration.
- Moved provider delivery into a focused adapter with a 10-second abort timeout.
- Stopped logging provider response bodies that may contain unnecessary details.
- Added a bounded in-memory rate limiter keyed by a hash of the forwarded client address.
- Preserved the honeypot behavior without disclosing bot detection.
- Made the client form recover from unexpected Server Action failures without remaining in a
  loading state.
- Added input-normalization, invalid-direct-call, and rate-window tests.

### Files

- `lib/actions/contact.ts`
- `lib/contact/schemas.ts`
- `lib/contact/emailjs.ts`
- `lib/contact/rate-limit.ts`
- `lib/contact/contact.test.ts`
- `components/sections/contact-form.tsx`

### Verification

- `pnpm test` — 23 tests passed across seven suites.
- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed with the hardened Server Action in the production bundle.

### Decisions

- The in-memory limiter is a bounded defense-in-depth control, not a distributed guarantee.
  Production hosting/WAF rate limiting should still be enabled when the dashboard is deployed.
- Raw client addresses are not stored in the limiter; only a one-way SHA-256 key is retained.
- The browser receives intentionally generic delivery failures while server logs retain only
  provider status or error class.

### Deferred

- Contact submission persistence and an admin inbox remain outside the dashboard MVP.
- A distributed rate-limit store can replace the local limiter if traffic or abuse warrants it.

## Step 8 — Cleanup, documentation, and final regression

### Why

The original repository retained an unused build-version polling feature, a dynamic API route,
Git-dependent configuration evaluation, stale structure documentation, and a component export
that was only present inside commented code. Production builds also downloaded Geist from
Google at build time.

### Changes

- Replaced `next/font/google` with the official local `geist` package.
- Removed the unused app-version hook, `/api/version` route, public build-ID environment value,
  and Git command from `next.config.ts`.
- Removed the unused animated button variant and renamed the remaining component around its
  actual link responsibility.
- Removed the commented Projects CTA implementation while retaining its validated content
  field for future dashboard use.
- Made `typecheck` regenerate Next.js route definitions before running TypeScript, preventing
  stale generated references after route changes.
- Added a guarded pre-typecheck cleanup for `.next/dev/types`, an ephemeral development-server
  cache that can retain deleted routes. Next's required TypeScript includes remain unchanged.
- Rewrote the README around the current snapshot architecture, routes, environment, quality
  commands, and dashboard documentation.
- Updated the dashboard migration plan to start from the completed validation, snapshot,
  adapter, and renderer foundation.

### Files

- `app/layout.tsx`
- Removed `app/api/version/route.ts`
- Removed `hooks/useAppVersion.ts`
- `next.config.ts`
- `components/ui/animated-border-link.tsx`
- Removed `components/ui/animated-border-button.tsx`
- `components/sections/hero.tsx`
- `components/sections/projects.tsx`
- `README.md`
- `docs/DASHBOARD_PLAN.md`
- `package.json`
- `pnpm-lock.yaml`
- `scripts/clear-stale-next-dev-types.mjs`

### Verification

- `pnpm test` — 23 tests passed across seven suites.
- `pnpm typecheck` — regenerated Next route types and passed TypeScript.
- `pnpm lint` — passed.
- `pnpm build` — passed inside the restricted sandbox without font network access.
- Production smoke test — `/` and `/p/full-stack` both returned HTTP 200, the expected
  portfolio title, `#main-content`, and the configured Contact section.

### Deferred

- Supabase dependencies, migrations, OAuth, RLS, Storage policies, and dashboard routes begin
  only after this refactor branch is reviewed.

## Step 9 — React Hook Form and shared Zod contact validation

### Why

The contact form maintained each field, loading state, and submission error manually while the
Server Action owned the only structured validation. Dashboard forms will need predictable field
state and validation without maintaining separate browser and server rules.

### Changes

- Added React Hook Form and the official Hook Form Zod resolver.
- Connected the contact form directly to the existing contact Zod schema.
- Separated the schema's raw input and normalized output types so the form and Server Action
  have an explicit shared boundary.
- Added user-facing Zod messages for required, malformed, and oversized fields.
- Replaced manual field and loading state with `register`, `handleSubmit`, `isSubmitting`,
  `reset`, and root submission errors.
- Added inline, accessible field feedback with `aria-invalid`, `aria-describedby`, and alert
  semantics while preserving the existing success feedback and honeypot.
- Kept the Server Action's schema parse as the authoritative security boundary for direct or
  forged calls.

### Files

- `components/sections/contact-form.tsx`
- `lib/contact/schemas.ts`
- `lib/actions/contact.ts`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`

### Verification

- `pnpm test` — 23 tests passed across seven suites.
- `pnpm typecheck` — regenerated Next route types and passed TypeScript.
- `pnpm lint` — passed.
- `pnpm build` — passed, including static generation for `/` and `/p/full-stack`.

### Decisions

- The same Zod schema is used by the resolver and parsed again in the Server Action. Client
  validation improves feedback but is never trusted as the security boundary.
- Native browser validation is disabled for this form so every field receives consistent Zod
  messages and accessible error markup.
- The form validates fields on blur and validates the full payload on submit, balancing timely
  feedback with a low-noise typing experience.

### Deferred

- A shared dashboard form-field component should be extracted after the first dashboard form
  reveals the reusable API; extracting it from a single form now would be speculative.
