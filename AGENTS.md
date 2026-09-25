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
- `npm run generate:sitemap` — Rebuild sitemap

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
- **JDK:** Temurin 21 at `C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot` (flutter config `--jdk-dir` set)
- **compileSdk:** 37 (required by flutter_secure_storage); `gradle.properties` has `kotlin.incremental=false` + `kotlin.compiler.execution.strategy=in-process` (Windows file-lock workaround for "Could not close incremental caches")
- **Release signing:** `mobile/android/key.properties` (gitignored) + `app/meteoric-release.jks` (gitignored); alias `meteoric`. Install APK = gradle `build/app/outputs/flutter-apk/app-release.apk` (v2-signed), built AFTER `shorebird release android` (see release flow). Build with Shorebird's forked Flutter (on PATH via `~/.shorebird/bin`) so the OTA engine is embedded; stock Flutter builds have no engine at all. `shorebird releases get-apks` / `universal.apk` are legacy — invariant 2 below forbids using them.
- **OTA updates (Shorebird):** `shorebird` CLI at `~/.shorebird/bin` (add to PATH per session); logged in as `work.prashantkhuva@gmail.com`; `app_id: 39ba27c5-5735-4c86-a9b9-e037da640ec0` in `mobile/shorebird.yaml` (checked in). Workflow: new release → `shorebird release android` (also uploads AAB to Play Store if ever needed); code change → `shorebird patch android --release-version 0.1.0+1` (tiny diff, phones auto-update on next launch, no reinstall). Limits: patches can't change native plugins/AndroidManifest/icons/assets — those need a new release. Bumping `pubspec.yaml` version = new release, not patch. Verify patch w/o publishing: `--dry-run`. Patches fail on icon-font diffs (new `Icons.*` glyphs change the tree-shaken font) — avoid new icons in patches or do a release.
- **MANDATORY release registration:** `shorebird release android` MUST run for every new version BEFORE uploading its APK. How the 2026-09 gap happened: release flow step 3 only said `flutter build apk` — that embeds the OTA engine (forked Flutter) so the APK *looks* fine and installs, but no release record is created server-side. Result: `shorebird patch` refuses ("Release not found") and installed phones silently no-op on every update check (engine queries, nothing found). v0.16.0→v0.19.0 shipped this way; those installs can never OTA and need a one-time reinstall. Registration state = `shorebird --json releases list | grep '"version"'` — version MUST appear before the APK upload step. First registered release after the gap: `0.20.0+15`.
- **Version tracking:** after EVERY ship (release or patch), update `mobile/lib/core/app_version.dart` — new release → bump `version` (+ `pubspec.yaml`) and reset `patch` to 0; shorebird patch → increment `patch`, leave `version`; always set `updatedAt` to ship time. Settings screen displays these.
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
Shorebird supports tracks (`stable`, `staging`, `beta`, custom) — created implicitly, no registration needed.
- **Day 0:** Publish patch to `staging` track → test on your own device
- **Day 1:** Promote to `stable` via `shorebird patches set-track` or Shorebird Console
- **For percentage-based rollouts:** Use `shorebird_code_push` v2 + cloud KV store to route devices to beta/stable tracks based on group number (1–100) vs rollout percentage. See [Shorebird % rollout guide](https://docs.shorebird.dev/code-push/guides/percentage-based-rollouts/).

```bash
# Publish to staging first
shorebird patch android --track=staging
# Preview locally
shorebird preview --track staging --app-id <id> --release-version <ver>
# Promote to stable when confident
shorebird patches set-track --release-version <ver> --patch-number <N> --track stable
```

#### Forced Upgrade (minimum supported version)
Add `min_supported_build` to `latest.json`. The in-app updater (`updater.dart`) already checks `remoteBuild > localBuild` — extend it to block use when `localBuild < min_supported_build` with a full-screen modal (no dismiss). Reserve for critical security only (auth bypass, data exposure).

#### Release Flow — Exact Steps (follow for every ship)

**New release:**
```
1. Run version guard (auto-bumps build number above all published builds)
   node scripts/check-version.mjs
   This fetches latest.json, reads highest_build, and writes max(remote, local) + 1
   into both pubspec.yaml and app_version.dart.

2. Edit mobile/lib/core/app_version.dart
   - patch: 0                ← reset to 0
   - updatedAt: '17 Sep 2026 · 5:19 PM'  ← real IST from webfetch https://time.is/IST

3. REGISTER the release with Shorebird (MANDATORY — skip = OTA silently dead,
   patch impossible; this is how v0.16.0-v0.19.0 shipped broken)
   export PATH="$HOME/.shorebird/bin:$PATH"
   cd mobile
   shorebird release android
   (publishes artifacts to Shorebird; builds AAB at build/app/outputs/bundle/release/)
   VERIFY registration BEFORE building the install APK:
   shorebird --json releases list | grep '"version":"<X.Y.Z+N>"'
   MUST find the version. If "Release not found" → stop, fix, do not upload.

4. Build install APK (gradle, v2-signed; forked Flutter = OTA engine embedded)
   (PATH already contains shorebird's flutter after step 3's export)
   cd mobile
   flutter build apk --release --no-tree-shake-icons

5. VERIFY signature (MANDATORY — skip = Android 15/16 install fails)
   "C:/Users/PRASHANT/AppData/Local/Android/sdk/build-tools/37.0.0/apksigner.bat" verify --verbose mobile/build/app/outputs/flutter-apk/app-release.apk
   MUST show: "Verified using v2 scheme (APK Signature Scheme v2): true"
   MUST NOT show: jarsigner anywhere

6. VERIFY versionCode (MANDATORY — skip = INSTALL_FAILED_VERSION_DOWNGRADE)
   "C:/Users/PRASHANT/AppData/Local/Android/sdk/build-tools/37.0.0/aapt.exe" dump badging mobile/build/app/outputs/flutter-apk/app-release.apk | grep versionCode
   MUST show versionCode higher than highest_build from step 1.

7. Upload
   cd ..
   node scripts/upload-app-release.mjs mobile/build/app/outputs/flutter-apk/app-release.apk 0.17.0 <N> "Release notes here"
   (The script auto-sets highest_build = max(highest_build, N) in latest.json)

8. Verify manifest
   curl -s "https://hlxjljckxthmtssqrzwo.supabase.co/storage/v1/object/public/app-releases/latest.json"
   MUST show correct build number, highest_build, and URL

9. Verify download page
   curl -sI "https://app.withmeteoric.com/download"
   MUST show: Content-Type: application/vnd.android.package-archive

10. git add mobile/pubspec.yaml mobile/lib/core/app_version.dart
   git commit -m "chore(mobile): v0.17.0+N — description"
   git push origin main
```

**Patch release (Shorebird OTA):**
```
0. PRECHECK (MANDATORY — patch fails without it): the base version must exist
   shorebird --json releases list | grep '"version":"<X.Y.Z+N>"'
   Not found → base was never registered (0.16.0-0.19.0 gap) → cannot patch;
   ship a NEW release instead (flow above). Installed phones on an unregistered
   base need a one-time reinstall — no OTA path exists for them.

1. Edit mobile/lib/core/app_version.dart
   - patch: 1                ← increment (leave version unchanged)
   - updatedAt: timestamp    ← real IST from time.is/IST

2. cd mobile
   shorebird patch android --release-version <X.Y.Z+N>
   Add --dry-run first to preview without publishing.

3. git add mobile/lib/core/app_version.dart
   git commit -m "patch(mobile): v0.17.0+1 patch 1"
   git push origin main
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
10. **ALWAYS run `shorebird release android` for every new version and VERIFY it appears in `shorebird --json releases list` BEFORE uploading the APK** — forked-Flutter builds embed the OTA engine even without registration, so a broken ship looks identical to a working one until someone tries to patch. Unregistered bases = permanent silent OTA failure for every installed copy (v0.16.0-v0.19.0 lesson).

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
- `public/llms.txt` — curated AI crawler index with all pages, projects, stats, and citation guidelines
- **Schema markups deployed:**
  - `Organization` with `sameAs` (GitHub, LinkedIn, X, Instagram) — `app/layout.jsx`
  - `Person` for Prashant Khuva with `sameAs`, `knowsAbout`, `jobTitle` — `app/(marketing)/about/page.jsx`
  - `BreadcrumbList` on Home, Work, About pages
  - `Review` (star ratings) + `FAQPage` (5 Q&A) — `src/components/sections/TestimonialsSection.jsx`
  - `HowTo` (4-step process) — `src/components/sections/ProcessSection.jsx`
  - `CreativeWork` (portfolio projects) — `app/(marketing)/work/page.jsx`
  - `ProfessionalService` + `WebSite` with `SearchAction` — `app/layout.jsx`
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
- [x] GEO: Speakable schema for voice search, AggregateRating on Organization
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

## Google Indexing API (Bulk Reindexing)
- **Service account key:** `C:\Users\PRASHANT\Downloads\gcp-mcp-503913-1a46f0314665.json`
- **Service account email:** `indexing-api@gcp-mcp-503913.iam.gserviceaccount.com`
- **GCP Project:** `gcp-mcp-503913`
- **Org:** `work-prashantkhuva-org` (ID: `440155376237`)
- To reindex: use the service account key with Google APIs Node.js client to call `indexing.urlNotifications.publish()` with `URL_UPDATED` type
- Daily quota: 200 URL notifications
