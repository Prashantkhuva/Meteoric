# Meteoric — Web Development Agency

## Stack
- **Framework:** Next.js 16 + React 19 (TypeScript/TSX, strict mode)
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
scripts/          — Build/utility scripts (proxy)
workers/          — Cloudflare Workers
└── app-download/ — Download redirect worker (app.withmeteoric.com)
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
- **Global search:** `Ctrl/⌘+K` (or `/` on non-list pages) opens `GlobalSearchPalette` → server action `globalSearch()` in `app/admin/actions.ts` (7 groups incl. Cal.com bookings, two-phase client/lead-name match, exact counts, 3s per-user memo). Mobile app calls the same logic via `POST /api/admin/search`. Result rows deep-link `?id=` on leads/clients/invoices/proposals/projects (drawer auto-opens via `get*ById` actions).

## Email (Resend)
- Test mode (`onboarding@resend.dev`) only delivers to `ADMIN_EMAIL`
- `FROM_EMAIL="Meteoric <onboarding@resend.dev>"` — must change to verified domain for production
- `ADMIN_EMAIL=contact@withmeteoric.com`
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
- `npm run lint` — ESLint (ignores `mobile` + `build` dirs)

## API Tokens
| Service | Token variable | Account/Email |
|---------|---------------|---------------|
| Supabase | `SUPABASE_ACCESS_TOKEN` | project: hlxjljckxthmtssqrzwo |
| Supabase Service Role | `SUPABASE_SERVICE_ROLE_KEY` | — |
| Cloudflare | `CLOUDFLARE_API_TOKEN` | Account: Prashantkhuva |
| Shorebird | CLI login | `work.prashantkhuva@gmail.com`, app_id: `39ba27c5-5735-4c86-a9b9-e037da640ec0` |
| Cal.com | `CALCOM_API_KEY` | — |
| Resend | `RESEND_API_KEY` | — |
| EmailJS | `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | service: `service_4nznchu`, template: `template_xx2t3io` |
| Razorpay | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | test mode |

## Flutter Mobile App (mobile/)
- **SDK:** Flutter 3.47.0 at `C:\flutter` (add `/c/flutter/flutter/bin` to PATH per session)
- **Android SDK:** `C:\Users\PRASHANT\AppData\Local\Android\sdk` (setx `ANDROID_HOME`); cmdline-tools at `sdk/cmdline-tools/latest`
- **JDK:** Temurin 21 at `C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot` (flutter config `--jdk-dir` set)
- **compileSdk:** 37 (required by flutter_secure_storage); `gradle.properties` has `kotlin.incremental=false` + `kotlin.compiler.execution.strategy=in-process` (Windows file-lock workaround for "Could not close incremental caches")
- **Release signing:** `mobile/android/key.properties` (gitignored) + `app/meteoric-release.jks` (gitignored); alias `meteoric`. Install APK = gradle `build/app/outputs/flutter-apk/app-release.apk` (v2-signed). In CI, `shorebird-release@v1` handles registration + build together (no separate local step). If building locally outside CI, use Shorebird's forked Flutter (on PATH via `~/.shorebird/bin`) so the OTA engine is embedded; stock Flutter builds have no engine at all. `shorebird releases get-apks` / `universal.apk` are legacy — invariant 2 below forbids using them.
- **OTA updates (Shorebird):** `shorebird` CLI at `~/.shorebird/bin` (add to PATH per session); logged in as `work.prashantkhuva@gmail.com`; `app_id: 39ba27c5-5735-4c86-a9b9-e037da640ec0` in `mobile/shorebird.yaml` (checked in). Workflow (CI-first): new release → tag `vX.Y.Z+N` → `shorebird-release@v1` (also uploads AAB to Play Store if ever needed); code change → tag `vX.Y.Z+N-hotfix.M` → `shorebird-patch@v1` (tiny diff, phones auto-update on next launch, no reinstall). Local entry = `npm run ship:release` / `npm run ship:patch` (bump + tag; Shorebird CLI runs only in CI). Limits: patches can't change native plugins/AndroidManifest/icons/assets — those need a new release. Bumping `pubspec.yaml` version = new release, not patch. Verify patch w/o publishing: `--dry-run`. Patches fail on icon-font diffs (new `Icons.*` glyphs change the tree-shaken font) — avoid new icons in patches or do a release.
- **MANDATORY release registration:** `shorebird release android` MUST run for every new version BEFORE uploading its APK. How the 2026-09 gap happened: release flow step 3 only said `flutter build apk` — that embeds the OTA engine (forked Flutter) so the APK *looks* fine and installs, but no release record is created server-side. Result: `shorebird patch` refuses ("Release not found") and installed phones silently no-op on every update check (engine queries, nothing found). v0.16.0→v0.19.0 shipped this way; those installs can never OTA and need a one-time reinstall. Registration state = `shorebird --json releases list | grep '"version"'` — version MUST appear before the APK upload step. First registered release after the gap: `0.20.0+15`. This is now handled automatically by the CI pipeline — `shorebird-release@v1` registers during the build step. The manual "run shorebird release android locally before APK upload" step is obsolete; CI owns registration + upload together.
- **Version tracking:** after EVERY ship (release or patch), update `mobile/lib/core/app_version.dart` — new release → bump `version` (+ `pubspec.yaml`) and reset `patch` to 0; shorebird patch → increment `patch`, leave `version`; always set `updatedAt` to ship time. Settings screen displays these.
- **CI vs local (OTA):** GitHub Actions handles all OTA releases/patches via official Shorebird composite actions (`shorebird-release@v1` / `shorebird-patch@v1`) + `shorebirdtech/setup-shorebird@v1`. Trigger = tag push (`vX.Y.Z+N` = release, `vX.Y.Z+N-hotfix.M` = patch) + `workflow_dispatch` for dry-run/override. Local prep scripts `npm run ship:release` / `npm run ship:patch` bump versions, fetch real IST, commit+push, create+push tag. Shorebird CLI runs only in CI for releases/patches — local forked-Flutter builds are no longer used for shipping. `SHOREBIRD_TOKEN` secret (fresh API key from Shorebird console) must exist in GitHub Actions secrets. Never pass `--allow-native-diffs` (native drift fails loud = do a full release instead). Never rebuild a published release from different source — always patch from the exact release commit.
- **IST time for `updatedAt`:** NEVER trust system clock. Always fetch real IST: `webfetch https://time.is/IST` → parse time from response (e.g. "06:09:28"). Format: `'12 Sep 2026 · 6:09 AM'`.

### Versioning Policy (adopted 2026-09-07)
**Format:** `MAJOR.MINOR.PATCH+BUILD` (e.g., `0.10.2+1`)
- **MAJOR (X):** Breaking API changes, new auth model, DB migration requiring reinstall
- **MINOR (y):** New features (booking filters, PDF export, bulk actions)
- **PATCH (z):** Bug fixes, performance, copy changes, styling, Dart-only logic
- **BUILD (+N):** Auto-incrementing build number (never reset; always increases)

**Shorebird patch number** (`app_version.dart` `patch` field) is separate from the `+BUILD` number. Patch increments only when an OTA ship occurs. `updatedAt` is always set to ship time.

#### Patch vs Release Decision Framework
| Change type | Ship method |
|---|---|
| Dart-only, no new native dependencies | Shorebird patch (OTA) |
| New plugin, AndroidManifest change, icon/font change, pubspec major bump | New APK release |
| Bug fix, styling, copy change, Dart logic | Shorebird patch (OTA) |
| New feature needing Play Store review | New APK release (with staged rollout via tracks) |
| Critical security fix (auth bypass, data leak) | Shorebird patch → forced upgrade via `latest.json` `min_supported_build` if needed |

#### Staged Rollout via Shorebird Tracks
CI `shorebird-patch@v1` publishes to the default (`stable`) track (no track input in the workflow). Shorebird also supports tracks (`stable`, `staging`, `beta`, custom) — created implicitly, no registration needed. Staged promotion is an optional manual path for operators, not the default ship path:
- **Day 0 (optional):** Manually publish patch to `staging` track via Shorebird console / manual CLI → test on your own device
- **Day 1 (optional):** Promote to `stable` via Shorebird console / `shorebird patches set-track`
- **For percentage-based rollouts:** Use `shorebird_code_push` v2 + cloud KV store to route devices to beta/stable tracks based on group number (1–100) vs rollout percentage. See [Shorebird % rollout guide](https://docs.shorebird.dev/code-push/guides/percentage-based-rollouts/).

```bash
# Optional manual staging/promotion (not the default CI ship path)
shorebird patch android --track=staging
# Preview locally
shorebird preview --track staging --app-id <id> --release-version <ver>
# Promote to stable when confident
shorebird patches set-track --release-version <ver> --patch-number <N> --track stable
```

#### Forced Upgrade (minimum supported version)
Add `min_supported_build` to `latest.json`. The in-app updater (`updater.dart`) already checks `remoteBuild > localBuild` — extend it to block use when `localBuild < min_supported_build` with a full-screen modal (no dismiss). Reserve for critical security only (auth bypass, data exposure).

#### Release Flow — Exact Steps (follow for every ship)

**New release (CI pipeline):**
```
1. Ensure `SHOREBIRD_TOKEN` secret exists in GitHub Actions (fresh API key from Shorebird console → Account → API Keys; NOT `shorebird login:ci` — dead since 2026-10-01).
2. From repo root: `npm run ship:release`
   - Runs `check-version.mjs` (bumps build above remote `highest_build`, writes `pubspec.yaml` + `app_version.dart`); `ship-release.mjs` resets `patch` to 0.
   - Fetches real IST from `time.is/IST`, writes `updatedAt`.
   - Commits + pushes `main`, creates + pushes annotated tag `vX.Y.Z+N`.
   - Tag push triggers `.github/workflows/mobile-release.yml` automatically.
3. Workflow: setup Shorebird (`setup-shorebird@v1`) → decode secrets → analyze+test → `shorebird-release@v1` (`--artifact apk -- --no-tree-shake-icons`, flutter-version 3.47.7) → APK-exists guard → apksigner v2 verify → versionCode > highest_build guard → upload (GitHub asset + Supabase `latest.json`) → verify download page → archive artifact → `shorebird doctor --verbose` on failure.
4. Verify: `shorebird --json releases list | grep '"version":"<X.Y.Z+N>"'` shows registered. Download page `https://app.withmeteoric.com/download` returns 200. `latest.json` shows correct build + highest_build.
5. If dry-run/validation needed: Actions → Mobile Release → Run workflow → set `dry_run=true` (or leave `false` for real).
```

**Patch release (CI pipeline, OTA):**
```
1. Ensure base version exists: `shorebird --json releases list | grep '"version":"<X.Y.Z+N>"'`
   Not found → base never registered (0.16.0-0.19.0 gap) → cannot patch; ship a NEW release instead.
2. From repo root: `npm run ship:patch`
   - Reads current `patch` from `app_version.dart`, increments by 1, fetches real IST, writes `updatedAt`.
   - Commits + pushes `main`, creates + pushes annotated tag `vX.Y.Z+N-hotfix.M` (M = new patch number).
   - Tag push triggers `.github/workflows/mobile-patch.yml` automatically.
3. Workflow: setup Shorebird → decode secrets → analyze+test → `shorebird-patch@v1` (no flutter-version pin, engine auto-resolved from named release, `-- --no-tree-shake-icons`) → `shorebird doctor --verbose` on failure.
4. Verify: Settings screen on device shows new patch number. Step summary shows Shorebird-assigned patch number — cross-check against `app_version.dart` patch field.
5. Dry-run: Actions → Mobile Patch → Run workflow → set `dry_run=true` + provide `release-version` manually (tag push can't carry dry-run flag).
```

**Key invariants (never break these):**
1. **NEVER run jarsigner** — Gradle signs with v2. jarsigner destroys it. Causes "cannot install" on Android 15+.
2. **ALWAYS use `app-release.apk`** from build output — NOT `universal.apk` from Shorebird (unsigned).
3. **ALWAYS `--no-tree-shake-icons`** — without it, MaterialIcons-Regular.otf shrinks to 15KB and icons vanish.
4. **ALWAYS verify with `apksigner verify`** before upload — takes 1 second, prevents broken releases.
5. **ALWAYS run `check-version.mjs` before build** — auto-bumps build number above all published builds. Prevents `INSTALL_FAILED_VERSION_DOWNGRADE`.
6. **ALWAYS verify `versionCode` with `aapt dump badging`** after build — must be higher than `highest_build` in latest.json.
7. **Version in `app_version.dart` MUST match `pubspec.yaml`** — updater parses build number from version string `X.Y.Z+N`.
8. **`updatedAt` must be real IST** — fetch from `webfetch https://time.is/IST`, never system clock.
9. **Work on `main` only** — other OpenCode session may be on different branch.
10. **ALWAYS verify the release is registered in `shorebird --json releases list` after the workflow finishes** — CI's `shorebird-release@v1` registers during the build, before the APK upload, but confirm the version appears before trusting the ship. Unregistered bases = permanent silent OTA failure for every installed copy (v0.16.0-v0.19.0 lesson). A local `shorebird release android` run is no longer part of shipping — CI owns registration + upload together.

**In-app updater:** app polls `latest.json` in Supabase Storage bucket `app-releases` on launch; if remote build > local, shows update banner → downloads APK from GitHub Releases with progress → installs via platform channel (`meteoric/updater` in MainActivity.kt, FileProvider + REQUEST_INSTALL_PACKAGES).

**Download link (`app.withmeteoric.com`):** Cloudflare Worker at `workers/app-download/` fetches `latest.json` from Supabase and proxies the APK. Auto-picks up new releases — no worker code changes needed unless manifest structure changes. Deploy: `cd workers/app-download && CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN npx wrangler deploy`.
- **Session persistence:** handled by supabase_flutter itself — `AuthService.init()` passes `persistSession: true` + `localStorage: SharedPreferencesLocalStorage(persistSessionKey: 'sb_session')` (`mobile/lib/core/supabase.dart`). Do NOT switch back to flutter_secure_storage for sessions (v11 silently dropped session writes on the emulator). `sb_session` lives in plain `FlutterSharedPreferences.xml`; the SDK auto-refreshes + re-persists tokens. Keep `AuthService.refreshSession()` as the 401 fallback in `ApiClient`.
- **Emulator automation gotcha:** after focusing a login field, the keyboard opens and shifts the layout — later taps land on the keyboard. Use `input keyevent 61` (TAB) to move focus and `keyevent 66` (ENTER) to submit instead of tapping the button.

## Cloudflare Worker (`workers/app-download/`)
- **Worker:** `app-download` — serves download page for Meteoric Admin APK
- **Route:** `app.withmeteoric.com/*` → fetches `latest.json` from Supabase Storage → shows download page
- **Deploy:** `cd workers/app-download && CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN npx wrangler deploy`
- **Wrangler config:** `workers/app-download/wrangler.toml` — routes `app.withmeteoric.com/*`, env var `SUPABASE_URL`
- **On every mobile release:** worker auto-picks up new `latest.json` — no code changes needed unless manifest structure changes
- **To update worker code:** edit `workers/app-download/index.js` → `wrangler deploy`

## GEO (Generative Engine Optimization)
- Goal: Get cited by ChatGPT, Claude, Perplexity, Gemini for queries about "web development agency", "SaaS development", etc.
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot (only blocks /admin and /login)
- `public/llms.txt` + `public/llms-full.txt` — curated AI crawler index (static files, the established architecture). **Update process:** whenever blog posts are added/removed/renamed (`src/data/blog-posts.ts`), a project live URL changes (`src/data/projects.ts`), or a public route is added/removed, sync both files in the same change: blog count and blog list in `llms.txt` must match published posts exactly (newest first, exact titles/slugs), portfolio/outbound project URLs must use the `liveUrl` field (canonical Habit Flow URL: `https://habitflow.indevs.in/`), and internal links must point at real routes (never anchors for pages that now exist, e.g. `/contact`). Never list drafts, previews, admin, or unpublished content. Then run `npm run build` and verify every `withmeteoric.com` URL in both files returns 200.
- **Schema markups deployed:**
  - `Organization` with `sameAs` (GitHub, LinkedIn, X, Instagram) — `app/layout.jsx`
  - `Person` for Prashant Khuva with `sameAs`, `knowsAbout`, `jobTitle` — `app/(marketing)/about/page.jsx`
  - `BreadcrumbList` on Home, Work, About pages
  - `FAQPage` (5 Q&A) — `src/components/sections/TestimonialsSection.jsx`
  - `HowTo` (4-step process) — `src/components/sections/ProcessSection.jsx`
  - `CreativeWork` (portfolio projects) — `app/(marketing)/work/page.jsx`
  - `WebSite` (publisher → Organization, no SearchAction) — `app/layout.tsx`. **No `ProfessionalService` or `LocalBusiness` entity exists anywhere** — Organization is the only business entity; do not add a second one (would conflict with the canonical Organization).
  - **No `AggregateRating` or `Review` schema is currently emitted anywhere.** This is intentional: it stays that way unless (a) independently verifiable review data exists and (b) Google eligibility requirements for the rich result are established. Structured data must always match visible page content — rule encoded in `src/lib/seo/jsonLd.js`.
- Projects: 4 portfolio items with outcome metrics in descriptions
- To run AI citation check: `node scripts/check-ai-citations.mjs`
- To submit to IndexNow (Bing/ChatGPT index): `node scripts/submit-indexnow.mjs`
- TODO: Create Wikidata entry for Meteoric (entity.simplator.com) — manual step
- [x] Create `/services/saas-development` and `/services/startup-web-development` pillar pages

## SEO/GEO/AEO Optimization Status (2026-07-07)
- [x] Canonical tags on all public pages (root layout + 7 pages)
- [x] `/services`, `/privacy`, `/terms` in sitemap
- [x] IndexNow key-file typo fixed + key file created at `public/meteoric-indexnow-key.txt`
- [x] Service pages in Footer navigation
- [x] `twitter:creator` (`@prashantkhuva_`) on all pages
- [x] `SiteNavigationElement` schema in root layout
- [x] `theme-color` (#070707) + `referrer` policy in root layout
- [x] Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages
- [x] Internal links from Work page to service pages
- [x] `security.txt` at `public/.well-known/security.txt`
- [x] Enhanced AI citation checker script (`scripts/check-ai-citations.mjs`)
- [x] Wikidata entry for Meteoric (https://www.wikidata.org/wiki/Q140453413)
- [x] Dedicated case studies section (`/case-studies`) with metrics-heavy template
- [x] Core Web Vitals audit — SpeedInsights installed & collecting RUM data on Vercel
- [x] GEO: `llms.txt` + `llms-full.txt` with answer capsules and cite-worthy content
- [x] GEO: Speakable schema for voice search (no `AggregateRating`/`Review` schema — intentional, see GEO note above)
- [x] AEO: Services page FAQ section with FAQPage JSON-LD schema
- [x] SEO: Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- [x] SEO: robots.txt allows all AI crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended)

## Research Files (memory/)
- `memory/research/content-gap-analysis/2026-07-06-meteoric-vs-competitors.md` — Full gap analysis vs Naturaily, Big Human, Superside, DePalma
- `memory/research/keyword-research/2026-07-06-meteoric-target-queries.md` — 45 keywords across 5 clusters + SERP + GEO analysis
- `memory/research/off-page-authority-plan/2026-07-08-meteoric-off-page-priority.md` — Off-page authority plan (ON HOLD): GBP, directories, HARO, GitHub, competitor backlinks
- `memory/audits/2026-07-06-internal-linking-optimizer.md` — Link score (60/100), orphan/disposition analysis, repair plan

## Key Research Findings
- **Top competitors**: Naturaily (highest overlap, same Next.js/SaaS audience), Big Human, Superside, DePalma, Standard Beagle
- **Biggest content gap**: No dedicated service pages, no comparison posts (except GSAP vs FM), no pricing content, no GEO-targeted definitions
- **Top P0 keywords**: `saas development agency` (1,900/mo), `startup web development agency` (1,800/mo), `Next.js development agency` (1,300/mo), `Supabase vs Firebase` (2,400/mo), `how to choose a web development agency` (800/mo), `startup website cost` (2,800/mo)
- **CORE-EEAT avg score**: 69/100 — strongest in Trust (80), weakest in Authority (55) and Referenceability (58)
- **Internal linking score**: 60/100 — About/Work pages are content dead ends
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
CLOUDFLARE_API_TOKEN
```

**`NEXT_PUBLIC_SITE_URL` — local vs production:**
- `.env.local` (gitignored) sets `http://localhost:3000` for local dev; `.env` (gitignored, Vercel env in prod) sets `https://withmeteoric.com`. Both currently define it — harmless but keep them consistent so share links can't diverge.
- SEO output (canonical, `og:url`, sitemap) does **not** read this variable — it uses hardcoded `SITE_URL` in `src/lib/seo/config.js` (production domain only, never deployment domains).
- `getSiteUrl()` (`src/config/site-url.js`): browser → `window.location.origin`; server → `NEXT_PUBLIC_SITE_URL` with `http://localhost:3000` fallback. Used for preview/invoice/proposal share links, transactional emails, WhatsApp share links. Never hardcode a URL into production code for these — set the env var per environment.

## Google Indexing API (Bulk Reindexing)
- **Service account key:** `C:\Users\PRASHANT\Downloads\gcp-mcp-503913-1a46f0314665.json`
- **Service account email:** `indexing-api@gcp-mcp-503913.iam.gserviceaccount.com`
- **GCP Project:** `gcp-mcp-503913`
- **Org:** `work-prashantkhuva-org` (ID: `440155376237`)
- To reindex: use the service account key with Google APIs Node.js client to call `indexing.urlNotifications.publish()` with `URL_UPDATED` type
- Daily quota: 200 URL notifications
