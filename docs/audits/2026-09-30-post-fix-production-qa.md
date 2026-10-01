# Post-Fix Production QA — Validation Report

**Date:** 2026-09-30 (session continued 2026-10-01 IST)
**Branch:** `seo-aeo-geo-improvements` @ `a9e9bd5` (snapshot — see §2)
**Scope:** Validate every P0/P1 fix against a local production build, review the three file deletions, run all checks, and recommend commit groups. No git commit/push/merge/reset/clean, no secret changes, no deployment were performed.
**Method:** `next build` + `next start` on port 3999, Playwright scans (3 viewports × 13 pages), sitemap-wide internal link crawl, JSON-LD parsing, file-level diff review, repository status inspection.

---

## 1. Executive summary & verdict

**Verdict: SAFE TO DEPLOY — conditional.** Git/production parity (P0 #3) is the **only P0 operational blocker** and must be cleared first (rebase duplicates, commit working tree, push, deploy 38-URL sitemap + new robots). Testimonial duplication (P1 #5) is a **known deferred P1 technical-debt item, not a deployment blocker — approved by the founder** (Prashant Khuva, 2026-10-01). It is not marked PASS; it stays visibly open with follow-up conditions (see §4 #5).

| Open item | Severity | Type |
|---|---|---|
| Git/production parity (P0 #3): 55 modified + 3 deleted + 20 untracked files uncommitted; branch 5 ahead / 5 behind `origin/main` with rebased duplicates of 4 email commits; production sitemap still 33 URLs vs local 38; parallel session actively committing to this branch — **only P0 operational blocker** | P0 | Operational |
| P1 #5 testimonial marquee SSR duplication — **DEFERRED — intentional visual-design trade-off**, founder-approved, known technical debt (see §4 #5) | P1 | Deferred technical debt / not a deploy blocker |

Everything else verified fixed: P0 #1, P0 #2, P0 #4, P1 #6, P1 #7, P1 #8 all **PASS** with evidence below. Build/lint/typecheck clean. 0 broken internal links across 38 pages. AI citation checker 16/16 (100%).

**P1 #5 disposition (founder-approved deferral, not PASS):** Meteoric's source data contains three genuine testimonial records; two carry `approved` status, are homepage-eligible, and are rendered in the marquee (the third record is excluded by the approved-only query). The homepage SSR output contains 24 cards representing two unique rendered quotes. The marquee intentionally repeats visual cards to preserve visual continuity while the testimonial set is small. Duplicate content remains in server-rendered HTML, so this should be revisited once at least 6–8 approved testimonials are available or when the marquee is refactored to create visual clones client-side after hydration. No fake testimonials, fabricated client identities, false ratings, `AggregateRating` schema, or `Review` schema are used; existing `aria-hidden` handling ensures screen readers hear each testimonial once (indexable HTML duplication is not mitigated by `aria-hidden`). Known deferred P1 technical-debt item — not a deployment blocker. **Count audit (2026-10-01, read-only):** total records in `reviews` = **3** (`approved` = 2, `rejected` = 1); homepage-eligible = **2** (query filter `status=eq.approved`, no cap in component); SSR = **24 cards**; unique SSR quotes = **2**.

## 2. Environment & concurrency notes

- Local prod build: `NODE_OPTIONS=--max-old-space-size=6144 npm run build` → success; `npx next start -p 3999`.
- `npm run lint` clean; `npx tsc --noEmit` exit 0 (after all edits).
- **Parallel session warning:** a second session committed `a9e9bd5 feat(cal): custom booking modal shell…` at 2026-10-01 06:03:52 IST *during* this review (HEAD moved from `657df32` mid-session). That commit swept in working-tree versions of `Navbar.jsx`, `ServiceLanding.jsx`, `TestimonialsSection.jsx`, `Footer.jsx` — including tap-target fixes made earlier in this session (verified: `min-h-6` present in committed `Navbar.jsx`, 4 occurrences, identical to working tree). Working tree still holds all other QA fixes. Any further parallel commits can re-split this state; snapshot numbers below may drift.
- Baseline audit referenced by the task as `docs/audits/2026-09-30-final-production-qa.md` actually lives at `memory/audits/2026-09-30-final-production-qa.md` (path discrepancy — this report is the first file under the new `docs/audits/` directory).

## 3. P0 verdicts (baseline numbering)

| # | Finding | Verdict | Evidence this session |
|---|---------|---------|----------------------|
| 1 | 404s from internal links (`/contact` missing; 3 dead blog URLs from `/services/startup-web-development`) | **PASS — fixed** | `/contact` → 200, in sitemap (38 URLs total), has nav/main#main-content/footer, canonical+og:url = `https://withmeteoric.com/contact`. Sitemap-wide crawl: 38 pages → 46 unique internal targets → **0 broken**. Startup service page renders **0** `/blog/…` links; `ServiceLanding.jsx` filters `relatedBlogPosts` against published posts (`relatedPosts.length > 0` guard + fallback UI when configured-but-missing). Data check: all remaining `relatedBlogPosts` slugs (3) resolve to real posts, 0 dangling. |
| 2 | `llms.txt` out of sync (false "20 posts", 7 dead URLs, dual HabitFlow) | **PASS — fixed** | `llms.txt`: "Blog (13 posts…)" = actual 13 posts = sitemap 13 `/blog/` entries. All 22 internal `withmelon…withmeteoric.com` URLs → **200** locally; `llms-full.txt` 9 internal URLs → **200**. Dead slugs gone from both files (dead refs remain only as data comments and in `boost-blog-scores.mjs` historical tooling — not rendered; `submit-indexnow.mjs` explicitly lists them as removed). HabitFlow single canonical `https://habitflow.indevs.in/` in both files (verified 200). No localhost/preview/secret strings (vercel.app entries = client portfolio `liveUrl`s, all 200). |
| 3 | Production behind repository | **OPEN — operational** | Local: sitemap **38** URLs all `https://withmeteoric.com`; production: **33**; production `robots.txt` still lacks `/preview` + `/share` disallows. Repo: **55 M + 3 D + 20 ??** uncommitted; branch **5 ahead / 5 behind** origin (4 email commits exist on both sides with different SHAs — rebase/cherry-pick duplication — plus local-only `a9e9bd5` and origin-only `5823e55 chore(mobile): v0.20.1+18`). Deploy + push out of scope for this task. |
| 4 | `/editorial-policy` rendered without site chrome | **PASS — fixed (re-verified)** | HTML: `<nav>` present, `<main id="main-content">` present, `<footer>` present, zero `<!--$?-->` Suspense shells, zero `z-[9970]` loading overlay. `/editor` is a real route (`app/editor/page.jsx`, title "Editor \| Meteoric", 200); `/editor/editorial-policy` → 404 (no overlap). Segment-exact check in `app/client-layout.jsx` holds. |

## 4. P1 verdicts (baseline numbering)

| # | Finding | Verdict | Evidence this session |
|---|---------|---------|----------------------|
| 5 | Testimonial marquee duplicates each review 12× in SSR HTML | **DEFERRED — intentional visual-design trade-off** | **Explanation:** Meteoric's source data contains three genuine testimonial records; two carry `approved` status, are homepage-eligible, and are rendered in the marquee (the third record is excluded by the approved-only query). The homepage SSR output contains 24 cards representing two unique rendered quotes. The marquee intentionally repeats visual cards to preserve visual continuity while the testimonial set is small. Duplicate content remains in server-rendered HTML, so this should be revisited once at least 6–8 approved testimonials are available or when the marquee is refactored to create visual clones client-side after hydration. **Counts (read-only audit 2026-10-01):** total `reviews` records = **3** (approved 2, rejected 1); homepage-eligible = **2**; SSR cards = **24** (2 unique quotes × 6 sets × 2 rows, re-verified on local build); unique SSR quotes = **2**. **Technical evidence (unchanged):** home server-renders via `getInitialReviews()` in `Home.jsx:36` (Supabase REST `reviews?status=eq.approved`); baseline found the same 24/2 split. **Accessibility mitigation:** row-1 clone cards and row-2 container carry `aria-hidden`, so screen readers hear each testimonial once (semantic `<article>/<blockquote>/<cite>/<footer>` card, `clone` prop, `src/data/testimonials.ts` module with `mapReviewRow`). **Schema:** no `Review` schema and no `AggregateRating` schema anywhere on the site — verified; no fake reviews or fabricated client identities. **Explicit follow-up conditions:** (a) revisit after collecting **6–8 approved testimonials**; OR (b) revisit during the **next marquee/animation redesign**; OR (c) revisit if **Search Console shows homepage quality/indexing issues**. Status: known deferred P1 technical debt, founder-approved (Prashant Khuva, 2026-10-01), not a deployment blocker — **not marked PASS**. |
| 6 | HowTo schema step names ≠ visible process steps | **PASS — fixed** | Homepage JSON-LD `HowTo.step` names = **Kickoff, Design, Development, Launch**; visible process section `<h3>`s = **Kickoff, Design, Development, Launch** — exact match 4/4. Shared source: untracked `src/data/process-steps.ts` consumed by `app/(marketing)/page.jsx` + `ProcessSection.jsx`. |
| 7 | `/author/prashant-khuva` orphan | **PASS — fixed** | Inbound links from **14 pages** (all 13 blog posts ×2 occurrences + `/editorial-policy` ×2); blog byline renders `<a href="/author/prashant-khuva">Prashant Khuva</a>`; page in sitemap (verified); JSON-LD now includes **ProfilePage** (subclass of WebPage — resolves baseline's "missing WebPage" note) + Person + BreadcrumbList; Article `author.@id` = `https://withmeteoric.com/#prashant-khuva` consistent with `/about`. **Residual (minor):** Article `author.url` still `https://withmeteoric.com/about` (per-post data field) — defensible (entity home) but author page would be the better target. |
| 8 | Mobile tap targets < 24×24 | **PASS — fixed (re-verified after 6 additional fixes)** | Full scan **3 viewports (390×844 touch, 768×1024 touch, 1280×800) × 13 pages**: `must-fix = 0` everywhere; `inline-exempt = 16/page` (WCAG 2.5.8 inline-in-sentence exception); **overflow = none** (incl. `/case-studies` — `overflow-x: clip` on `html, body` in `src/index.css` neutralises ScrollReveal `x:+32` pre-hydration offset); open-hamburger menu: **0 undersized**; skip link on Tab: **133.7×36** at (16,16). First harness run this session exposed 6 real misses my earlier "0" claim had skipped — all fixed: blog detail back links ×2 + byline link + related-links CTA (`app/(marketing)/blog/[slug]/page.jsx`), scroll-pill logo links ×2 (`Navbar.jsx` `min-h-6`) — then re-verified clean after rebuild. Marquee reduced-motion contract unchanged (verified earlier: animation none, opacity 1). |

## 5. P2 status (baseline informational list)

| Item | Status |
|---|---|
| Cal.com modal behavior | Unchanged verification pending checklist D; booking CTAs now route through committed `openCalModal` store (`a9e9bd5`). |
| Review form native-only validation | Unchanged (open, minor). |
| `og.jpg` `max-age=0` | Unchanged (open, minor). |
| Timeline claims inconsistency (4–10 vs 3–6 vs 6–10 weeks) | Unchanged → checklist E. |
| Stale `AGENTS.md` GEO/Review-schema claim | **FIXED** — line corrected to "No AggregateRating/Review schema emitted anywhere, intentional" + rule reference (`src/lib/seo/jsonLd.js`); GEO checklist line corrected; `NEXT_PUBLIC_SITE_URL` local/prod behavior documented in AGENTS.md + `.env.example` (env files themselves untouched). |
| Duplicate `NEXT_PUBLIC_SITE_URL` in `.env`/`.env.local` | **Documented, not modified** (secret-file rule). |
| Repo-root artifact pollution | **FIXED** — `.gitignore` now covers `*.tsbuildinfo`, `lh-*.json`, `lighthouse-report*.json`, `shift-before/after*.jpeg`, `shot-cal.mjs`, `probe*.mjs`; `git check-ignore` verified; `tsconfig.json` + `next-env.d.ts` remain tracked-intended (not ignored). |

## 6. Deletion review (Part 2)

| Deleted file | Replacement | Verdict |
|---|---|---|
| `public/robots.txt` | `app/robots.js` (Next metadata route) | **SAFE.** Served live at `/robots.txt` (200): `Allow: /`; disallows `/admin /login /editor /preview /share /*?q=` — superset of old file (old lacked preview/share); `Sitemap: https://withmeteoric.com/sitemap.xml` via hardcoded `SITE_URL`. No localhost/preview domains. Per-bot blocks of old file were all identical to wildcard → behavior equivalent. Note: production's Cloudflare content-signals preamble not reproduced (cosmetic). |
| `jsconfig.json` | `tsconfig.json` (new, untracked — must commit) | **SAFE.** Alias `"@/*": ["./src/*"]` preserved verbatim; `allowJs: true` covers JS/JSX; `typescript@^7.0.2` + `@types/*` added to devDependencies with `typecheck` script; `tsc --noEmit` exit 0; production build succeeds; all `@/`-aliased routes render 200. |
| `app/loading.jsx` | Route-curtain navigation overlay + `PageTransition.jsx` enter animation; `app/admin/layout.jsx` got explicit `<Suspense>` around `AdminShell` | **SAFE (documented rationale).** Root loading boundary forced all 55 marketing pages to prerender as empty Suspense shells → footer painted at top → CLS 0.9125 (full diagnosis in `memory/audits/2026-09-30-cls-fix-suspense-streaming.md`; backup `%TEMP%/opencode/app-loading.jsx.bak`). Post-fix re-verified this session: 0 Suspense shells in served HTML (`/editorial-policy` checked explicitly), build 0-of-55 suspended. `app/admin/loading.jsx` (segment-specific) still present. Navigation UX gap covered by `RouteCurtain` + `PageTransition`. |

## 7. New & untracked files inventory (must be in some commit)

Pages/routes: `app/(marketing)/contact/`, `app/(marketing)/nextjs-development-agency/`, `app/(marketing)/saas-mvp-development/`, `app/(marketing)/startup-landing-page-design/`, `app/(marketing)/web-app-development/` (the 4 pillar pages = P0 #3 prod-404 fix), `app/login/layout.jsx`, `app/robots.js`.
Components/data: `src/components/pages/Contact.jsx`, `src/components/pages/ServiceIntentLanding.jsx`, `src/components/seo/`, `src/data/process-steps.ts`, `src/data/service-intents.ts`, `src/lib/work-type.js`.
Tooling/config: `tsconfig.json`, `next-env.d.ts`.
Docs: `docs/case-study-template.md`, `memory/audits/2026-09-29-performance-a11y-seo-audit.md`, `memory/audits/2026-09-30-cls-fix-suspense-streaming.md`, `memory/audits/2026-09-30-final-production-qa.md`, `memory/audits/2026-09-30-launch-checklists.md`, plus this report `docs/audits/2026-09-30-post-fix-production-qa.md`.
Root temp probes `probe*.mjs` now gitignored — do not commit.

## 8. Route & landmark validation

| Check | Result |
|---|---|
| `/contact` | 200; `<nav>` 1+, `<main id="main-content">`, `<footer>` 1+; unique title; canonical = `og:url` = `https://withmeteoric.com/contact`; h1 = "Let's talk about your project"; in sitemap. |
| `/editorial-policy` | 200; nav/main/footer all present; no Suspense shell; in sitemap. |
| `/editor` | 200 (real route); `/editor/editorial-policy` 404 — no collision. |
| Author page | 200; canonical/og:url correct; in sitemap. |
| Sampled pillar + service pages | canonical/og:url all `https://withmeteoric.com/…` correct (`/saas-mvp-development`, `/services/saas-development`). |

## 9. Domain & SEO integrity

- Sitemap: **38/38** URLs on `https://withmeteoric.com` (0 localhost, 0 vercel.app, 0 deployment domains).
- Canonical + `og:url` sampled on `/`, `/work`, `/services/saas-development`, `/author/prashant-khuva`, `/saas-mvp-development` — all prod-domain, all equal.
- JSON-LD `@id`s: `https://withmeteoric.com/#organization`, `#website`, `#prashant-khuva` — prod-domain only.
- Zero `localhost:3000`/`localhost:3999` occurrences in served HTML for `/`, `/blog`, `/contact`, `/editorial-policy`.
- `next.config.mjs` adds defense-in-depth: `X-Robots-Tag: noindex, nofollow` on `/preview /share /admin /login /editor` + permanent redirect of `withmeteoric.vercel.app` host → prod domain.
- Production comparison: live sitemap still 33 (stale) → deploy required (P0 #3).

## 10. Structured-data & content parity

- HowTo ↔ visible process: **4/4 exact match** (P1 #6).
- Homepage FAQ schema ↔ visible accordion: matches (baseline re-affirmed, no regression).
- Author/Article person graph coherent (see §4 #7 residual on `author.url`).
- Testimonials SSR duplication: **24 articles / 2 unique** — unchanged (P1 #5 open).
- No `AggregateRating`/`Review` schema anywhere — intentional, now also documented in `AGENTS.md`.

## 11. Accessibility verification

- Tap targets: `must-fix=0` (3 viewports × 13 pages); inline-exempt prose links per WCAG 2.5.8 inline exception; skip link focused 133.7×36; open-menu targets all ≥24; no horizontal overflow anywhere (incl. `/case-studies` at 390/768).
- Landmarks/skip: `#main-content` target present on checked pages; skip works on Tab from fresh load.
- Reduced motion: marquee `animation: none`, preloader skipped, sections opacity 1 (verified earlier this session against `src/index.css` contract; `index.css` unchanged since).
- Testimonial clones + row 2 `aria-hidden` → screen readers hear each quote once.

## 12. Internal links & content references

- Crawl: 38 sitemap pages → 46 unique internal targets → **0 broken** (any status ≠ 200/307/308).
- Dead slug references remaining in repo (report-only, not rendered): `src/data/blog-posts.ts` `furtherReading` fields (no consumer found — grep shows definitions only), comment block in `src/data/services.ts`, historical `scripts/boost-blog-scores.mjs`; `scripts/submit-indexnow.mjs` documents their removal.

## 13. Checks & tooling results

| Check | Result |
|---|---|
| `npm run lint` | clean (exit 0) |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` (6 GB heap) | success — all routes, static/SSG listing printed |
| `node scripts/check-ai-citations.mjs` | **16/16 (100%)** Google+Bing citation rate |
| `node scripts/seo-checks.mjs` | **not run** — targets `https://withmeteoric.com` (stale production), would measure pre-deploy state and mislead |
| Playwright tap-target scan (custom) | must-fix=0 / overflow=0 / menu-open=0 / skip 133.7×36 |

## 14. Residual findings & out-of-scope defects (report only — not fixed)

1. **Footer social icons render empty** — `StaggerLink` → `StaggerText` drops JSX children (`content = text || (typeof children === "string" ? children : "")` → `""`), so footer X/Instagram/GitHub anchors contain only `<span class="st-word"></span>` (aria-labels intact). Pre-existing (changes to those files this session were tap-target-only; baseline did not flag it). Needs a follow-up: either render icons outside `StaggerText` or add an icon mode.
2. **`Projects.jsx` heading split** wraps visible links in `.split-line` with `aria: "manual"` (`Projects.jsx:74`) — check whether `.split-line` carries `aria-hidden` in CSS; baseline noted accessible-name risk.
3. **Homepage has no featured/latest post link** (only nav/footer `/blog` links) — content-consistency claim from baseline section, not among P0/P1.
4. **Blog index renders file order, not date-desc** — newest post (`startup-seo…`, 2026-09-10) is defined last and appears last; llms.txt ordering (newest-first) is correct, index UI ordering is not.
5. Article `author.url` → `/about` (see §4 #7).
6. P1 #5 testimonials — **DEFERRED — intentional visual-design trade-off**, founder-approved known technical debt with follow-up conditions (§4 #5); explicitly not PASS, explicitly not a deploy blocker.

## 15. Recommended commit groups (Part 7 — recommendation only; nothing staged/committed)

Working tree = 55 M + 3 D + 20 ?? (78 entries) at snapshot. Suggested grouping (each independently buildable):

1. **chore(repo): toolchain + hygiene** — `tsconfig.json`, `next-env.d.ts`, delete `jsconfig.json`, `package.json`, `package-lock.json`, `.gitignore`, `AGENTS.md`, `.env.example`.
2. **feat(seo): contact route + editorial chrome + robots migration** — `app/(marketing)/contact/`, `src/components/pages/Contact.jsx`, delete `public/robots.txt` + add `app/robots.js`, `app/client-layout.jsx` (segment-exact editor check), `app/admin/layout.jsx` (Suspense), delete `app/loading.jsx`, `src/components/layout/Preloader.jsx`, `src/components/layout/PageTransition.jsx`.
3. **feat(seo): pillar pages + service intents + sitemap** — 4 pillar dirs, `src/components/pages/ServiceIntentLanding.jsx`, `src/data/service-intents.ts`, `src/lib/work-type.js`, `app/(marketing)/services/[slug]/page.jsx`, `app/sitemap.js`, `scripts/generate-sitemap.mjs`, `next.config.mjs`, `src/lib/seo/config.js`, `src/lib/seo/jsonLd.js`, `src/components/seo/`.
4. **fix(content): dead links + llms sync + related-blog guards** — `src/data/blog-posts.ts`, `src/data/services.ts`, `public/llms.txt`, `public/llms-full.txt`, `scripts/submit-indexnow.mjs`, `src/components/pages/ServiceLanding.jsx`, `src/data/faqs.ts`.
5. **feat(a11y): tap targets + overflow + semantics** — `src/index.css`, `src/components/layout/Navbar.jsx`, `StaggerLink.jsx`, `StaggerText.jsx`, `app/(marketing)/blog/[slug]/page.jsx`, `src/components/pages/BlogContent.jsx`, `CaseStudies.jsx`, `CaseStudy.jsx`, `Work.jsx`, `src/components/sections/*` (Projects, Services, ClientLogoMarquee, Manifesto, FaqAccordion, ReviewFormModal), marketing page files with min-h/landmark edits, `src/components/pages/About.jsx` (if not swept into `a9e9bd5`).
6. **feat(a11y): HowTo/process parity + author hub** — `src/data/process-steps.ts`, `src/components/sections/ProcessSection.jsx`, `app/(marketing)/page.jsx`, `app/(marketing)/author/prashant-khuva/page.jsx`, `src/data/projects.ts`, `src/data/case-studies.ts`.
7. **chore(docs): audits + templates** — `docs/case-study-template.md`, `memory/audits/*.md` (4 new), `docs/audits/2026-09-30-post-fix-production-qa.md`.

**Before any commit:** reconcile with the parallel session (it is committing to the same branch), then `git pull --rebase origin main` to collapse the 4 duplicated email commits (local `657df32/12a5cc0/57164c1/f7db358` vs origin `a78670c/764f316/a8f117a/d9a661b`), then stage by group with explicit paths (never `git add -A` — root `probe*.mjs` now ignored anyway).

## 16. Commands & confirmations

Commands run this session (representative): `git status/log/diff/show/check-ignore/ls-files/rev-list` (read-only), `git fetch`-free comparison against `origin/main`; `npm run lint`; `npx tsc --noEmit`; `NODE_OPTIONS=--max-old-space-size=6144 npm run build`; `npx next start -p 3999` (+ PowerShell port-3999 teardown between rebuilds); `node scripts/check-ai-citations.mjs`; Playwright scans via `C:\Users\PRASHANT\AppData\Local\Temp\opencode\tap\{measure,scan-full}.mjs`; curl + Node one-liners against `localhost:3999` and live portfolio/production URLs.

**Confirmations:**
- ❌ No `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git clean`, or `git stash` was executed.
- ❌ Nothing staged (`git diff --cached` empty).
- ❌ `.env` / `.env.local` untouched (only `.env.example` comment block + `AGENTS.md` documentation added).
- ❌ No deployment performed.
- ✅ Only file modifications this session: source fixes (tap targets, overflow), hygiene (`.gitignore`, `AGENTS.md`, `.env.example`), and reports under `docs/audits/`.
- ✅ **Deferral-recording update (P1 #5):** touched **only** this file (`docs/audits/2026-09-30-post-fix-production-qa.md`). No testimonial rendering, marquee behavior, testimonial data, schema, SEO code, or visual design was modified; no git history commands run.
- ✅ **Consistency audit (P1 #5 counts, read-only):** database access was available — read-only Supabase REST query (`reviews?select=status`, publishable key from `.env`, no secrets written to this file) returned **3 records: 2 `approved`, 1 `rejected`**. Homepage-eligible = approved only (`getInitialReviews()` filter, `TestimonialsSection` applies no cap); live local SSR re-verified **24 `<article>` cards, 2 unique quotes**. Original wording "three genuine approved testimonials" corrected to "three genuine testimonial records; two approved/homepage-eligible/rendered". Baseline (`memory/audits/2026-09-30-final-production-qa.md`) independently reports the same 24/2 split — no correction needed there (read-only). Observation only: `src/data/testimonials.ts` header comment claims the marquee "renders empty until approved reviews" — stale vs. the 2 live approved rows; not fixed here (source-code change out of scope). This update touched only this report file; no source code, env files, or git history modified; no git pull/commit/push/rebase/merge/reset/clean/stash or deploy commands run.
