# Mobile Release + Patch Pipeline — Design Spec

**Date:** 2026-10-16
**Status:** Approved (brainstorming complete, implementation pending)
**Scope:** Replace local-first mobile release flow with CI-first Shorebird-powered GitHub Actions; add new OTA patch workflow; add local prep scripts for version bumping + dispatch.

---

## 1. Problem

Mobile releases currently require a 10-step local manual flow: edit versions, fetch real IST timestamp, run `shorebird release android` locally, verify signature/versionCode, build APK with forked Flutter, upload, commit. This is slow, error-prone, and blocks shipping from anywhere other than the maintainer's machine.

Patch flow is even more manual: edit `patch` field, fetch IST, run `shorebird patch` locally from the exact release commit, no automation at all.

Past CI attempt (`a5094e2` → `c781f9c`) failed because it used DIY `curl` install + PATH hacks for Shorebird CLI; installer URL 404'd, install path moved (`~/.config/shorebird`), and the whole Shorebird integration was stripped rather than fixed. The official `shorebirdtech/setup-shorebird@v1` action solves installation correctly and was not tried.

`SHOREBIRD_TOKEN` secret was deleted (2026-10-15) after old `shorebird login:ci` tokens stopped working (Shorebird killed them 2026-10-01). A fresh API key must be minted from the Shorebird console.

## 2. Goals

- Ship a new release or an OTA patch with one command from the terminal, or via GitHub Actions UI.
- CI does the long work (build, sign, upload, patch publish); local only does fast version bumping + commit + dispatch.
- No force-pushes, no automated writes to `main` from CI (other session may work concurrently).
- Preserve all existing release guards (v2 signature, versionCode monotonicity, version-match, patch-reset) and add guards for the new patch flow.
- Fail loud on every foreseeable failure mode (see §6).

## 3. Non-goals

- No CI-run tests beyond existing analyze+test gate (test suite already runs in release workflow).
- No multi-platform (iOS) support — Android only, matches current scope.
- No change to in-app updater logic (`latest.json` schema unchanged).
- No change to `scripts/check-version.mjs` bump logic beyond reusing it.
- No auto-promote between Shorebird tracks (staging → stable) — out of scope for v1 of this pipeline, may add later as a separate `workflow_dispatch`-only promote workflow if staged rollouts become a real need. Today's `stable`-only flow (devices check stable track by default, no custom track subscription code in app) is preserved.

## 4. Architecture

### Two workflows

| | `mobile-release.yml` (upgraded) | `mobile-patch.yml` (new) |
|---|---|---|
| Purpose | New base version, full APK + registration | OTA fix to existing base, no new APK |
| Trigger | Tag push `v*` (primary, official Shorebird pattern) OR `workflow_dispatch` (dry-run / manual override) | Tag push `v*-hotfix.*` (primary) OR `workflow_dispatch` |
| Build action | `shorebirdtech/shorebird-release@v1` (composite action, official) | `shorebirdtech/shorebird-patch@v1` (composite action, official) |
| Key args | `flutter-version: 3.47.7`, `args: --artifact apk -- --no-tree-shake-icons` | `release-version: <parsed from tag>`, `args: -- --no-tree-shake-icons` |
| Flutter pin | Explicit `flutter-version: 3.47.7` (matches local rev `5bef02a1…`) | None — action/CLI auto-resolves engine version from named release |
| Output APK | Yes → GitHub asset + Supabase `latest.json` (needs `--artifact apk`, see note below) | None — Shorebird infra delivers patch on next app launch |
| Version files touched | `pubspec.yaml` (build+semver bump) + `app_version.dart` (version, patch=0, updatedAt) | `app_version.dart` only (patch field +1, updatedAt) — done locally in prep script, not CI |
| Concurrency group | `mobile-release` | `mobile-patch` |
| `dry_run` input | Only via `workflow_dispatch` (tag push can't carry inputs — by design, real releases are never dry-runs) | Only via `workflow_dispatch` |

**Why tag-push trigger (not just `workflow_dispatch`):** This is Shorebird's officially recommended pattern (see "Development Workflow" guide): trunk-based dev + tags as the immutable trigger. Benefits over pure dispatch:
- Tag is a permanent, auditable pointer to the exact commit that produced the release — no "what commit did run #47 actually build?" ambiguity.
- `git tag v0.24.0+26 && git push origin main v0.24.0+26` is the entire trigger — no separate `gh workflow run` call, works from any machine with git (no gh CLI dependency for the happy path).
- Distinguishes intent by tag shape: `vX.Y.Z+N` = release, `vX.Y.Z+N-hotfix.M` = patch (matches Shorebird's `v1.0.0-hotfix.1` convention, adapted to our `+build` scheme).
- `workflow_dispatch` stays available for `dry_run=true` validation runs and rare manual overrides (e.g., re-run failed release without retagging).

**Critical note — `--artifact apk`:** Shorebird's release action defaults to building an **AAB only** (Play Store bundle). We distribute a direct-install APK via `app.withmeteoric.com` + GitHub Releases, not the Play Store — so `args` must include `--artifact apk` to produce the `.apk` file the existing upload/latest.json/download-page steps expect. Without this, the whole download-page + in-app-updater flow breaks (no APK asset to point `latest.json` at).

### Shorebird setup step (replaces failed curl/PATH attempts)

```yaml
- name: Setup Shorebird
  uses: shorebirdtech/setup-shorebird@v1
  with:
    cache: true

env:
  SHOREBIRD_TOKEN: ${{ secrets.SHOREBIRD_TOKEN }}
```

This is the fix for the past failure: official action handles install path, PATH propagation, and caching — no DIY curl, no PATH export hacks.

### Shorebird composite actions (official, replaces raw CLI invocation)

Instead of `run: shorebird release ...` as a plain shell step, use Shorebird's purpose-built composite actions — they handle output capture (`outputs.release-version` / `outputs.patch-number`), non-interactive mode, and error surfacing correctly:

```yaml
# Release workflow
- name: Shorebird release
  id: shorebird-release
  uses: shorebirdtech/shorebird-release@v1
  with:
    flutter-version: 3.47.7
    platform: android
    working-directory: ./mobile
    args: >-
      --artifact apk
      ${{ inputs.dry_run == 'true' && '--dry-run' || '' }}
      -- --no-tree-shake-icons
```

```yaml
# Patch workflow
- name: Shorebird patch
  id: shorebird-patch
  uses: shorebirdtech/shorebird-patch@v1
  with:
    platform: android
    release-version: ${{ inputs.release-version }}
    working-directory: ./mobile
    args: >-
      ${{ inputs.dry_run == 'true' && '--dry-run' || '' }}
      -- --no-tree-shake-icons
```

`outputs.release-version` (release) and `outputs.patch-number` (patch) are empty when `--dry-run` is set — normal, not an error. For real runs, both are populated and used in the step summary / verification steps below.

### Diagnostic step (catches CI-environment failures fast)

Add `shorebird doctor --verbose` as an `if: failure()`-style early diagnostic (or a manual `workflow_dispatch` input `run_doctor` defaulting false) after setup, before build. It dumps detected Android SDK, JAVA_HOME, Gradle versions — exactly what was missing when the last CI attempt failed silently and took multiple commits to diagnose. Cheap to add, high debugging value.

### Build caching (speed)

Add `cache: gradle` to `actions/setup-java` (both workflows). Gradle dependency downloads dominate build time on cold runners; caching cuts repeated release/patch cycle time significantly.

### Local prep scripts (Plan B: no CI writes to main)

Two thin Node scripts, invoked as `npm run ship:release` / `npm run ship:patch`:

**`scripts/ship-release.mjs`**
1. Run `node scripts/check-version.mjs` (existing — bumps build above remote `highest_build`, writes `pubspec.yaml` + `app_version.dart` version/build, resets `patch` to 0).
2. Fetch real IST from `https://time.is/IST`; parse time; write `updatedAt` string (e.g. `'16 Oct 2026 · 6:21 PM'`) into `app_version.dart`. Fallback if fetch fails: compute UTC+5:30 from local clock, print loud warning.
3. `git add mobile/pubspec.yaml mobile/lib/core/app_version.dart` only (refuse if these two files have unstaged changes already — don't sweep unrelated dirty work).
4. `git pull --rebase origin main` then `git commit -m "chore(mobile): vX.Y.Z+N — <auto description>"` then `git push origin main`. Abort clean if push rejected (race with other session).
5. Create annotated tag `vX.Y.Z+N` (full version including build number, e.g. `v0.24.0+26`) from the just-pushed commit and `git push origin v0.24.0+26`. **Tag push is what triggers the release workflow** — no `gh workflow run` needed for the happy path.
6. `gh run watch $(gh run list --workflow=mobile-release.yml --limit=1 --json databaseId --jq '.[0].databaseId') --exit-status` to tail the run to completion (optional — the user can also just watch the Actions UI).

**`scripts/ship-patch.mjs`**
1. Read current `patch` integer from `app_version.dart` (grep `patch = N`).
2. Read `version` string from `app_version.dart` (must match `pubspec.yaml` version — existing guard).
3. Increment `patch` by 1; fetch real IST (same fallback as release); write both fields into `app_version.dart` (leave `version` unchanged, leave `pubspec.yaml` unchanged).
4. `git add mobile/lib/core/app_version.dart` only; rebase; commit `chore(mobile): patch N — OTA fix`; push.
5. Create annotated tag `vX.Y.Z+N-hotfix.M` where `M` = new patch number (e.g. `v0.23.0+25-hotfix.1`) from the just-pushed commit and push it. **Tag push triggers the patch workflow**, which parses `release-version` and `patch-number` from the tag shape — no `gh workflow run` needed.
6. `gh run watch ...` (same optional tail as release).

Both scripts run from repo root, use `execFileSync`/`spawnSync` for git/gh commands, exit non-zero on any guard failure, print step-by-step progress, and print the created tag name prominently so the user can verify it matches intent before/after the push.

### New workflow guards

**Release workflow (`mobile-release.yml`)** — existing guards kept, plus:
- New guard step: `SHOREBIRD_TOKEN` env var non-empty → fail with clear message if secret missing.
- `flutter build apk` step replaced by `shorebirdtech/shorebird-release@v1` composite action (not a raw `run:` shell step — action handles non-interactive mode, output capture, error surfacing correctly). Same working dir `./mobile`, same `--no-tree-shake-icons` flag (passed after `--` separator), plus required `--artifact apk`.
- **New guard — APK must exist after build:** immediately after the Shorebird step, `test -f mobile/build/app/outputs/flutter-apk/app-release.apk` (or wherever `--artifact apk` places it — confirm actual path on first dry-run; Flutter's default is `build/app/outputs/flutter-apk/app-release.apk`). Fail loud if missing — catches the "forgot `--artifact apk`, only got AAB" failure before the later upload step would fail anyway (fail-early, not fail-late).
- Existing steps after build (apksigner verify, aapt versionCode check, upload, latest.json verify, tag, artifact archive, step summary) unchanged.
- `shorebird doctor --verbose` available as an `if: failure()` diagnostic step (dumps JAVA_HOME, Android SDK, Gradle detection) — cheap debugging aid for CI-environment issues, which is exactly what broke the last attempt.

**Patch workflow (`mobile-patch.yml`)** — new file, structure mirrors `mobile-release.yml` up through quality gate, then diverges:

1. Checkout, read versions, verify `pubspec.yaml` version == `app_version.dart` version (existing guard pattern).
2. New guard: `app_version.dart` `patch` field > 0 → fail if 0 (patch workflow must not run for a fresh release).
3. New guard: `SHOREBIRD_TOKEN` non-empty.
4. Setup Java 17, Android SDK guard, `flutter analyze` + `flutter test` (same quality gate as release — catches regressions before patching).
5. Decode keystore + key.properties + google-services.json (same base64 secrets as release — `shorebird patch` runs `flutter build` internally, needs signing).
6. `shorebirdtech/shorebird-patch@v1` composite action (working dir `./mobile`), with `release-version` input + `-- --no-tree-shake-icons` in `args`.
   - `dry_run` input: when `true`, appends `--dry-run` via the action's `args` (no publish, validates everything else). Default `false` for normal operation. `outputs.patch-number` will be empty on dry-run — normal, not an error.
   - `release-version` is a required `workflow_dispatch` input; prep script validates format `X.Y.Z+N` locally before dispatching, and the action/CLI re-validates against Shorebird's release list.
   - Action auto-detects engine Flutter version from the named release — no `flutter-version` input needed (unlike the release action).
   - Fails loud with "Release not found" if version is wrong/nonexistent.
   - Native code drift since release: Shorebird refuses unless `--allow-native-diffs`; we never pass that flag → fails loud → correct action is a new release.
7. Capture patch number from `steps.shorebird-patch.outputs.patch-number` (official action output — no stdout parsing needed).
8. Write patch number + release-version to `$GITHUB_STEP_SUMMARY`.
9. `shorebird doctor --verbose` on `if: failure()` — same diagnostic value as release workflow.
10. No APK build, no apksigner, no aapt, no latest.json update, no GitHub asset upload — patch is delivered entirely by Shorebird infra.
11. No git tag, no commit from CI (version bump already committed locally by `ship-patch.mjs`).

### Trigger ergonomics (Plan C, upgraded to tag-push primary)

- **CLI (happy path):** `npm run ship:release` / `npm run ship:patch` → prep script bumps versions, commits, pushes, creates + pushes tag → tag push triggers the corresponding workflow automatically. No separate `gh workflow run` call needed.
- **UI (happy path):** same — create tag from GitHub UI (Releases → Draft a new release → tag `vX.Y.Z+N` or `vX.Y.Z+N-hotfix.M` → publish) → tag push triggers workflow.
- **UI / CLI (dry-run or manual re-run only):** GitHub → Actions → "Mobile Release" / "Mobile Patch" → "Run workflow" → fill `dry_run=true` or `notes`/`min_build`/`release-version` manually. This path exists only for validation runs and rare overrides; real releases/patches always go through tag push.
- Workflow files remain the single source of truth; scripts are thin wrappers around git + gh — no logic duplication.

### Tag → input parsing (in-workflow, no local parsing needed)

Both workflows parse their needed inputs from `github.ref_name` (the tag) so `workflow_dispatch` isn't the only way to supply them:

- `mobile-release.yml` on tag push: `TAG=${GITHUB_REF_NAME}` (e.g. `v0.24.0+26`) → strip `v` → `FULL=0.24.0+26`, `SEMVER=0.24.0`, `BUILD=26`. Guard: tag must match regex `^v[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+$` — fail loud if not (prevents accidentally pushing a non-release tag like `v-test` and triggering a release).
- `mobile-patch.yml` on tag push: `TAG=${GITHUB_REF_NAME}` (e.g. `v0.23.0+25-hotfix.1`) → parse `RELEASE_VERSION=0.23.0+25`, `PATCH_NUMBER=1`. Guard: must match `^v[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+-hotfix\.[0-9]+$`.
- `workflow_dispatch` path still accepts explicit inputs (`release-version`, `notes`, `min_build`, `dry_run`) for override/dry-run cases; when both a tag and explicit inputs are present (e.g. someone dispatches with a ref that's also a tag), explicit input wins (documented in workflow comments).

## 5. Secrets

| Secret | Value | Where used |
|---|---|---|
| `SHOREBIRD_TOKEN` | Fresh API key from Shorebird console (Account → API Keys → Create). NOT a `shorebird login:ci` token — those are dead since 2026-10-01. | Both workflows, `env.SHOREBIRD_TOKEN` |
| `ANDROID_KEYSTORE_BASE64` | Existing | Both workflows |
| `KEY_PROPERTIES_B64` | Existing | Both workflows |
| `GOOGLE_SERVICES_JSON_B64` | Existing | Both workflows |
| `RELEASE_REPO_TOKEN` | Existing (GitHub PAT for `meteoric-app-releases` repo asset upload) | Release workflow only |
| `NEXT_PUBLIC_SUPABASE_URL` | Existing | Release workflow only |
| `SUPABASE_SERVICE_ROLE_KEY` | Existing | Release workflow only (latest.json update) |

`SHOREBIRD_TOKEN` must be created by the maintainer (secret value never exposed to the agent/logs); agent adds it to GitHub secrets via `gh secret set` once provided.

## 6. Failure modes & guards (complete list)

| # | Failure | Guard / handling |
|---|---|---|
| 1 | `SHOREBIRD_TOKEN` secret missing | Fail-fast guard step before build: check env var non-empty, abort with message naming the secret. |
| 2 | `SHOREBIRD_TOKEN` invalid / expired | Shorebird CLI surfaces auth error in step log; step fails; no partial publish (Shorebird CLI validates auth before uploading). |
| 3 | `pubspec.yaml` version ≠ `app_version.dart` version | Existing guard (release), mirrored into patch workflow. |
| 4 | `patch` field ≠ 0 on a release run | Existing guard (release). |
| 5 | `patch` field = 0 on a patch run | New guard — that's a release, not a patch. Abort. |
| 6 | `versionCode` ≤ `highest_build` in `latest.json` | Existing guard (release); N/A for patch (no new APK / no versionCode change). |
| 7 | Patch targets nonexistent / wrong `release-version` | Shorebird CLI fails with "Release not found" — loud, no partial state. |
| 8 | Native code changed since base release | Shorebird refuses without `--allow-native-diffs`; we never pass that flag → fails loud → correct action is a full release. |
| 9 | Flutter engine version drift (local dev vs CI) | Release pins `--flutter-version=3.47.7` (matches local Shorebird fork rev `5bef02a1…`). Patch auto-resolves engine from named release. |
| 10 | Two concurrent dispatches of same workflow | `concurrency: group: mobile-release` / `mobile-patch`, `cancel-in-progress: false` — runs queue, never race. |
| 11 | Prep script push rejected (other session committed) | `git pull --rebase` before push; abort clean with message if still rejected — never force-push. |
| 12 | Prep script finds version files already dirty | Refuse to stage — don't sweep unrelated work. |
| 13 | `time.is` unreachable during IST fetch | Fallback: compute UTC+5:30 from system clock, print loud warning (deviation from "never trust system clock" rule, but better than aborting the whole prep for a timestamp). |
| 14 | Runner missing `ANDROID_HOME` / build-tools | Existing guard (both workflows). |
| 15 | Keystore / google-services.json secret missing or empty | Existing guard in decode step (both workflows). |
| 16 | `apksigner` shows `jarsigner` / no v2 scheme | Existing guard (release). |
| 17 | Download page returns non-200 after upload | Existing guard (release). |
| 18 | Actual Shorebird patch number ≠ locally incremented `patch` field | Workflow writes Shorebird-assigned number to step summary; maintainer cross-checks Settings screen on device. Not auto-reconciled (would require a CI write to `main`). |
| 19 | `gh` CLI not authenticated locally | Prep script fails fast with clear message (`gh auth login` needed). Only needed for the optional `gh run watch` tail step, not for the tag-push happy path. |
| 20 | `shorebird` CLI not in `PATH` on CI runner | Solved by `setup-shorebird@v1` action (fixes root cause of past failure `c8e36db`). |
| 21 | Tag pushed doesn't match expected regex (e.g. `v-test`, `v1.0`, `v1.0.0` without `+build`) | Workflow guard step parses `GITHUB_REF_NAME`, validates against `^v[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+$` (release) / `^v[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+-hotfix\.[0-9]+$` (patch) — fail loud before any build starts, so a stray tag never triggers a half-done release. |
| 22 | Tag exists but points at wrong commit (e.g. moved after push) | Prep script creates tag from the exact commit it just pushed (`git tag <name> HEAD`) and pushes both together — no window for the tag to diverge from the intended commit. |
| 23 | Same version tag pushed twice (re-release attempt) | Git refuses duplicate tag push (non-fast-forward) — prep script's `git push origin <tag>` fails clean; if someone force-moves a tag manually, Shorebird itself also refuses a duplicate release-version registration. |
| 24 | `--artifact apk` flag omitted / APK not produced | New guard: `test -f` APK path immediately after Shorebird release step (see §4) — fail before apksigner/upload steps, not deep into the workflow. |
| 25 | Patch tag parsed but `app_version.dart` patch field doesn't match hotfix number in tag | Prep script sets both from the same increment (tag number == new patch field) — divergence would require manual tag edit after the fact; workflow guard cross-checks parsed tag number against `app_version.dart` value read from checkout. |

## 7. Testing strategy

- **Dry-run first:** dispatch `mobile-patch.yml` via `workflow_dispatch` with `dry_run=true` (the only way to dry-run — tag push can't carry this flag, by design). Validates install, auth, engine detection, signing, without publishing. Run once before first real patch. Same for `mobile-release.yml` if desired.
- **Unit-ish validation of prep scripts:** run `ship-patch.mjs` on a throwaway branch with a fake version bump; verify `app_version.dart` diff is correct (patch+1, new IST) and tag name matches `vX.Y.Z+N-hotfix.M` pattern before the tag push happens (script prints tag name before pushing — review it). Same for `ship-release.mjs`.
- **Tag-regex guard drill:** push a deliberately malformed tag (e.g. `v-test`) from a scratch state, verify workflow fails loud with the regex-guard message before any build starts (guard #21). Delete the bad tag after.
- **First real patch as end-to-end validation:** ship a trivial Dart-only change (copy tweak) via `npm run ship:patch`; verify on physical device (`adb logcat | grep -i shorebird`, cold start) that patch arrives.
- **Release validation:** next real release (whenever it naturally occurs) goes through `npm run ship:release`; verify APK installs, `shorebird --json releases list` shows registered version, `latest.json` bumped.
- **Guard drills:** intentionally trigger guards 3, 5, 7, 12 in a scratch branch / bad tag input to confirm they fail loud with correct message (each one, once).

## 8. Rollout order

1. Maintainer mints new `SHOREBIRD_TOKEN` API key from Shorebird console → provides to agent.
2. Agent writes `mobile-release.yml` upgrade + `mobile-patch.yml` + `ship-release.mjs` + `ship-patch.mjs` + npm aliases; updates AGENTS.md release/patch flow section.
3. Add `SHOREBIRD_TOKEN` GitHub secret; run guard drill #3/#5/#7/#12 on a scratch branch.
4. Dry-run `mobile-patch.yml` (no publish) — validates Shorebird CI install/auth/engine-detection end-to-end.
5. Ship first real OTA patch (trivial Dart change) via `npm run ship:patch`; verify on device.
6. Next real release ships via `npm run ship:release`.

## 9. Files touched

| File | Change |
|---|---|
| `.github/workflows/mobile-release.yml` | Upgrade: add `setup-shorebird@v1` step, replace `flutter build apk` with `shorebirdtech/shorebird-release@v1` composite action (`--artifact apk`), add `SHOREBIRD_TOKEN` guard step, add tag-regex guard + tag→input parsing (`GITHUB_REF_NAME`), add `cache: gradle`, add `shorebird doctor --verbose` on failure, add post-build APK-exists guard. |
| `.github/workflows/mobile-patch.yml` | New file — full patch workflow per §4 (tag-push `v*-hotfix.*` + `workflow_dispatch` triggers, `shorebirdtech/shorebird-patch@v1`, tag-regex guard, doctor-on-failure). |
| `scripts/ship-release.mjs` | New — local prep (bump + IST + commit + push) + tag create/push + optional `gh run watch`. |
| `scripts/ship-patch.mjs` | New — local prep (patch+1 + IST + commit + push) + `v*-hotfix.*` tag create/push + optional `gh run watch`. |
| `package.json` | Add `ship:release` and `ship:patch` npm scripts. |
| `AGENTS.md` | Replace manual 10-step release flow section + patch flow section with new pipeline description; update "CI vs local (OTA)" bullet (CI now does OTA via official actions + tag-push trigger). |
| `docs/superpowers/specs/2026-10-16-mobile-release-patch-pipeline-design.md` | This spec. |
| `docs/superpowers/plans/2026-10-16-mobile-release-patch-pipeline-plan.md` | Implementation plan (written next, via writing-plans skill). |

## 10. Open questions resolved

- **Where does Shorebird live?** CI (Plan B), using official `setup-shorebird@v1` + `shorebird-release@v1`/`shorebird-patch@v1` composite actions — not DIY curl, not raw `run: shorebird ...` shell steps.
- **Who bumps version in patch flow?** Local prep script (Plan B) — no CI writes to `main`.
- **Trigger mechanism?** Tag push (primary, official Shorebird pattern: `vX.Y.Z+N` = release, `vX.Y.Z+N-hotfix.M` = patch) + `workflow_dispatch` kept for dry-run/validation and rare overrides (Plan C retained for that fallback path).
- **Flutter version pin?** `3.47.7` explicit on release; auto-resolved on patch.
- **What if `time.is` is down?** Computed fallback + loud warning.
- **Patch number mismatch?** Surfaced in job summary, manually cross-checked — no auto-reconcile (would need CI write to `main`).
- **APK artifact type?** Must pass `--artifact apk` to Shorebird release action — default is AAB-only, which would break the existing download-page/in-app-updater flow that depends on a real `.apk` file. New post-build guard confirms the APK exists before proceeding.
