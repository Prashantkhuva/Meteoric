# Final Production-Readiness QA — SEO / AEO / GEO / Accessibility / Site Integrity

**Date:** 2026-09-30
**Scope:** All public routes on the Meteoric site, audited against a local production build (`next build` + `next start`, port 3999) of the current working branch, with spot-checks against the live site at `https://withmeteoric.com`.
**Method:** 47-path crawl (37 sitemap URLs + extras + deliberate 404 probes), Lighthouse runs, Playwright interaction tests (CTAs, forms, reduced motion, mobile viewport), live-site comparisons, and repository inspection. Every finding below is backed by an observation recorded during this session.

**Build health (item 13):** `npm run build` 80/80 pages, `npm run lint` clean, `npx tsc --noEmit` exit 0.

---

## 1. Summary of findings by severity

### P0 — must resolve before deploying

| # | Finding | Evidence |
|---|---------|----------|
| 1 | **404s from internal links.** `/contact` returns 404 but is linked from **all 13 blog post bodies** (`[Contact](/contact)` in `src/data/blog-posts.ts`). Three dead blog links are rendered from `/services/startup-web-development`: `/blog/how-much-does-a-startup-website-cost`, `/blog/how-to-choose-a-web-development-agency`, `/blog/react-vs-nextjs-for-startup-websites` — `relatedBlogPosts` in `src/data/services.ts:251–263` is rendered raw by `src/components/pages/ServiceLanding.jsx:142` (the blog detail page filters missing posts at `app/(marketing)/blog/[slug]/page.jsx:130`; the service page does not). | Crawl of all internal link targets: exactly 4 unique broken targets out of 39 |
| 2 | **`llms.txt` is out of sync with reality.** Claims "Blog (20 posts)"; 13 exist. **7 of its 20 listed post URLs return 404** (`complete-website-audit-checklist-for-startups`, `conversion-focused-web-design-beyond-pretty-ui`, `react-vs-nextjs-for-startup-websites`, `how-to-choose-a-web-development-agency`, `building-a-saas-prototype-in-3-weeks-a-case-study`, `nextjs-vs-remix-2026-comparison`, `how-much-does-a-startup-website-cost`). `llms-full.txt` is clean (0 broken). HabitFlow listed under two different URLs (`habitflow.indevs.in` line 57, `habit-flow-fullstack.vercel.app` line 90) — both return 200 today, but AI crawlers get conflicting entity URLs. Same stale file is served on production. | Status check of every `withmeteoric.com` URL in both files |
| 3 | **Production is behind the repository.** Repo is on branch `seo-aeo-geo-improvements` (4 commits not on `origin/main`, branch itself not pushed, 109 modified/untracked files uncommitted). Live sitemap has **33 URLs; repo sitemap has 37**. Four pillar pages — `/saas-mvp-development`, `/nextjs-development-agency`, `/startup-landing-page-design`, `/web-app-development` — are **404 on production**, 200 locally. Production `robots.txt` also lacks the local `Disallow: /preview` and `Disallow: /share` rules. | `diff` of local vs live sitemap; live status checks; `git status`/`branch -vv` |
| 4 | **`/editorial-policy` rendered without site chrome** — zero `<nav>`, zero `<main>`, zero `<footer>`, and the global skip link's `#main-content` target missing. Root cause: `pathname.startsWith("/editor")` in `app/client-layout.jsx` matched `/editorial-policy`, flagging the page as admin. **Fixed this session** (segment-exact check at `app/client-layout.jsx:37–42`), rebuilt and re-verified: nav, footer, `#main-content`, and "Book a call" CTAs all present; `/editor` route behavior unchanged. | Before/after HTML comparison; build 80/80; regression check on `/`, `/privacy` |

### P1 — should resolve before or right after deploy

| # | Finding | Evidence |
|---|---------|----------|
| 5 | **Testimonial marquee duplicates each review 12× in the static HTML** (24 `<article>` cards = 2 unique reviews × 6 sets × 2 rows). Row 2's container is `aria-hidden`; row 1 has 10 of 12 cards `aria-hidden` individually, so screen readers hear each review once — but `aria-hidden` does not remove text from the indexable HTML. Home is the **only** page on the site with repeated text blocks (sliding-window duplicate scan across all 37 pages found repeats nowhere else). Recommended fix: render one copy server-side, clone the marquee sets client-side. | DOM analysis of `/`; duplicate-chunk scan sitewide |
| 6 | **HowTo schema step names don't match visible process steps** (2 of 4). Schema (`app/(marketing)/page.jsx:29–46`): Discovery / Design Direction / Development / Launch. Visible section (`src/components/sections/ProcessSection.jsx:10–31`): Kickoff / Design / Development / Launch. FAQ schema, by contrast, matches the visible accordion exactly (one apparent miss was an HTML entity false-negative). | JSON-LD parsed from `/` vs rendered text |
| 7 | **`/author/prashant-khuva` is an orphan.** Indexable, self-canonical, in the sitemap — but no other page on the site links to it (only a self-reference). Blog bylines show "Prashant Khuva" as plain text; the Article schema's Person `url` points to `/about`, not the author page. Person `@id` (`https://withmeteoric.com/#prashant-khuva`) is consistent between `/about` and Article author markup, so the entity is coherent; the page itself just has zero inbound links. Also the only page missing a `WebPage`-type node (it has Person + BreadcrumbList). | Sitemap-wide inbound-link sweep; JSON-LD type map per page |
| 8 | **Mobile tap targets under 24×24 CSS px** on the home page: nav "Book a call" 90×20, footer/section links 16 px tall, marquee service labels 91–117×20 (WCAG 2.2 AA 2.5.8 minimum; inline/spacing exceptions may apply — verify manually in checklist D). | Playwright at 390×844 with `hasTouch`, bounding-box scan of visible `a`/`button` |

### P2 — minor / informational

- **Cal.com booking modal works:** 6 "Book a call" buttons open `app.cal.com/prashantkhuva/let-s-build/embed` inside `cal-modal-box`; iframe has `title="Book a call"`; Escape closes it when focus is inside the modal (verified). The container has no site-side `role="dialog"`/`aria-modal` (owned by the Cal web component), and `body { overflow: visible }` while open — visual scroll-lock check belongs to checklist D.
- **Review form (home → "Leave a review"):** all 6 fields (`review-name`, `review-email`, `review-role`, `review-company`, `review-project`, `review-content`) have associated `<label for>` elements; required fields flagged. Empty submit is caught by **native browser validation only** — no custom `aria-live` error text. Zero uncaught page errors during the interaction run.
- **`og.jpg` serves with `Cache-Control: public, max-age=0`** (revalidates every time; fine for unhashed assets, could be raised with a versioned filename).
- `/maintenance` is `noindex,nofollow`, unlinked, absent from sitemap (correct) but missing `og:image` — irrelevant while noindexed.
- **Timeline claims differ across pages:** home/llms say SaaS "4–10 weeks"; service pages say MVP "3–6 weeks" and full-featured SaaS "6–10 weeks". Not false — but inconsistent. Added to checklist E.
- **`AGENTS.md` GEO section is stale:** it claims Review star-rating + AggregateRating schema is deployed; the code explicitly excludes it (`src/lib/seo/jsonLd.js:20`: "No AggregateRating, Review, price, availability, or geo anywhere"). The code is the safer position — no unverifiable review markup — but the doc should be corrected.
- Duplicate `NEXT_PUBLIC_SITE_URL` in `.env` (production) and `.env.local` (localhost). Harmless today because all SEO output derives from the hardcoded `SITE_URL` in `src/lib/seo/config.js:11`; worth cleaning up so share links can't diverge.
- Untracked audit artifacts pollute the repo root: `lh-*.json`, `lighthouse-report*.json`, `shift-before/after.jpeg`, `next-env.d.ts`, `tsconfig.json` (the latter two are required source files and must be committed).

### Measured as passing (verified this session)

- **Metadata:** 38 indexable pages — every title unique, every meta description unique, every canonical unique and **identical to `og:url`**, `twitter:card` present, `<html lang="en">` set, one `<h1>` per page, zero heading-level skips, no duplicate `og:image` gaps (except noindexed maintenance + XML feed), no placeholder text, zero images without `alt`, zero relative image sources.
- **Index control:** no unexpected `noindex`; `/admin`, `/login`, `/preview`, `/share`, `/maintenance` never linked from public pages; deliberate bad URLs return a real 404.
- **Sitemap/robots (repo):** sitemap = 37 URLs, all 200 locally; robots = `Allow: /`, disallows admin/login/editor/preview/share/`?q=`, declares sitemap. Live robots carries the same rules plus a Cloudflare content-signals preamble (harmless).
- **Structured data:** every page's JSON-LD parses; all pages emit `BreadcrumbList`; home = Organization, WebSite, SiteNavigationElement, WebPage, HowTo, FAQPage; blog = Article (ISO `datePublished`/`dateModified`) + Speakable; service pillars = Service + FAQPage; work = CreativeWork carrying only on-page facts; `/about` = Person with `sameAs`; no AggregateRating/Review anywhere (intentional).
- **URL hygiene:** `www` → apex 308, `http` → `https` 301 on production; canonical domain hardcoded in `src/lib/seo/config.js` (never deployment domains); zero `withmeteoric.com.vercel.app` leakage in metadata/sitemap — the only `withmeteoric.vercel.app` string is the intentional redirect in `next.config.mjs:50`.
- **Portfolio live URLs** (`agency-v2-theta.vercel.app`, `habitflow.indevs.in`, `megablog.vercel.app`, VS Code Marketplace) all returned HTTP 200 today and are marked `liveUrlVerified` in data — these are client-project deployments, not Meteoric preview URLs. Still on checklist E as "confirm long-term homes".
- **Feed:** `/feed.xml` = valid RSS 2.0 (`application/rss+xml`), 13 items with absolute permalinks.
- **Security/perf headers:** CSP (includes cal.com, GTM, Razorpay, Supabase, Vercel Insights), HSTS with preload, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy; HTML `s-maxage=300, stale-while-revalidate`; `/_next/static/*` immutable 1 year.
- **No secret leakage:** page HTML free of service-role/Resend/Razorpay-secret markers; GA (GTM) present; GSC verification file (`public/googlef11906b8cffcfe5f.html`) and IndexNow key file present.
- **Accessibility behavior:** skip link focuses and jumps to `#main-content` (post-fix), reduced-motion emulation → marquee animation `none`, preloader skipped, all sections opacity 1, footer visible — full compliance with the site's `prefers-reduced-motion` contract.
- **Final Lighthouse (local prod build):** Performance 84, Accessibility 100, Best Practices 96, SEO 100, **CLS 0**, TBT 90 ms, FCP 1.2 s, LCP 4.4 s.
- **Blog internal linking:** all 13 posts have ≥1 inbound link (min. from the blog index); four posts are linked only from the index — listed as a content opportunity in checklist F.

---

## 2. Item-by-item verdicts

| QA item | Verdict |
|---|---|
| 1. Titles / meta descriptions | Pass — unique across all indexable pages |
| 2. Canonical / og:url | Pass — present, unique, equal on all 38 checked |
| 3. Sitemap / robots | Pass locally; **prod stale (33 vs 37)** → checklist A |
| 4. Deployment-domain URLs in metadata | Pass — none; portfolio vercel links are content, verified 200 |
| 5. Duplicate indexable content | **Fail (home only)** — 12× testimonial duplication (P1 #5) |
| 6. Unverified claims / fake metrics | No fake metrics found; gated `resultsVerified` pattern works; real-world claims → checklist E |
| 7. Feed | Pass — 13-item RSS |
| 8. llms.txt / llms-full.txt | **Fail** — 7 dead links + false "20 posts" + dual HabitFlow URL (P0 #2) |
| 9. JSON-LD vs visible content | Mostly pass; HowTo 2/4 name mismatch (P1 #6) |
| 10. Key CTA resolution | Pass — all CTAs resolve (buttons open Cal, internal links 200 except P0 #1) |
| 11. Forms | Pass with notes — labels OK, native-only validation (P2) |
| 12. Reduced motion | Pass |
| 13. Build / lint / typecheck | Pass |
| Landmarks / semantic HTML | Fail only on `/editorial-policy` → **fixed + verified** |
| Git/production parity | **Fail** — branch unpushed, 109 files uncommitted, prod behind (P0 #3) |
