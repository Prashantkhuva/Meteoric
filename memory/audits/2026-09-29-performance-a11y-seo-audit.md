# Performance / Accessibility / SEO Audit — Meteoric

**Date:** 2026-09-29
**Method:** ESLint, `tsc --noEmit`, `next build`, Lighthouse (mobile emulation, local prod server on `:3999`), Chrome trace analysis (`LayoutShift` events, long-task attribution).

## Scores: before → after

| Category | Before | After (4 consecutive runs) |
|---|---|---|
| Performance | 65 (range 27–73, noisy) | 55–68 (noisy, machine-dependent) |
| Accessibility | 87 | **100** |
| Best Practices | 73 | 73 (local-only failures, see below) |
| SEO | 100 | **100** |
| CLS | 0 normally, **0.913 intermittent** | **0** (4/4 runs) |

## Fixes applied

### Accessibility (87 → 100)
Four Lighthouse failures eliminated:
1. **aria-prohibited-attr** — SplitText wraps words in `span`s and strips ARIA; added `aria: "manual"` to all 13 `new SplitText(...)` call sites (including `type: "words"` in `ManifestoSection`).
2. **color-contrast** — removed `opacity: 0.6` from Footer copyright text.
3. **heading-order** — Footer heading changed `h4` → `h3`.
4. **link-name** — Footer social links gained `aria-label={profile.label}`; `StaggerLink` now spreads `...rest` onto the underlying `<Link>` so ARIA props pass through.

### Form labels (axe `label` / form-name rules)
- `ReviewFormModal.jsx`: 13 `htmlFor`/`id` pairs added.
- `NavBar/Step2.jsx`: 10 `htmlFor`/`id` pairs + `aria-label` on inputs (one malformed insertion fixed).

### Cumulative Layout Shift (intermittent 0.913 → 0)
Root cause: `fallbackTestimonials = []` — testimonials grid SSR'd empty, client fetch appended 2 review cards post-hydration, pushing the footer ~750px down.
- `Home.jsx` now server-fetches approved reviews (`fetch` with `next: { revalidate: 300 }`, route stays static ISR `○ 5m`) and passes `initialReviews`.
- `TestimonialsSection` seeds state from `initialReviews`; background refresh only replaces state when the count actually changes.
- Verified 24 cards in SSR HTML; 4 consecutive Lighthouse runs report CLS = 0 (only residual: preloader counter, 0.00006).

### Hero / LCP
- `HeroScene` (three.js, 975KB) deferred to `requestIdleCallback` (timeout 3500ms) with gradient `HeroFallback` in the meantime — keeps the initial long task out of the critical window without changing layout (both are `absolute inset-0`).
- Hero `run()` (SplitText + entrance timeline) runs immediately instead of waiting for idle — LCP element render delay dropped from ~1459ms to ~208ms.

### Preloader
- 15 timeline durations trimmed: total sequence ≈4.2s → ≈3.3s. Repeat visits still skip entirely via `sessionStorage` (`meteoric-preloader-seen`).

## Metrics (local Lighthouse, mobile throttling)

| Metric | Value |
|---|---|
| FCP | 1.1 s |
| LCP | 4.2–4.9 s (Lantern-simulated; first visit gated by preloader, repeat visits skip it) |
| TBT | 480–1350 ms — highly machine-dependent, see attribution below |
| CLS | 0 |
| Speed Index | 6.1–8.0 s |

**Long-task attribution (from trace):**
- `06nf8jq8f7o_g.js` (GSAP + ScrollTrigger): **496 ms** — required for preloader/hero, cannot defer.
- `2e_nm_clzgco2.js` (three.js): 189+74 ms — now mounted at 3.5s idle.
- `2zf625u-tcwdn.js` (framer-motion): 154+110 ms — pulled in eagerly by `PageTransition` in `client-layout`.
- gtag: 86+79 ms — already idle-deferred (`requestIdleCallback`, timeout 5000).

## Best Practices = 73 — all failures are local-only

| Failure | Why it's a local artifact |
|---|---|
| `errors-in-console` | `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` 404 on localhost — served by Vercel in production |
| `third-party-cookies` | `__cf_bm` cookie set by `app.cal.com/embed/embed.js` (Cal.com requires it) |
| `inspector-issues` | Same Cal.com cookie issue |
| `valid-source-maps` | three.js chunk missing source map — valid production consideration (see below) |

Production BP should read ≈92 once Vercel hosting is factored in (only source maps genuinely fail).

## Remaining recommendations (not done — effort/risk tradeoffs)

1. **Source maps** — enable `productionSourceMaps` in `next.config.mjs` to clear the last real BP failure. Cost: longer builds; this machine already hits memory limits during build.
2. **three.js bundle (975KB)** — options: desktop-only scene (mobile keeps gradient fallback), or postpone mount until after `load` + idle instead of a 3.5s timer. Largest single remaining JS payload.
3. **framer-motion chunk (223KB)** — eagerly loaded because `PageTransition` sits in `client-layout`. Could lazy-load or drop the per-route transition wrapper from the initial bundle.
4. **Cal.com embed** — warm only after user intent (click) instead of `requestIdleCallback(timeout: 2000)` to keep third-party work out of the load window.
5. **Verify on production** — local TBT/SI numbers are noisy (20+ processes on this machine). Trust Vercel SpeedInsights RUM for real-user confirmation; deploy and compare before further tuning.

## Verification

```
npm run lint        → 0 errors
npm run typecheck   → 0 errors
npm run build       → exit 0 (route / is static ISR, revalidate 300)
node scripts/lighthouse-audit.mjs http://localhost:3999
                    → a11y 100, SEO 100, CLS 0 (4 consecutive runs)
```

Note: the Lighthouse script always prints an `EPERM` Chrome-cleanup error and exits 1 — the JSON report is still written and valid; read `lighthouse-report.json`.

## Changed files (this audit)

- `src/components/layout/Footer.jsx`, `StaggerLink.jsx` — a11y fixes
- `src/components/sections/Hero.jsx`, `ManifestoSection.jsx` (+11 SplitText sites) — `aria: "manual"`, scene defer, immediate `run()`
- `src/components/sections/ReviewFormModal.jsx`, `NavBar/Step2.jsx` — labels
- `src/components/sections/TestimonialsSection.jsx`, `src/components/pages/Home.jsx` — SSR reviews / CLS fix
- `src/components/layout/Preloader.jsx` — timeline trim
