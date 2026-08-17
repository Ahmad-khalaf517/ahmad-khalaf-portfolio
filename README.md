# Ahmad Khalaf Portfolio

A responsive portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and a
validated content architecture designed to evolve into a multi-portfolio dashboard.

Production: [ahmad-khalaf-portfolio.vercel.app](https://ahmad-khalaf-portfolio.vercel.app/)

## Public routes

- `/` renders the default published portfolio.
- `/p/full-stack` renders the same portfolio through the shareable slug route.
- Future published portfolios will use `/p/[slug]` without requiring new section components.

## Architecture

The public site consumes one versioned `PublishedPortfolioSnapshot` rather than loading
individual content files from page components.

```text
content/*.json
    ↓ runtime Zod validation
local content adapter
    ↓
PublishedPortfolioSnapshot
    ├── identity, SEO, resume, and validated theme
    └── ordered, enabled, discriminated sections
            ↓
      PortfolioRenderer + section registry
```

Local JSON is the current source and future seed input. The planned Supabase data layer will
produce the same published snapshot contract, allowing the public renderer to remain stable.

Important documents:

- [`docs/REFACTOR_LOG.md`](docs/REFACTOR_LOG.md) records each dashboard-readiness refactor step,
  decisions, files, verification, and commit intent.
- [`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md) defines the authenticated multi-portfolio
  dashboard, schema, security model, publishing workflow, and delivery phases.

## Features

- Server-rendered portfolio sections with small interactive client islands.
- Configurable section ordering and visibility through the published snapshot.
- Data-driven navigation, footer, identity, resume actions, and SEO.
- Shareable portfolio slug routes with static generation.
- Validated semantic theme tokens, density, typography, radius, and motion presets.
- Runtime validation for local and future database content.
- Hardened contact Server Action with strict input limits, honeypot, timeout, and bounded rate
  limiting.
- Responsive, accessible interactions with reduced-motion support.
- Locally hosted Geist font assets for deterministic builds.

## Requirements

- Node.js 20 or newer.
- pnpm 10.

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local`:

```env
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key

# Optional metadata base. The production portfolio URL is the fallback.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

EmailJS credentials are used only by the server-side contact provider adapter. Do not prefix
private credentials with `NEXT_PUBLIC_`.

## Quality commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use `pnpm test:watch` during schema or domain-logic development.

## Main directories

```text
app/                    Public routes, metadata, and global styles
components/portfolio/   Published page composition, registry, and renderer
components/sections/    Section views and focused interactive islands
content/                Current validated JSON content and future seed source
lib/content/            Content schemas, types, and local loaders
lib/data/               Server-only published-portfolio data access
lib/portfolio/          Snapshot, rendering, metadata, theme, and domain helpers
lib/contact/            Contact validation, rate limiting, and provider adapter
docs/                   Refactor history and dashboard implementation plan
```
