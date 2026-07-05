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
