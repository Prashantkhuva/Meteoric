# CLS 0.91 Regression — Root Cause and Fix (2026-09-30)

## Summary

The intermittent Cumulative Layout Shift of 0.9125 on the home page (roughly 2 runs in 14 under Lighthouse) is fixed. Root cause: the root `app/loading.jsx` forced every marketing page to be prerendered as a Suspense shell with an empty `<main>`, so the footer was painted at the top of the document and then pushed down ~7,857px when the real content was promoted at the end of body. The fix removes the root loading boundary (content now prerendered inline) and adds an explicit `<Suspense>` around `AdminShell`, which had been relying on the root loading file for its `useSearchParams` bailout.

## Timeline of diagnosis

1. **Trace capture.** Lighthouse run with `--save-assets` (writes `<report>-0.trace.json`) caught a `LayoutShift` at trace timestamp 7149047475 with score 0.9125151883353585. Impacted node was the page footer: old rect `[0,72,412,843]`, new rect `[0,0,0,0]`.
2. **Playwright reproduction.** Temp script `cls-hydra2.mjs` (CDP CPU throttle 4x, DPR 2.625, mobile/touch) reproduced shift 0.9213 at ~1264ms with the same footer source. Frame timeline showed `docH=915, mainH=0, footTop=72` at t≈142ms (main empty, footer at page top) flipping to `docH=8921, mainH=7857, footTop=7929` at t≈1135ms.
3. **Built HTML inspection.** `.next/server/app/index.html` contained `<main id="main-content"><!--$?--><template id="B:0"></template>` plus the `app/loading.jsx` fallback overlay (`z-[9970]`, `preload-sweep`) and no page content. The real content lived in `<div hidden id="S:0">` later in the document and was moved into place by `$RC("B:0","S:0")` at the very end of the body. All 55 marketing pages showed the same suspended shell (`main` ≈ 958 bytes); admin, login, and editor pages were already inlined.
4. **Why it was intermittent.** The shift registers only when the browser paints the fallback (shell + footer at top) before the parser reaches the end of body and runs `$RC`. On fast local loads the full ~250KB document often arrives before first paint, so no shift is observed; under Lighthouse throttling the race usually lost, producing 0.91.

## Fix

- **Deleted `app/loading.jsx`** (backup: `%TEMP%/opencode/app-loading.jsx.bak`). With no root loading boundary, Next prerenders page content directly into `<main>`. Verified after rebuild: 0 of 55 pages contain `<!--$?-->`; home `<main>` is 175,793 bytes inline with all 24 testimonial articles present.
- **`app/admin/layout.jsx`**: wrapped `AdminShell` in `<Suspense fallback={<div className="min-h-screen" />}>`. `AdminShell` calls `useSearchParams()` and previously passed the build-time CSR bailout check only because the root `loading.jsx` provided an implicit Suspense boundary. First rebuild after the deletion failed with `useSearchParams() should be wrapped in a suspense boundary at page "/admin/clients"`; this wrapper fixed it.
- Navigation UX without a root `loading.jsx` is covered by the existing `RouteCurtain` route-change overlay; verified with a Playwright click-through (`/` → `/work` → back): correct URLs, titles, no JS errors.

## Verification (all after rebuild + server restart)

| Check | Result |
|---|---|
| `npm run build` | 80/80 static pages, exit 0 |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| Built HTML suspended shells | 0/55 |
| Route smoke (`/ /work /about /privacy /services /login`) | all 200, no `z-[9970]` fallback, no `<!--$?-->`; `/admin/leads` 307 → login (auth guard, expected) |

### Lighthouse (localhost:3999, mobile, 3 consecutive runs)

| Run | CLS | FCP | LCP | TBT | PERF | A11Y | BP | SEO |
|---|---|---|---|---|---|---|---|---|
| g1 | 0.00006 | 1.23s | 4.88s | 618ms | 59 | 100 | 73 | 100 |
| g2 | 0.00006 | 1.22s | 4.81s | 1030ms | 59 | 100 | 73 | 100 |
| g3 | 0.00006 | 1.22s | 4.51s | 952ms | 56 | 100 | 73 | 100 |
| **median** | **0.00006** | **1.22s** | **4.81s** | **952ms** | **59** | **100** | **73** | **100** |

CLS 0.00006 is the preloader percentage counter only (was 0 before the preloader change and 0.9125 at worst during the regression).

### Playwright CPU-throttle repro (`cls-hydra2.mjs`, 4x CPU throttle)

5/5 runs: total CLS 0.0000 (previously 0.9213 on first run). No page errors.

### Known non-regressions (unchanged from prior audit)

- BP 73: `third-party-cookies` (cal.com embed), `errors-in-console` + `inspector-issues` (`/_vercel/insights/*` 404 on localhost — Vercel-only scripts). Same baseline as previous audit runs (73).
- PERF ~56–59 mobile throttled: eager JS ~988KB raw, framer-motion chunk 224KB kept by design; TBT ~950ms pre-existing.
- One intermediate Lighthouse batch (5 runs, CLS ≈ 0.15, A11Y 94) was contaminated by a stale-HTML/chunk race while the server was serving references to a missing CSS chunk (`2vp6f4b2k_r5x.css`, request status -1) — an artifact of running Lighthouse during/around the rebuild sequence, not a real regression. After a clean restart, all CSS requests returned 200 and A11Y returned to 100.

## Files changed

- `app/loading.jsx` — deleted (root Suspense boundary that caused the streaming shell).
- `app/admin/layout.jsx` — explicit `<Suspense>` around `AdminShell`.

## Follow-ups (not addressed)

- TBT ~950ms / LCP ~4.8s on throttled mobile: candidates are hero/StatsBar animation cost and eager section JS; separate performance pass.
- BP 73 will not clear until Vercel analytics 404s are excluded from localhost audits (or an LH flag ignores localhost-only requests).
