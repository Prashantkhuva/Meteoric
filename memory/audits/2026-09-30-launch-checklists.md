# Launch Checklists A–F (2026-09-30 QA follow-up)

Companion to `2026-09-30-final-production-qa.md`. Ordered by execution: A → B → C → D, with E gating content sign-off and F as the post-launch roadmap.

---

## A. Vercel deploy checklist

Pre-deploy (repository):

- [ ] Resolve the 4 broken internal link targets **before** they ship (P0 #1):
  - [ ] Decide: create a `/contact` page (recommended — 13 blog posts already point there) **or** replace all 13 `](/contact)` links in `src/data/blog-posts.ts` with the booking/real destination.
  - [ ] Fix `/services/startup-web-development`: either remove the 3 dead `relatedBlogPosts` entries (`src/data/services.ts:251–263`) or write the 3 missing posts. Also add the same `filter(Boolean)` guard in `src/components/pages/ServiceLanding.jsx:142` that the blog detail page already uses (`app/(marketing)/blog/[slug]/page.jsx:130`) so future dead slugs can never render.
- [ ] Sync `public/llms.txt` (P0 #2): correct "Blog (20 posts)" to the real count, delete or replace the 7 dead post URLs, pick one HabitFlow URL (`habitflow.indevs.in` is the `liveUrl` used by data; the other is a second live deployment — choose the canonical one and use it in both `llms.txt` and `llms-full.txt`).
- [ ] Commit hygiene: add `lh-*.json`, `lighthouse-report*.json`, `shift-*.jpeg` to `.gitignore` (or delete them); **must commit** currently untracked source files (`tsconfig.json`, `next-env.d.ts`, `src/components/pages/ServiceIntentLanding.jsx`, `src/components/seo/`, `src/data/*.ts`, `src/lib/work-type.js`).
- [ ] Push branch `seo-aeo-geo-improvements` (4 commits ahead, no upstream), open PR → `main`, review the 109-file diff, merge.
- [ ] Confirm no secrets in the diff (env files excluded; `src/lib/seo/config.js` holds only the public domain).

Vercel project settings:

- [ ] Build command `npm run build`, output default Next.js, Node ≥ 20.
- [ ] Environment variables present (Production): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `CALCOM_API_KEY`, `NEXT_PUBLIC_SITE_URL=https://withmeteoric.com`, `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-60EV…` (full value in `.env`), `NEXT_PUBLIC_EMAILJS_*` (only if contact form ships), `CLOUDFLARE_API_TOKEN` not needed on Vercel.
- [ ] `NEXT_PUBLIC_SITE_URL` in Vercel = production URL (never localhost — `.env.local` has a localhost copy, Vercel must not inherit it).
- [ ] Production domain `withmeteoric.com` attached; `www` redirect apex-ward enabled (live check today: `www` → 308 → apex, `http` → 301 → `https`).

Post-deploy smoke (curl, ~2 minutes):

- [ ] `https://withmeteoric.com/sitemap.xml` → **37** `<loc>` (today: 33).
- [ ] The 4 pillar pages return 200: `/saas-mvp-development`, `/nextjs-development-agency`, `/startup-landing-page-design`, `/web-app-development`.
- [ ] `robots.txt` contains `Disallow: /preview` and `Disallow: /share` (today missing).
- [ ] `/editorial-policy` HTML contains `<nav`, `<main id="main-content"`, `<footer` (the P0 #4 fix).
- [ ] `/contact` and the 3 service-page blog links → 200 (after P0 #1 fix).
- [ ] `curl -sI https://withmeteoric.com/` shows CSP + HSTS headers.
- [ ] Homepage canonical is `https://withmeteoric.com/`, GA tag fires.
- [ ] `llms.txt` lists only live posts.
- [ ] Run `node scripts/lighthouse-audit.mjs https://withmeteoric.com` → confirm CLS ≈ 0, SEO 100, A11Y 100 survive the deploy.

---

## B. Google Search Console

- [ ] Property type: **Domain property** `withmeteoric.com` (covers www + http) — verification file already exists: `public/googlef11906b8cffcfe5f.html` (HTML-file method, deployed with the site).
- [ ] Confirm verification after deploy (URL inspection → Test live URL works).
- [ ] Submit sitemap: `https://withmeteoric.com/sitemap.xml`.
- [ ] Request indexing (URL Inspection, priority order): the 4 pillar pages (currently 404 in Google's index), `/`, all 13 blog posts, `/case-studies`, 4 work pages, `/editorial-policy`, `/author/prashant-khuva` (only if checklist E keeps it — otherwise remove from sitemap first).
- [ ] Watch **Page indexing** for 2 weeks: expected 37 submitted / 37 indexed; investigate any "Crawled – currently not indexed" on thin pages.
- [ ] **Core Web Vitals** field report after ~28 days: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (lab CLS is already 0; field data is what counts).
- [ ] **Manual actions** + **Security issues** → confirm empty.
- [ ] Links report: record baseline external/internal link counts.
- [ ] Ensure `/maintenance` never appears (noindex); if it does, inspect and remove.
- [ ] Connect GA4 property to GSC (Admin → Product links) for query/page correlation.

---

## C. Bing Webmaster Tools

- [ ] No Bing verification exists in the repo today — add `msvalidate.01` meta tag (root layout) **or** use GSC import ("Bing will import from Google Search Console" — simplest).
- [ ] Submit sitemap `https://withmeteoric.com/sitemap.xml`.
- [ ] URL submission: push the 4 pillar pages + homepage first (Bing's index quota is small; use IndexNow for the rest — key file already deployed at `public/meteoric-indexnow-key.txt`).
- [ ] After deploying new/updated posts: `node scripts/submit-indexnow.mjs` (200 URL/day quota shared across Bing/Yandex/Seznam).
- [ ] Check **URL submission** and **scan** results after 48 h; fix any "blocked by robots.txt" surprises (Cloudflare's content-signals preamble in robots is advisory only — confirm Bing still indexes).
- [ ] Copilot / AI answers: spot-check `site:withmeteoric.com` in Bing and ask Copilot one branded question ("Who is Meteoric?") weekly for the first month.

---

## D. Post-launch manual test (mobile + desktop)

Desktop (Chrome + Firefox + Safari if available):

- [ ] Home: all 6 "Book a call" buttons open the Cal modal; **Escape closes it** (verified locally — re-verify live); complete one test booking flow through to Cal's confirmation screen.
- [ ] "Leave a review" → submit a test review with validation errors shown → then a valid one → confirm it appears in admin (`/admin`) and on approval on the site.
- [ ] Skip link: Tab from page top → Enter → lands on `#main-content` — test on **at least** `/`, `/blog/<slug>`, `/editorial-policy`, `/privacy`.
- [ ] Navigation: every nav/footer link 200; hamburger menu on tablet widths; scroll to footer on all template types (home, blog post, service, work detail, case study).
- [ ] Blog: in-article links, related-posts block, back-to-blog, RSS link if shown; `/feed.xml` in a feed reader.
- [ ] `/preview/proposal/*` and `/preview/invoice/*` still admin/share-gated (should not open anonymously).
- [ ] WhatsApp share buttons on admin resources produce correct preview URLs (they use `getSiteUrl()` — confirm live URL, not localhost).
- [ ] Browser console clean on home, one blog post, one service page (no 404/500 requests, no React errors).
- [ ] Reduced motion: enable OS "reduce motion" → preloader skipped, marquee stops animating (verified locally — spot-check live).

Mobile (real device, iOS Safari + Android Chrome):

- [ ] Tap-target audit follow-up (P1 #8): nav "Book a call" (90×20), footer links (16 px tall), marquee labels — confirm comfortable to tap or bump padding.
- [ ] Cal modal: opens, scrolls, closes on a real touch device (Escape unavailable — confirm the close/backdrop hit area works; `body` scroll-lock behavior).
- [ ] Review form: keyboard doesn't obscure fields, labels visible, submit works.
- [ ] Lighthouse mobile on live home (expect CLS 0, A11Y 100, SEO 100; performance will vary from lab).
- [ ] Testimonial marquee: smooth at 60 fps, pauses on touch, no horizontal page overflow.
- [ ] 404 page: enter a bad URL → friendly 404 with working "back home" navigation.

---

## E. Prashant content verification (only facts you can vouch for)

Numeric / factual claims:

- [ ] "Founded in **2026**" (stats bar + llms.txt + About).
- [ ] "**10-day** sprint cycles" (stats bar + llms.txt).
- [ ] Timeline ranges are internally consistent — pick one canonical set: landing pages **3–7 days**, web apps **2–6 weeks**, SaaS MVP **3–6 weeks**, full SaaS **4–10** or **6–10 weeks** (home says 4–10, service pages say 6–10, llms says 4–10).
- [ ] Case-study metrics: `resultsVerified` is currently `true` only for **"1,000+ installs"** (VS Code Marketplace — re-check the live count). The gated-but-unverified metrics ("3 weeks", "200+ beta users", "Hours to minutes") stay hidden until you verify them against a public source — verify and flip the flag, or leave hidden.
- [ ] **Testimonials:** confirm Yash (Let'em Know) and Manish (SS Creation) approved their quotes and job titles; only 2 reviews exist in the DB — the marquee repeats them 12× (P1 #5).
- [ ] **Client logos** in the logo marquee: permission to use each mark?
- [ ] **Portfolio live URLs** — all four return 200 today; confirm each is the permanent home (Vercel hobby deployments and `indevs.in` can lapse): `agency-v2-theta.vercel.app`, `habitflow.indevs.in`, `megablog.vercel.app`, VS Code Marketplace listing.
- [ ] **Social/sameAs links:** GitHub `Meteoric-Agency`, LinkedIn `withmeteoric`, X `@prashantkhuva_`, Instagram `officialmeteoric`, Wikidata `Q140453413`, Contra profile — each still correct and public?
- [ ] **"Serving startups and founders worldwide from India"** (llms.txt) — accurate positioning statement?
- [ ] **Author identity:** Article schema says Prashant Khuva → `/about`; the orphan `/author/prashant-khuva` page exists — either link bylines to it or drop it from the sitemap (P1 #7). Also verify the Person `sameAs` set (GitHub/LinkedIn/X/Instagram/Contra).
- [ ] **Contact path:** today `/contact` 404s while 13 posts link to it — decide the real conversion path (contact page vs Cal) and make the copy match everywhere ("Book a free strategy call" is used in FAQ schema — confirm that's still the actual CTA).
- [ ] Blog post dates/claims: spot-check `datePublished`/`dateModified` against when you actually published, especially the 2026-09-13 "50-Point Guide" (listed in llms but 404 — decide: publish or delist).

---

## F. Future SEO / Insights pages — ordered by business value

Ranked using the repo's keyword research (`memory/research/keyword-research/2026-07-06-meteoric-target-queries.md`) plus gaps found in this QA:

1. **`/contact` page** — 13 internal links already vote for it; conversion surface, not a keyword play. Cheapest broken-link fix with direct pipeline value. (P0 #1)
2. **Restore/write the 3 dead high-intent posts** (they're linked from a money page today):
   - `how-much-does-a-startup-website-cost` — **2,800/mo** target query
   - `how-to-choose-a-web-development-agency` — **800/mo**, bottom-funnel
   - `react-vs-nextjs-for-startup-websites` — feeds the Next.js service pillar
3. **`supabase-vs-firebase` comparison post** — **2,400/mo**, highest-volume keyword in the research with no dedicated page; repo already ranks the topic in llms copy.
4. **Pricing / engagement-model page** (`/pricing` or "How we price") — the research flags pricing content as the biggest GEO gap; AI engines cite pricing pages heavily; services FAQ already dances around numbers.
5. **Comparison/definition cluster for GEO** (AI engines prefer citable definitions): "What is a SaaS development agency", "Next.js development agency" definition block — pillar pages exist; add definition-style answer blocks (50–70 words, schema-aligned) at their tops.
6. **Promote the 4 weak-linked posts** (only inbound = blog index): `gsap-vs-framer-motion-production-guide`, `what-is-a-web-development-agency`, `long-tail-seo-strategy`, `startup-seo-on-a-budget` — link them from relevant services/case-study pages.
7. **`/insights` hub** — only if blog volume exceeds ~25 posts; today `/blog` covers it (13 posts). Revisit when the dead posts return and volume justifies a second taxonomy layer.
8. **Case-study depth** — one new metrics-heavy case study per verified client outcome (template exists; `resultsVerified` gate keeps unverified numbers honest).
9. **Author hub consolidation** — either grow `/author/prashant-khuva` into a real E-E-A-T hub (bio, post list, credentials) with byline links, or remove it; half-alive author pages hurt more than help.
10. **Skip for now:** separate location pages (single-brand, no GBP), programmatic city pages, and additional service pillars — the 4 unshipped pillar pages must first reach production and earn impressions (checklist B data after 30 days decides).
