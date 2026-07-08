# Meteoric — Web Development Agency

## Stack
- **Framework:** Next.js 16 + React 19 (JavaScript/JSX, no TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-first, `@theme` directive in `src/index.css`)
- **UI:** shadcn/ui + Radix primitives + lucide-react icons
- **Animations:** GSAP (hero/scroll), Framer Motion (UI), Lenis (smooth scroll)
- **Backend:** Supabase (Auth, Database, Storage)
- **Email:** Resend (transactional), EmailJS (contact form)
- **Booking:** Cal.com
- **Charts:** Recharts
- **Rich Text:** TipTap
- **Lint:** ESLint v10 flat config (no Prettier)
- **Path alias:** `@/*` → `src/*`

## Project Structure
```
app/              — Next.js App Router pages + API routes
├── (marketing)/  — Public pages route group
│   ├── about/
│   ├── work/
│   └── page.jsx  — Home
├── admin/        — Admin panel (leads, clients, proposals, invoices, projects)
│   ├── actions.js           — Server actions (CRUD + send email)
│   ├── components/          — Admin UI (Checkbox, ConfirmDialog, etc.)
│   └── {leads,clients,...}/ — PageContent.jsx pattern per resource
├── preview/      — Invoice & proposal PDF preview routes
├── login/        — Auth pages
├── api/          — API routes
├── layout.jsx    — Root layout with SEO, fonts, Analytics
└── client-layout.jsx — Client layout wrapper
src/
├── components/
│   ├── layout/   — Navbar, Footer, NavBar modal
│   ├── pages/    — Page-level content (Home, About, Work, NotFound)
│   ├── sections/ — Feature sections (Hero, Process, Projects, etc.)
│   └── ui/       — shadcn primitives (button, card, table, etc.)
├── lib/
│   ├── supabase/ — client.js, server.js, admin.js
│   ├── email/    — email.js, resend.js
│   ├── seo/      — config.js, jsonLd.js
│   ├── analytics/— gtag.js, measurementId.js
│   ├── actions.js — Server actions (lead creation)
│   ├── csv-export.js
│   ├── body-scroll-lock.js
│   └── utils.js
├── hooks/        — useFilters, useFocusTrap, useShortcuts
├── config/       — site-url.js, admin-tokens.js
├── data/         — Static data (projects.js)
├── emails/       — React Email templates
└── index.css     — Tailwind entry + theme tokens
public/           — Static assets (logo, OG image, etc.)
supabase/         — Migrations + seed
scripts/          — Build/utility scripts (generate-sitemap, proxy)
```

## Database
- All `id` columns: `bigint generated always as identity`
- Foreign keys resolved via subqueries — never hardcode IDs
- `services` column is `text`, not an array — display directly, never `.join()`
- Tables: leads, clients, proposals, invoices, projects, cal-bookings

## Admin Panel
- All pages use `PageContent.jsx` pattern (client component)
- Server actions in `app/admin/actions.js`
- Custom `Checkbox` component at `app/admin/components/Checkbox.jsx`
- Delete confirmations use `ConfirmDialog` with `loading` prop
- Pagination: 15 items per page
- Status transitions: draft → sent (leads/proposals), draft → sent → paid/overdue (invoices)

## Email (Resend)
- Test mode (`onboarding@resend.dev`) only delivers to `ADMIN_EMAIL`
- `FROM_EMAIL="Meteoric <onboarding@resend.dev>"` — must change to verified domain for production
- `ADMIN_EMAIL=work.prashantkhuva@gmail.com`
- Proposal + invoice emails send via server actions after email success (status unchanged on failure)

## WhatsApp Sharing
- Uses `wa.me` links with `encodeURIComponent` + `getSiteUrl()` for preview URLs
- All 3 locations (table row, mobile card, drawer) updated per resource

## PDF Generation
- Via `window.print()` on preview routes at `app/preview/{proposal,invoice}/[id]/route.js`
- Dark premium theme matching site design

## Design Tokens
- Background: `#070707`
- Card background: `#0a0a0a`
- Text: `rgba(255,255,255,0.85)`
- Accent: `#EAEFFF`
- Fonts: Inter (primary), Playfair Display (secondary italic), Inter Display (small labels)
- Border: `rgba(255,255,255,0.06)`

## Common Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run generate:sitemap` — Rebuild sitemap

## GEO (Generative Engine Optimization)
- Goal: Get cited by ChatGPT, Claude, Perplexity, Gemini for queries about "web development agency", "SaaS development", etc.
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot (only blocks /admin and /login)
- `public/llms.txt` — curated AI crawler index with all pages, blogs, projects, stats, and citation guidelines
- **Schema markups deployed:**
  - `Organization` with `sameAs` (GitHub, LinkedIn, X, Instagram) — `app/layout.jsx`
  - `Person` for Prashant Khuva with `sameAs`, `knowsAbout`, `jobTitle` — `app/(marketing)/about/page.jsx`
  - `BlogPosting` with `datePublished`, `dateModified`, `image`, `mainEntityOfPage` — `app/(marketing)/blog/[slug]/page.jsx`
  - `BreadcrumbList` on Home, Blog, Work, About, and blog detail pages
  - `Review` (star ratings) + `FAQPage` (5 Q&A) — `src/components/sections/TestimonialsSection.jsx`
  - `HowTo` (4-step process) — `src/components/sections/ProcessSection.jsx`
  - `CreativeWork` (portfolio projects) — `app/(marketing)/work/page.jsx`
  - `ProfessionalService` + `WebSite` with `SearchAction` — `app/layout.jsx`
- Blog: 9 posts (data in `src/data/blog.js`), auto-discovered by sitemap
- Projects: 4 portfolio items with outcome metrics in descriptions
- To run AI citation check: `node scripts/check-ai-citations.mjs`
- To submit to IndexNow (Bing/ChatGPT index): `node scripts/submit-indexnow.mjs`
- TODO: Create Wikidata entry for Meteoric (entity.simplator.com) — manual step
- [x] Add `dateModified` to blog post rendering (show "Updated" date if different from published)
- [x] Create `/services/saas-development` and `/services/startup-web-development` pillar pages
- [x] Write "Supabase vs Firebase 2026" comparison post (P0 keyword, 2,400/mo)
- [x] Write "How to Choose a Web Development Agency for Your Startup" decision guide (GEO-friendly)
- [x] Write "How Much Does a Startup Website Cost?" pricing guide (2,800/mo)
- [x] Add contextual internal links within all 6 blog posts
- [x] Add internal links to About.jsx and Work.jsx pages
- [x] Fix Navbar hash-link inconsistency (`/#work` → `/work`)
- [x] Replace placeholder blog cover images (blog-cover-5.png, blog-cover-6.png)
- New blog total: 9 posts (3 new: Supabase vs Firebase, Startup Website Cost, Choose Your Agency)
- New cover images: blog-cover-5 through blog-cover-9 (themed gradients + brand labels)

## SEO/GEO/AEO Optimization Status (2026-07-07)
- [x] Canonical tags on all 10 public pages (root layout + 9 pages)
- [x] Blog OG/Twitter images use post-specific covers instead of default
- [x] `/services`, `/privacy`, `/terms`, `/technologies/*` in sitemap
- [x] IndexNow key-file typo fixed + key file created at `public/meteoric-indexnow-key.txt`
- [x] Service pages + technology pages in Footer navigation
- [x] `article:published_time`, `article:modified_time`, `article:author` OG tags on blog posts
- [x] `twitter:creator` (`@prashantkhuva_`) on all pages
- [x] `Blog` schema (CollectionPage) on `/blog` listing page
- [x] `SiteNavigationElement` schema in root layout
- [x] `theme-color` (#070707) + `referrer` policy in root layout
- [x] Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages
- [x] Internal links from Work page to service pages
- [x] Author bylines (Prashant Khuva) on all 9 blog posts
- [x] `security.txt` at `public/.well-known/security.txt`
- [x] Technology landing pages: `/technologies/next-js`, `/technologies/supabase`
- [x] Enhanced AI citation checker script (`scripts/check-ai-citations.mjs`)
- [x] Updated `llms.txt` with all 9 posts, new pages, technology pages
- [x] Wikidata entry for Meteoric (https://www.wikidata.org/wiki/Q140453413)
- [x] Technology pages: `/technologies/react`, `/technologies/node-js`
- [x] Dedicated case studies section (`/case-studies`) with metrics-heavy template
- [x] Comparison posts: Next.js vs Remix 2026, MongoDB vs PostgreSQL for SaaS
- [x] Core Web Vitals audit — SpeedInsights installed & collecting RUM data on Vercel

## Research Files (memory/)
- `memory/research/content-gap-analysis/2026-07-06-meteoric-vs-competitors.md` — Full gap analysis vs Naturaily, Big Human, Superside, DePalma
- `memory/research/keyword-research/2026-07-06-meteoric-target-queries.md` — 45 keywords across 5 clusters + SERP + GEO analysis
- `memory/research/off-page-authority-plan/2026-07-08-meteoric-off-page-priority.md` — Off-page authority plan (ON HOLD): GBP, directories, HARO, GitHub, competitor backlinks
- `memory/audits/2026-07-06-core-eeat-top-3-blog-posts.md` — CORE-EEAT audit: MongoDB billing (72/100), GSAP vs FM (70/100), MVP case study (65/100)
- `memory/audits/2026-07-06-internal-linking-optimizer.md` — Link score (60/100), orphan/disposition analysis, repair plan

## Key Research Findings
- **Top competitors**: Naturaily (highest overlap, same Next.js/SaaS audience), Big Human, Superside, DePalma, Standard Beagle
- **Biggest content gap**: No dedicated service pages, no comparison posts (except GSAP vs FM), no pricing content, no GEO-targeted definitions
- **Top P0 keywords**: `saas development agency` (1,900/mo), `startup web development agency` (1,800/mo), `Next.js development agency` (1,300/mo), `Supabase vs Firebase` (2,400/mo), `how to choose a web development agency` (800/mo), `startup website cost` (2,800/mo)
- **CORE-EEAT avg score**: 69/100 — strongest in Trust (80), weakest in Authority (55) and Referenceability (58)
- **Internal linking score**: 60/100 — zero contextual links in blog content, About/Work pages are content dead ends
- **GEO gap**: Missing definition, comparison, and pricing content that AI chatbots prefer to cite

## Environment Variables (.env)
```
NEXT_PUBLIC_EMAILJS_*
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
RESEND_API_KEY
FROM_EMAIL
ADMIN_EMAIL
CALCOM_API_KEY
NEXT_PUBLIC_SITE_URL
```
