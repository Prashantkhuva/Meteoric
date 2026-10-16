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

- No auto-trigger on tag push (workflow_dispatch only, per Q3 decision C: UI + CLI wrapper both available).
- No CI-run tests beyond existing analyze+test gate (test suite already runs in release workflow).
- No multi-platform (iOS) support — Android only, matches current scope.
- No change to in-app updater logic (`latest.json` schema unchanged).
- No change to `scripts/check-version.mjs` bump logic beyond reusing it.

## 4. Architecture

### Two workflows

| | `mobile-release.yml` (upgraded) | `mobile-patch.yml` (new) |
|---|---|---|
| Purpose | New base version, full APK + registration | OTA fix to existing base, no new APK |
| Trigger | `workflow_dispatch` (UI or `gh workflow run`) | `workflow_dispatch` |
| Build command | `shorebird release android --flutter-version=3.47.7 --no-tree-shake-icons` | `shorebird patch android --release-version=<input> --no-tree-shake-icons` |
| Flutter pin | Explicit `--flutter-version=3.47.7` (matches local rev `5bef02a1…`) | None — Shorebird CLI reads engine version from named release |
| Output APK | Yes → GitHub asset + Supabase `latest.json` | None — Shorebird infra delivers patch on next app launch |
| Version files touched | `pubspec.yaml` (build+semver bump) + `app_version.dart` (version, patch=0, updatedAt) | `app_version.dart` only (patch field +1, updatedAt) — done locally in prep script, not CI |
| Concurrency group | `mobile-release` | `mobile-patch` |
| `dry_run` input | When `true`, appends `--dry-run` to shorebird command (no publish/upload/latest.json bump) | When `true`, appends `--dry-run` to shorebird patch command (no publish) |

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

### Local prep scripts (Plan B: no CI writes to main)

Two thin Node scripts, invoked as `npm run ship:release` / `npm run ship:patch`:

**`scripts/ship-release.mjs`**
1. Run `node scripts/check-version.mjs` (existing — bumps build above remote `highest_build`, writes `pubspec.yaml` + `app_version.dart` version/build, resets `patch` to 0).
2. Fetch real IST from `https://time.is/IST`; parse time; write `updatedAt` string (e.g. `'16 Oct 2026 · 6:21 PM'`) into `app_version.dart`. Fallback if fetch fails: compute UTC+5:30 from local clock, print loud warning.
3. `git add mobile/pubspec.yaml mobile/lib/core/app_version.dart` only (refuse if these two files have unstaged changes already — don't sweep unrelated dirty work).
4. `git pull --rebase origin main` then `git commit -m "chore(mobile): vX.Y.Z+N — <auto description>"` then `git push origin main`. Abort clean if push rejected (race with other session).
5. `gh workflow run mobile-release.yml -f notes="<user-supplied or empty>"` then `gh run watch <run-id> --exit-status`.

**`scripts/ship-patch.mjs`**
1. Read current `patch` integer from `app_version.dart` (grep `patch = N`).
2. Read `version` string from `app_version.dart` (must match `pubspec.yaml` version — existing guard).
3. Increment `patch` by 1; fetch real IST (same fallback as release); write both fields into `app_version.dart` (leave `version` unchanged, leave `pubspec.yaml` unchanged).
4. `git add mobile/lib/core/app_version.dart` only; rebase; commit `chore(mobile): patch N — OTA fix`; push.
5. `gh workflow run mobile-patch.yml -f release-version="<X.Y.Z+N from pubspec>"` then `gh run watch`.

Both scripts run from repo root, use `execFileSync`/`spawnSync` for git/gh commands, exit non-zero on any guard failure, print step-by-step progress.

### New workflow guards

**Release workflow (`mobile-release.yml`)** — existing guards kept, plus:
- New guard step: `SHOREBIRD_TOKEN` env var non-empty → fail with clear message if secret missing.
- `flutter build apk` step replaced by `shorebird release android` step (same working dir `mobile/`, same `--no-tree-shake-icons` flag).
- Existing steps after build (apksigner verify, aapt versionCode check, upload, latest.json verify, tag, artifact archive, step summary) unchanged.

**Patch workflow (`mobile-patch.yml`)** — new file, structure mirrors `mobile-release.yml` up through quality gate, then diverges:

1. Checkout, read versions, verify `pubspec.yaml` version == `app_version.dart` version (existing guard pattern).
2. New guard: `app_version.dart` `patch` field > 0 → fail if 0 (patch workflow must not run for a fresh release).
3. New guard: `SHOREBIRD_TOKEN` non-empty.
4. Setup Java 17, Android SDK guard, `flutter analyze` + `flutter test` (same quality gate as release — catches regressions before patching).
5. Decode keystore + key.properties + google-services.json (same base64 secrets as release — `shorebird patch` runs `flutter build` internally, needs signing).
6. `shorebird patch android --release-version="${{ inputs.release-version }}" --no-tree-shake-icons` (working dir `mobile/`).
   - `dry_run` input: when `true`, appends `--dry-run` to the command (no publish, validates everything else). Default `false` for normal operation.
   - `--release-version` is required input; validates format `X.Y.Z+N` locally before calling Shorebird.
   - Shorebird CLI auto-detects engine Flutter version from the named release — no `--flutter-version` needed.
   - Fails loud with "Release not found" if version is wrong/nonexistent.
   - Native code drift since release: Shorebird refuses unless `--allow-native-diffs`; we never pass that flag → fails loud → correct action is a new release.
7. Capture patch number from Shorebird CLI output (action also exposes `outputs.patch-number`; prefer action output, fallback to parsing CLI stdout).
8. Write patch number + release-version to `$GITHUB_STEP_SUMMARY`.
9. No APK build, no apksigner, no aapt, no latest.json update, no GitHub asset upload — patch is delivered entirely by Shorebird infra.
10. No git tag, no commit from CI (version bump already committed locally by `ship-patch.mjs`).

### Trigger ergonomics (Plan C: UI + CLI)

- **CLI:** `npm run ship:release` / `npm run ship:patch` → prep script → `gh workflow run` → `gh run watch`.
- **UI:** GitHub → Actions → "Mobile Release" / "Mobile Patch" → "Run workflow" → fill inputs (`notes`, `min_build` for release; `release-version` for patch).
- Workflow files are the single source of truth; scripts are thin wrappers that call `gh workflow run` — no logic duplication.

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
| 19 | `gh` CLI not authenticated locally | Prep script fails fast with clear message (`gh auth login` needed). |
| 20 | `shorebird` CLI not in `PATH` on CI runner | Solved by `setup-shorebird@v1` action (fixes root cause of past failure `c8e36db`). |

## 7. Testing strategy

- **Dry-run first:** `mobile-patch.yml` takes a `dry_run` boolean `workflow_dispatch` input (default `true` for the first validation dispatch, flip to `false` for real publishes; release workflow takes the same input). When true, appends `--dry-run` to the `shorebird` command — validates install, auth, engine detection, signing, without publishing. Run once with `dry_run=true` before first real patch.
- **Unit-ish validation of prep scripts:** run `ship-patch.mjs` on a throwaway branch with a fake version bump; verify `app_version.dart` diff is correct (patch+1, new IST) before dispatching. Same for `ship-release.mjs`.
- **First real patch as end-to-end validation:** ship a trivial Dart-only change (copy tweak) via `ship-patch.mjs`; verify on physical device (`adb logcat | grep -i shorebird`, cold start) that patch arrives.
- **Release validation:** next real release (whenever it naturally occurs) goes through `ship-release.mjs`; verify APK installs, `shorebird --json releases list` shows registered version, `latest.json` bumped.
- **Guard drills:** intentionally trigger guards 3, 5, 7, 12 in a scratch branch / bad dispatch input to confirm they fail loud with correct message (each one, once).

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
| `.github/workflows/mobile-release.yml` | Upgrade: add `setup-shorebird@v1` step, replace `flutter build apk` with `shorebird release android`, add `SHOREBIRD_TOKEN` guard step. |
| `.github/workflows/mobile-patch.yml` | New file — full patch workflow per §4. |
| `scripts/ship-release.mjs` | New — local prep + dispatch for release. |
| `scripts/ship-patch.mjs` | New — local prep + dispatch for patch. |
| `package.json` | Add `ship:release` and `ship:patch` npm scripts. |
| `AGENTS.md` | Replace manual 10-step release flow section + patch flow section with new pipeline description; update "CI vs local (OTA)" bullet (CI can now do OTA via official action). |
| `docs/superpowers/specs/2026-10-16-mobile-release-patch-pipeline-design.md` | This spec. |
| `docs/superpowers/plans/2026-10-16-mobile-release-patch-pipeline-plan.md` | Implementation plan (written next, via writing-plans skill). |

## 10. Open questions resolved

- **Where does Shorebird live?** CI (Plan B), using official `setup-shorebird@v1` — not DIY curl.
- **Who bumps version in patch flow?** Local prep script (Plan B) — no CI writes to `main`.
- **Trigger ergonomics?** Both UI and CLI (Plan C) — workflow is source of truth, script is thin `gh workflow run` wrapper.
- **Flutter version pin?** `3.47.7` explicit on release; auto-resolved on patch.
- **What if `time.is` is down?** Computed fallback + loud warning.
- **Patch number mismatch?** Surfaced in job summary, manually cross-checked — no auto-reconcile (would need CI write to `main`).
