# Content Dashboard — Implementation Plan

Status: **planned, not started**. This doc captures the architecture decision and rollout
steps agreed on so implementation can pick up later without re-deriving context.

## Goal

Manage all portfolio content (hero copy, about, experience, projects, technologies, contact
info, hire-me values, and new sections) from an authenticated `/admin` dashboard instead of
editing component source files. Also move contact-form submissions and EmailJS configuration
out of hardcoded env vars so they're viewable/editable at runtime.

## Decision: build it in Next.js, not a headless CMS

Chosen over Sanity/Payload/etc. Reasoning:

- Single editor (just Ahmad), modest content volume — a CMS's collaboration/roles features
  aren't needed.
- Everything stays inside this repo/stack (Next.js + TypeScript), no new platform to learn
  or pay for once free tiers are exceeded.
- Building the CRUD dashboard, auth, and schema is itself a legitimate portfolio project
  (full-stack work) worth listing in the Projects/Experience sections later.
- No vendor lock-in on content — it's just rows in a Postgres DB.

Trade-off accepted: more upfront engineering than a CMS (schema design, admin UI, image
upload pipeline) vs. getting an admin UI for free.

## Stack (all free-tier)

| Concern | Choice | Why |
|---|---|---|
| Hosting | Vercel Hobby plan | Already deployed here; free for personal projects |
| Database | Supabase Postgres (free tier: 500MB DB + 1GB storage) | One provider for both DB *and* image storage (project screenshots), avoids needing a second service like Vercel Blob |
| ORM | Prisma | Familiar from NestJS/Postgres background, mature migrations tooling |
| Auth | Custom: hashed password + signed httpOnly session cookie, checked in middleware | Single user — a full auth provider (NextAuth/OAuth) is unnecessary complexity |
| Email sending | Move server-side. Either keep EmailJS but call it from a Server Action, or switch to Resend (3,000 free emails/mo, built for this) | Editable "email configuration" requires the keys to live in the DB and be read per-request, not baked into the client bundle via `NEXT_PUBLIC_*` |
| Content types | TypeScript interfaces per section (already being introduced now, see below) | Dashboard forms and DB schema both derive from the same shape as the current static content loaders, minimizing churn when swapping JSON → DB |

## Current groundwork (already done, ahead of the dashboard)

As of the animation/content-structure pass done alongside this doc:

- `lib/content/types.ts` — TypeScript interfaces for every section's content shape
  (`HeroContent`, `AboutContent`, `ExperienceItem`, `ProjectItem`, `TechnologyItem`,
  `ContactInfo`, `HireMeValue`, etc.)
- `content/*.json` — the actual content, one file per section, matching those types
- `lib/content/*.ts` — `async` loader functions (e.g. `getProjects()`, `getExperience()`)
  that section components call. Right now they just read the local JSON, but the call sites
  already look exactly like they will once these functions query the DB instead — so
  swapping the implementation later shouldn't require touching any section component.

This means the biggest content-modeling decision (what fields does a "project" have, what
fields does an "experience entry" have) is already made and validated against real content,
which should make the Prisma schema close to a direct translation of `lib/content/types.ts`.

## Rollout phases

### Phase 1 — Database + schema
- Provision Supabase project, add `DATABASE_URL` to env.
- Install Prisma, define schema mirroring `lib/content/types.ts` (one table per section,
  plus a generic `sections` table if we want fully dynamic "add a new section" support —
  needs a decision: fixed tables per known section vs. a flexible JSON-column model for
  arbitrary new sections. Recommendation: fixed tables for the known sections (better
  validation, easier admin forms), and *one* flexible `custom_sections` table with a JSON
  `content` column for anything added later that doesn't fit the existing shape).
- Write a one-time seed script that loads today's `content/*.json` into the DB, so launch
  doesn't lose any existing copy.
- Swap `lib/content/*.ts` loader internals from JSON reads to Prisma queries. Section
  components should require zero changes if the function signatures stay the same.

### Phase 2 — Auth
- `admin_users` table (or a single hardcoded admin email + hashed password in env — fine
  for single-user).
- `/admin/login` page, Server Action to verify password (bcrypt) and set a signed httpOnly
  session cookie.
- `middleware.ts` protecting all `/admin/*` routes, redirecting unauthenticated requests to
  `/admin/login`.

### Phase 3 — Admin CRUD UI
- `/admin` dashboard shell (nav for each content section).
- Per-section list + edit forms using Server Actions for mutations (create/update/delete/
  reorder), reusing the types from `lib/content/types.ts` for form validation.
- Image upload for project screenshots and the hero/about photo → Supabase Storage.
- "Add new section" flow writing into the `custom_sections` table, with the public page
  rendering those generically (title + rich text/blocks) alongside the fixed sections.

### Phase 4 — Contact submissions + email config
- `contact_submissions` table; the contact form's Server Action inserts a row *and* sends
  the notification email, instead of the current pure client-side EmailJS call.
- `/admin/submissions` — list/read/mark-handled view.
- `email_settings` table (service/template IDs or Resend API key + from-address, whichever
  provider is chosen) editable from `/admin/settings`, read server-side when sending.

### Phase 5 — Cleanup
- Remove `NEXT_PUBLIC_EMAILJS_*` env vars once sending is fully server-side.
- Delete `content/*.json` once DB is the source of truth (or keep as the seed/fallback).

## Open decisions to make when this phase starts

1. Fixed-tables-per-section vs. fully generic schema — recommendation above, but confirm
   before writing the Prisma schema.
2. Keep EmailJS (less migration work) or switch to Resend (nicer DX, one less client-side
   dependency)?
3. Any content needing rich text (e.g. About paragraphs) — plain strings/markdown are
   enough for now, or do we want a block editor?
