# Meteoric

A high-performance web development agency website built with Next.js 16, React 19, Tailwind CSS v4, and Supabase.

## Stack

- **Framework:** Next.js 16 + React 19 (JavaScript/JSX)
- **Styling:** Tailwind CSS v4 with CSS-first `@theme` config
- **UI:** shadcn/ui + Radix primitives + lucide-react icons
- **Animations:** GSAP (hero/scroll), Framer Motion (UI), Lenis (smooth scroll)
- **Backend:** Supabase (Auth, Database, Storage)
- **Email:** Resend (transactional)
- **Charts:** Recharts
- **Rich Text:** TipTap

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run generate:sitemap` — Rebuild sitemap

## Environment

Copy `.env.example` to `.env.local` and fill in the required variables (Supabase, Resend, EmailJS, Cal.com).
