# Multi-Portfolio Dashboard — Architecture and Implementation Plan

Status: **planned, not started**

This document replaces the original single-portfolio dashboard plan. The target is now an
authenticated content platform capable of managing multiple role-specific portfolios,
shared content, portfolio-specific overrides, appearance settings, assets, and resumes.

## 1. Product vision

Build an authenticated dashboard inside this Next.js application where Ahmad can:

- Create multiple portfolios, such as Frontend, Backend, and Full Stack.
- Give each portfolio a shareable URL and portfolio-specific SEO metadata.
- Reorder, enable, disable, and configure sections independently.
- Reuse the same content across several portfolios.
- Override selected fields for one portfolio without duplicating the original content.
- Manage projects, experience, skills, profile information, and contact content.
- Upload profile photos, project screenshots, logos, and resume files.
- Customize validated theme and animation settings.
- Preview changes without modifying the live portfolio.
- Publish an immutable version and roll back to an earlier version.
- Assign different resumes to different portfolios or share one resume between them.
- Eventually build structured resumes from the same shared content library.

This is more than an admin page. It is a small portfolio CMS, composition system, asset
manager, publishing platform, and resume builder.

## 2. Architectural decisions

### 2.1 Keep everything in the current Next.js application

Use route groups to keep the public website and dashboard separated while sharing types,
validation, rendering components, and data-access code.

Suggested high-level structure:

```text
app/
├── (public)/
│   ├── page.tsx
│   └── p/[slug]/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── auth/callback/route.ts
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── portfolios/
│   ├── content/
│   ├── assets/
│   └── resumes/
├── preview/[portfolioId]/page.tsx
└── api/
```

The public site remains mostly Server Components. Client Components should be limited to
interactive behavior. This prevents the dashboard from increasing the public portfolio's
JavaScript bundle.

### 2.2 Use Supabase as the backend platform

Use:

- Supabase Postgres for structured data.
- Supabase Auth for Google authentication.
- Supabase Storage for images and resume files.
- Supabase Row Level Security for database and storage authorization.
- Supabase CLI SQL migrations as the source of truth for schema changes.
- Generated Supabase TypeScript database types.

Do not add Prisma for the first version. Supabase's client, generated database types, SQL
migrations, and RLS are enough for this application's query complexity. Avoiding an ORM
reduces duplicated configuration and keeps authenticated queries aligned with RLS. An ORM
can be reconsidered later if reporting or complex server-only queries justify it.

### 2.3 Use Google OAuth, not a custom password system

Authentication flow:

1. User selects **Continue with Google**.
2. Supabase Auth completes the OAuth/PKCE flow.
3. The callback exchanges the authorization code for a Supabase session.
4. The application checks the authenticated user against `admin_users`.
5. Unauthorized Google accounts are signed out and denied access.
6. The approved account is redirected to `/dashboard`.

Google authentication proves identity, but it does not grant dashboard authorization by
itself. Authorization must come from the database allowlist and RLS policies.

Use `@supabase/ssr` for cookie-based sessions. In Next.js 16, use `proxy.ts` for session
refresh and optimistic redirects. Proxy is not the security boundary: every Server Action,
Route Handler, and data mutation must verify the user again, while RLS remains the final
database-level protection.

Never expose the Supabase service-role key to browser code.

### 2.4 Use a hybrid relational and JSONB content model

Fully normalized tables for every field would create a large, rigid schema. One JSON file
per portfolio would make sharing and overrides difficult. Use a hybrid model instead:

- Relational tables for ownership, portfolios, ordering, relationships, publication,
  assets, and versions.
- Validated JSONB payloads for content whose fields differ by content type.
- Zod discriminated unions and `schema_version` for runtime validation and migrations.

### 2.5 Use draft, preview, and publish

Dashboard edits must never change the live portfolio immediately.

The workflow is:

```text
Edit draft → Validate → Preview → Publish snapshot → Live portfolio
                                      ↓
                               Version history
                                      ↓
                                  Rollback
```

Publishing resolves shared content and overrides into an immutable JSON snapshot. The
public page reads that snapshot instead of assembling many database relationships on every
request. This improves stability, cacheability, performance, and rollback behavior.

## 3. Recommended routes

```text
/                              Default published portfolio
/p/frontend                    Frontend portfolio
/p/backend                     Backend portfolio
/p/full-stack                  Full-stack portfolio
/login                         Google login
/dashboard                     Dashboard overview
/dashboard/portfolios          Portfolio list
/dashboard/portfolios/[id]     Portfolio editor
/dashboard/content             Shared content library
/dashboard/assets              Asset library
/dashboard/resumes             Resume library
/preview/[portfolioId]         Authenticated draft preview
```

Custom domains and portfolio subdomains are future enhancements. Start with `/p/[slug]`
because it is simple to deploy, cache, test, and share.

## 4. Data model

The exact SQL will be written as versioned migrations, but the initial model should follow
these responsibilities.

### 4.1 `admin_users`

Authorizes Supabase Auth users to access the dashboard.

```text
id                uuid primary key
user_id           uuid unique references auth.users
email             text unique
display_name      text
role              text default 'owner'
created_at        timestamptz
```

For the MVP there is one owner account, but the table avoids hardcoding an email throughout
the application and allows another administrator later.

### 4.2 `portfolios`

```text
id                    uuid primary key
owner_id              uuid references auth.users
name                  text
slug                  text unique
position_role         text
description           text
status                draft | published | archived
is_default            boolean
theme_id              uuid nullable
default_resume_id     uuid nullable
published_version_id  uuid nullable
created_at            timestamptz
updated_at            timestamptz
```

Rules:

- Only one portfolio can be the default per owner.
- Slugs are unique, normalized, and protected against reserved application routes.
- Archived portfolios are not publicly accessible.

### 4.3 `content_entries`

Stores the reusable content library.

```text
id              uuid primary key
owner_id        uuid references auth.users
kind            hero | about | project | experience | skill | technology |
                hire_me | contact | education | custom
name            text
payload         jsonb
schema_version  integer
created_at      timestamptz
updated_at      timestamptz
```

Examples:

- A Schedex experience entry shared by the Frontend and Full Stack portfolios.
- A Boardly project shared by every portfolio with different descriptions.
- A shared personal/contact entry.
- A frontend-specific hero entry.

Every payload must pass the Zod schema associated with `kind` before insertion or update.
The existing interfaces in `lib/content/types.ts` are the starting point for these schemas.

### 4.4 `portfolio_sections`

Defines the composition and order of each portfolio.

```text
id                 uuid primary key
portfolio_id       uuid references portfolios on delete cascade
section_type       hero | about | experience | projects | technologies |
                   hire_me | contact | custom
name               text
position           integer
enabled            boolean
content_entry_id   uuid nullable references content_entries
settings           jsonb
created_at         timestamptz
updated_at         timestamptz
```

`settings` contains section-level presentation options selected from safe, validated
variants. It must not contain arbitrary CSS or executable code.

### 4.5 `portfolio_section_items`

Connects reusable entries to list-based sections such as Projects, Experience, Skills, and
Technologies.

```text
id                 uuid primary key
section_id         uuid references portfolio_sections on delete cascade
content_entry_id   uuid references content_entries
position           integer
enabled            boolean
overrides          jsonb nullable
created_at         timestamptz
updated_at         timestamptz
```

`overrides` contains only the fields changed for this portfolio. At render or publish time:

```text
resolved content = shared payload + validated portfolio overrides
```

### 4.6 `themes`

```text
id               uuid primary key
owner_id         uuid references auth.users
name             text
tokens           jsonb
schema_version   integer
created_at       timestamptz
updated_at       timestamptz
```

Theme tokens should support:

```ts
type ThemeTokens = {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  foregroundColor: string;
  mutedForegroundColor: string;
  fontPreset: "modern" | "technical" | "editorial";
  radiusPreset: "sharp" | "medium" | "rounded";
  densityPreset: "compact" | "comfortable";
  motionPreset: "minimal" | "balanced" | "expressive";
};
```

Do not store arbitrary CSS. It introduces security, validation, accessibility, and
maintenance problems. Generate CSS variables from validated tokens instead.

### 4.7 `assets`

```text
id              uuid primary key
owner_id        uuid references auth.users
bucket          text
storage_path    text unique
kind            profile | project | logo | resume | document | other
original_name   text
mime_type       text
size_bytes      bigint
width           integer nullable
height          integer nullable
alt_text        text nullable
metadata        jsonb
created_at      timestamptz
```

The database record is the source of asset metadata and references. Files are uploaded,
moved, copied, and deleted through the Supabase Storage API rather than by editing Storage
metadata tables directly.

### 4.8 Resume tables

#### `resumes`

```text
id                    uuid primary key
owner_id              uuid references auth.users
name                  text
slug                  text
mode                  uploaded | structured
uploaded_asset_id     uuid nullable references assets
theme                  jsonb
published_version_id  uuid nullable
created_at             timestamptz
updated_at             timestamptz
```

#### `resume_sections`

```text
id          uuid primary key
resume_id   uuid references resumes on delete cascade
type        summary | experience | projects | skills | education | custom
position    integer
enabled     boolean
settings    jsonb
```

#### `resume_items`

```text
id                 uuid primary key
resume_section_id  uuid references resume_sections on delete cascade
content_entry_id   uuid references content_entries
position           integer
overrides          jsonb nullable
```

#### `portfolio_resumes`

```text
portfolio_id  uuid references portfolios on delete cascade
resume_id     uuid references resumes on delete cascade
is_default    boolean
primary key (portfolio_id, resume_id)
```

This lets resumes reuse the same projects and experience as portfolios while applying
resume-specific wording and ordering.

### 4.9 `portfolio_versions`

```text
id             uuid primary key
portfolio_id   uuid references portfolios on delete cascade
version        integer
snapshot       jsonb
created_by     uuid references auth.users
created_at     timestamptz
published_at   timestamptz nullable
change_note    text nullable
```

Snapshots are immutable. Rollback publishes a new version based on an old snapshot instead
of modifying history.

## 5. Content sharing behavior

The dashboard must make sharing explicit. Every shared item displays its usage count:

```text
Shared content — used by Frontend, Backend, and Full Stack
```

When editing shared content, provide three choices:

1. **Edit shared source** — changes every draft using the source.
2. **Override in this portfolio** — stores only changed fields in the relationship.
3. **Duplicate and detach** — creates an independent content entry.

Do not silently mutate shared content. The dashboard should show affected portfolios before
saving a shared change.

Overrides must be shallow or deep-merged according to a documented schema. Arrays need an
explicit rule; do not rely on a generic merge that could unexpectedly combine projects,
paragraphs, or technology lists.

## 6. Dashboard experience

### 6.1 Dashboard shell

- Portfolio switcher.
- Global content-library navigation.
- Draft/published status.
- Last saved and last published timestamps.
- Preview and Publish actions.
- Responsive dashboard navigation.

### 6.2 Portfolio composer

- Drag-and-drop section ordering.
- Enable/disable section controls.
- Add an existing section or duplicate one.
- Section-specific settings.
- Desktop, tablet, and mobile preview modes.
- Unsaved-change warning.
- Validation summary before publishing.

Integer positions are sufficient for the small number of sections. Reordering can update all
affected positions in one transaction. Fractional ordering can be introduced if collaborative
editing is added later.

### 6.3 Content library

- Filter by content type.
- Search by internal name, title, company, tags, or technologies.
- Show usage count and affected portfolios.
- Create, edit, duplicate, archive, and restore entries.
- Prevent deleting content still referenced by a portfolio or resume.
- Prefer archive/soft-delete over immediate permanent deletion.

### 6.4 Appearance editor

- Preset-based themes.
- Color controls with contrast warnings.
- Typography and spacing presets.
- Border-radius and surface presets.
- Animation intensity.
- Reset individual tokens or the complete theme.
- Live preview using the actual portfolio renderer.

All motion presets must continue respecting `prefers-reduced-motion`.

### 6.5 Asset manager

- Drag/drop and file-picker uploads.
- Upload progress and validation messages.
- Image preview, dimensions, type, and file size.
- Alt-text editing.
- Usage count and references.
- Replace without breaking references.
- Safe deletion only when the asset is unused.

## 7. Storage design

Recommended buckets:

### `portfolio-images`

- Public read for published images.
- Authenticated owner-only insert, update, and delete.
- Store profile images, project screenshots, and logos.
- Suggested path: `{ownerId}/{assetId}/{filename}`.

### `resume-files`

- Private bucket.
- Authenticated owner-only management.
- A public Route Handler may create a short-lived signed URL only when the resume is attached
  to a published portfolio.

### Upload validation

- Allow only explicit image/document MIME types.
- Apply file-size limits.
- Validate image dimensions.
- Generate safe filenames rather than trusting user filenames.
- Record width, height, MIME type, and size in `assets`.
- Use Next Image remote patterns for the exact Supabase project host.
- Keep profile and project images appropriately sized; do not serve original camera-sized
  images directly to the public site.

## 8. Security model

### Database policies

Enable RLS on every dashboard table.

Policy goals:

- An authenticated owner can read and mutate their own drafts and content.
- Other authenticated users cannot read or mutate the owner's data.
- Anonymous users cannot read draft tables.
- Anonymous users can read only published portfolio snapshots required by public routes.
- Authorization fields must not rely on mutable `raw_user_metadata`.
- Index every ownership and foreign-key column used in RLS policies.

### Storage policies

- Only the owner can upload, replace, and delete assets in their path.
- Public image reads are allowed only from the intended image bucket.
- Resume files remain private and are exposed only through validated published references.

### Application checks

- Centralize authentication and authorization in a server-only data-access layer.
- Treat Server Actions and Route Handlers as public endpoints.
- Validate every mutation with Zod on the server.
- Verify resource ownership; never trust a portfolio ID received from the client.
- Use `proxy.ts` only for session refresh and optimistic navigation redirects.
- Apply rate limiting to login-sensitive callbacks, uploads, contact forms, and expensive PDF
  generation endpoints where appropriate.
- Keep service-role operations rare, server-only, and isolated.

## 9. Public rendering and performance

The public website should load a resolved published snapshot by slug:

```ts
const portfolio = await getPublishedPortfolioBySlug(slug);
```

The snapshot includes:

- Resolved theme.
- Ordered enabled sections.
- Resolved shared content plus overrides.
- Asset URLs and alt text.
- Resume download information.
- SEO metadata.

Caching approach:

- Cache by portfolio ID or slug.
- Invalidate the portfolio cache tag only after a successful publish.
- Keep drafts uncached or user-scoped.
- Generate metadata from the same published snapshot.
- Keep current JSON loaders as a temporary fallback during migration.

The dashboard must not add JavaScript to public routes. Maintain performance budgets for
LCP, CLS, TBT, image size, and total client JavaScript.

## 10. Resume implementation

### Resume V1 — uploaded files

- Upload multiple PDFs.
- Name them Frontend, Backend, and Full Stack.
- Assign one default resume to each portfolio.
- Share one uploaded PDF between portfolios.
- Version replacements rather than overwriting a file in place.

This version should ship with the MVP.

### Resume V2 — structured resume builder

- Build resume sections from shared content entries.
- Reorder and enable/disable sections.
- Add resume-specific overrides.
- Support multiple validated templates.
- Preview HTML and generated PDF.
- Store generated PDFs as immutable resume versions.
- Test text overflow, page breaks, links, print colors, and selectable text.

Before selecting the PDF library, run a technical spike comparing a React-native PDF renderer
against server-rendered HTML/Chromium. Evaluate Vercel runtime compatibility, bundle size,
font support, page-break control, accessibility, and generation time.

## 11. Migration from current JSON content

The existing content structure is useful groundwork:

- `content/*.json` contains the current source data.
- `lib/content/types.ts` defines the current content shapes.
- `lib/content/loaders.ts` isolates the components from the storage implementation.

Migration sequence:

1. Add Zod schemas matching the current TypeScript interfaces.
2. Create Supabase migrations and generated database types.
3. Write an idempotent seed/import command for `content/*.json`.
4. Upload current profile/project images and resume files to Storage.
5. Create a default portfolio using the imported content.
6. Add a temporary `CONTENT_SOURCE=json|supabase` switch.
7. Compare the Supabase-rendered portfolio against the current JSON-rendered site.
8. Publish the imported default portfolio.
9. Remove the runtime JSON fallback only after production verification.
10. Keep a sanitized export/seed as a recovery fixture if useful.

## 12. Implementation phases and AI-assisted estimates

Estimates assume:

- One developer already familiar with React, Next.js, and TypeScript.
- AI is used actively for scaffolding, migrations, form code, tests, and debugging.
- The developer still reviews architecture, SQL, RLS, security, UX, and generated code.
- Focused work means approximately 5–7 productive hours per day.
- Google/Supabase/Vercel projects can be configured without organizational delays.

AI accelerates repetitive implementation, but OAuth configuration, RLS verification, data
model decisions, visual QA, production debugging, and deployment validation remain mostly
human-controlled.

### Phase 0 — product decisions and technical foundation

Estimated: **0.5–1.5 focused days**

- Confirm MVP scope and deferred features.
- Confirm public URL format.
- Confirm theme controls and section types.
- Define sharing, override, duplicate, and archive behavior.
- Add dependencies and Supabase environment configuration.
- Initialize Supabase CLI migrations and generated types.

### Phase 1 — Google authentication and authorization

Estimated: **1.5–3 focused days**

- Configure Google OAuth and redirect URLs.
- Implement browser/server Supabase clients.
- Add login, callback, logout, and unauthorized states.
- Add `admin_users` and the approved Gmail account.
- Add `proxy.ts` for session refresh and redirects.
- Add server-side authorization helpers.
- Test expired sessions and unauthorized accounts.

### Phase 2 — schema, RLS, seed, and Storage policies

Estimated: **2.5–4.5 focused days**

- Create the core database migrations.
- Implement RLS and Storage policies.
- Add indexes and constraints.
- Create Zod schemas and content-resolution helpers.
- Seed current JSON content.
- Import current assets.
- Add automated RLS tests.

### Phase 3 — multi-portfolio public renderer

Estimated: **2–3.5 focused days**

- Implement `/p/[slug]` and default `/` behavior.
- Resolve ordered sections and content overrides.
- Apply validated theme tokens.
- Generate metadata per portfolio.
- Add JSON/Supabase comparison tests.
- Verify responsive layout and Lighthouse budgets.

### Phase 4 — dashboard shell and portfolio composer

Estimated: **3.5–6 focused days**

- Build the authenticated dashboard layout.
- Create portfolio CRUD and duplication.
- Implement section enable/disable and ordering.
- Add content assignment, sharing, override, and detach workflows.
- Add form validation, save states, and unsaved-change warnings.
- Add responsive draft preview.

### Phase 5 — content and asset management

Estimated: **2.5–4 focused days**

- Build content-library CRUD, search, filters, and usage indicators.
- Implement image and document uploads.
- Add asset picker, metadata, alt text, and replacement.
- Add safe archive/delete behavior and orphan detection.

### Phase 6 — appearance editor

Estimated: **2–3.5 focused days**

- Build theme presets and token controls.
- Add contrast validation.
- Add motion, density, radius, and typography presets.
- Add mobile/tablet/desktop preview modes.
- Verify reduced-motion behavior.

### Phase 7 — draft, publish, version history, and rollback

Estimated: **2–3.5 focused days**

- Build snapshot generation and validation.
- Add publish confirmation and change notes.
- Add cache invalidation.
- Build version history and rollback.
- Verify that draft changes never affect public data.

### Phase 8 — Resume V1

Estimated: **1–2.5 focused days**

- Build uploaded resume management.
- Assign and share resumes between portfolios.
- Add private Storage policies and controlled downloads.
- Add replacement/version behavior.

### Phase 9 — structured Resume V2

Estimated: **4–7 focused days**

- Complete the PDF technology spike.
- Build structured resume sections and shared-content selection.
- Add resume overrides, ordering, and templates.
- Implement preview and PDF generation.
- Add page-break, typography, and export tests.

### Phase 10 — hardening and production release

Estimated: **2.5–5 focused days**

- Complete end-to-end tests.
- Run accessibility, responsiveness, console, and Lighthouse checks.
- Review RLS and authorization paths.
- Test invalid uploads and asset cleanup.
- Add database export/recovery documentation.
- Deploy, migrate, seed, publish, and perform production smoke tests.

## 13. Overall time estimate with AI

### MVP

Includes:

- Google-authenticated single-owner dashboard.
- Multiple portfolios.
- Existing section types.
- Shared content and portfolio overrides.
- Section ordering and visibility.
- Theme presets and appearance controls.
- Image uploads.
- Uploaded PDF resume assignment.
- Draft preview, publish, versions, and rollback.
- Core tests and production deployment.

Estimated effort: **12–20 focused working days** with strong AI assistance.

Calendar estimate:

- Full-time focused work: approximately **3–4 weeks**.
- Part-time at 2–3 hours/day: approximately **6–10 weeks**.

### Full requested system

Adds:

- Structured resume builder.
- PDF generation and templates.
- More advanced content-library tooling.
- Stronger test coverage and operational tooling.
- Optional custom-section support.

Estimated effort: **20–30 focused working days** with strong AI assistance.

Calendar estimate:

- Full-time focused work: approximately **4–7 weeks**.
- Part-time at 2–3 hours/day: approximately **9–15 weeks**.

Add a **25–50% buffer** if this is the developer's first production implementation of
Supabase Auth, Postgres RLS, Storage policies, or server-side PDF generation.

AI can often reduce repetitive coding time by roughly one third or more in this type of
project, but the estimate must not assume generated code is correct without review. Security
policies, content merging, migrations, publishing, and PDF layout are the areas most likely
to require careful manual debugging.

## 14. MVP scope and deferred scope

### Build in the MVP

- One approved Gmail administrator.
- Multiple portfolios using `/p/[slug]`.
- Current known section types.
- Shared projects, experience, technologies, and personal content.
- Per-portfolio field overrides.
- Section order and visibility.
- Validated theme presets/tokens.
- Profile and project image uploads.
- Uploaded PDF resumes and portfolio assignment.
- Draft preview, publish, history, and rollback.
- Responsive, accessibility, RLS, and E2E tests.

### Defer until after MVP

- Arbitrary block-based custom sections.
- Rich collaborative text editor.
- Structured resume/PDF builder.
- Custom domains and subdomains.
- Multiple roles and collaborative editing.
- Analytics dashboard.
- Contact-submission inbox and email-provider settings.
- Scheduled publishing.
- Localization.

## 15. Testing strategy

### Unit tests

- Zod schema validation.
- Shared content plus override resolution.
- Array replacement/merge rules.
- Theme token validation.
- Snapshot generation.
- Slug and reserved-route validation.

### Database and security tests

- Anonymous users cannot read drafts.
- Unauthorized authenticated users cannot read or mutate owner data.
- Approved owner can perform expected CRUD operations.
- Public users can read only published snapshots.
- Storage uploads and deletes are restricted to the owner path.
- Referenced assets cannot be deleted accidentally.

### Integration and E2E tests

- Google callback and unauthorized-account handling.
- Create, duplicate, archive, and publish a portfolio.
- Reorder and disable sections.
- Edit shared content and verify affected portfolios.
- Create an override and verify other portfolios remain unchanged.
- Upload, replace, and delete assets safely.
- Assign a resume and validate its public download.
- Roll back to a previous portfolio version.

### Visual and quality tests

- Mobile, tablet, desktop, and narrow mobile layouts.
- Keyboard navigation and focus visibility.
- Contrast and reduced-motion checks.
- Console errors and hydration warnings.
- Lighthouse performance budgets for each published portfolio.
- Visual regression screenshots for the default theme and major variants.

## 16. Main risks and mitigations

### Shared-content confusion

Risk: Editing one entry unexpectedly changes several portfolios.

Mitigation: Show usage counts and require an explicit choice between editing the shared
source, overriding locally, or duplicating and detaching.

### Accidental live edits

Risk: Half-finished dashboard changes appear publicly.

Mitigation: Draft data is private; public pages read only immutable published snapshots.

### Incorrect RLS

Risk: Draft content or assets become publicly accessible.

Mitigation: Default-deny policies, automated RLS tests, owner indexes, and no browser service
role.

### Override complexity

Risk: Generic JSON merging produces inconsistent data.

Mitigation: Per-kind Zod schemas, documented merge rules, schema versions, and snapshot tests.

### Orphaned Storage files

Risk: Deleted content leaves unused billed files.

Mitigation: Track assets in the database, show usage references, and use a safe cleanup job
after a retention period.

### Scope expansion

Risk: Custom sections and PDF generation delay the usable dashboard.

Mitigation: Ship existing section types and uploaded PDFs first. Add block editing and
structured resumes after the multi-portfolio MVP is stable.

### Public-site performance regression

Risk: Database composition or dashboard dependencies slow down public portfolios.

Mitigation: Resolve immutable publish snapshots, cache by portfolio, isolate dashboard Client
Components, and maintain Lighthouse budgets.

## 17. Definition of done for the MVP

The MVP is complete when:

- Only the approved Gmail account can access the dashboard.
- RLS and Storage policies pass automated authorization tests.
- At least three portfolios can be created and shared by slug.
- Each portfolio can independently order, enable, and disable sections.
- Projects and experience can be shared, overridden, duplicated, and detached.
- Theme settings and profile/project images can be customized per portfolio.
- Uploaded resumes can be shared or assigned independently.
- Draft preview never affects the published site.
- Publishing creates an immutable version and rollback works.
- Existing portfolio content has been migrated without visual regression.
- Public routes pass responsive, accessibility, console, build, and agreed Lighthouse checks.
- Production migration, deployment, and recovery steps are documented.

## 18. Recommended implementation order

Do not begin with dashboard screens. Use this order:

1. Supabase project, migrations, generated types, and environment setup.
2. Google authentication, admin allowlist, authorization helpers, and RLS.
3. Core schema, content schemas, seed/import, and Storage policies.
4. Published snapshot builder and public multi-portfolio renderer.
5. Dashboard portfolio composer and content library.
6. Asset manager and appearance editor.
7. Draft/publish/version/rollback workflow.
8. Uploaded resume management.
9. Production hardening and deployment.
10. Structured resume builder after the MVP is stable.

This sequence proves security and the public data model before investing in a large dashboard
UI that might otherwise need to be rewritten.

## 19. Reference documentation

- [Supabase: Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase: Creating a client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&queryGroups=framework)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase: Storage ownership](https://supabase.com/docs/guides/storage/security/ownership)
- [Next.js: Authentication](https://nextjs.org/docs/app/guides/authentication)
- [Next.js 16: Proxy](https://nextjs.org/docs/app/getting-started/proxy)
