#!/usr/bin/env node
// ship-patch.mjs — Prep an OTA patch: increment patch field, fetch IST,
// commit+push, create+push tag vX.Y.Z+N-hotfix.M. Tag push triggers mobile-patch.yml.
//
// Usage: npm run ship:patch   (or: node scripts/ship-patch.mjs)
//
// Requires: git. Optional: gh CLI (for run watch tail — happy path works without it).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_VERSION = join(ROOT, "mobile", "lib", "core", "app_version.dart");
const PUBSPEC = join(ROOT, "mobile", "pubspec.yaml");

function run(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  return execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: "pipe", ...opts });
}

function runInherit(cmd, args) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit" });
}

function die(message, e) {
  const detail = typeof e?.stderr === "string" ? e.stderr.trim() : e?.message;
  if (detail) console.error(detail);
  console.error(message);
  process.exit(1);
}

// Guard: app_version.dart must not already be dirty (patches touch only this file).
const status = run("git", ["status", "--porcelain", "mobile/lib/core/app_version.dart"]);
if (status.trim()) {
  console.error("Error: mobile/lib/core/app_version.dart already dirty. Commit/stash first.");
  process.exit(1);
}

// 1. Read current version + patch from app_version.dart.
const appVersion = readFileSync(APP_VERSION, "utf8");
const versionMatch = appVersion.match(/version = '([^']+)'/);
const patchMatch = appVersion.match(/patch = (\d+)/);
if (!versionMatch || !patchMatch) {
  console.error("Error: could not parse version/patch from app_version.dart");
  process.exit(1);
}
const VERSION = versionMatch[1]; // e.g. "0.23.0+25"
const CURRENT_PATCH = parseInt(patchMatch[1], 10);
const NEW_PATCH = CURRENT_PATCH + 1;
console.log(`Current: version=${VERSION}, patch=${CURRENT_PATCH}`);
console.log(`New patch: ${NEW_PATCH}`);

// Guard: pubspec version must match app_version.dart version.
const pubspec = readFileSync(PUBSPEC, "utf8");
const pubspecVersion = pubspec.match(/^version:\s*(.+)/m)?.[1]?.trim();
if (pubspecVersion !== VERSION) {
  console.error(`Error: pubspec.yaml (${pubspecVersion}) != app_version.dart (${VERSION}). Fix first.`);
  process.exit(1);
}

// 2. Fetch real IST (same fallback as release).
console.log("\n=== Step 1: Fetch real IST ===");
let istTimeStr;
try {
  const res = await fetch("https://time.is/IST");
  const html = await res.text();
  const timeMatch = html.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i);
  if (!timeMatch) throw new Error("could not parse time from time.is response");
  let [, h, m, , ampm] = timeMatch;
  h = parseInt(h, 10);
  const h12 = h % 12 || 12;
  istTimeStr = `${h12}:${m} ${ampm.toUpperCase()}`;
  console.log(`Fetched IST time: ${istTimeStr}`);
} catch (e) {
  // Fallback: compute UTC+5:30 from system clock (loud warning).
  console.warn(`WARNING: time.is fetch failed (${e.message}) — computing UTC+5:30 from system clock.`);
  const now = new Date(Date.now() + (5.5 * 60 + 30) * 60 * 1000);
  const h = now.getUTCHours();
  const m = String(now.getUTCMinutes()).padStart(2, "0");
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  istTimeStr = `${h12}:${m} ${ampm}`;
  console.warn(`Fallback IST (system clock): ${istTimeStr} — DEVIATION from "never trust system clock" rule.`);
}

const nowIst = new Date(Date.now() + (5.5 * 60 + 30) * 60 * 1000);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = nowIst.getUTCDate();
const month = months[nowIst.getUTCMonth()];
const year = nowIst.getUTCFullYear();
const updatedAt = `${day} ${month} ${year} · ${istTimeStr}`;
console.log(`updatedAt string: '${updatedAt}'`);

// 3. Write new patch + updatedAt into app_version.dart (leave version unchanged).
let updated = appVersion
  .replace(/static const int patch = \d+/, `static const int patch = ${NEW_PATCH}`)
  .replace(/static const String updatedAt = '[^']*'/, `static const String updatedAt = '${updatedAt}'`);
writeFileSync(APP_VERSION, updated);
console.log(`Updated app_version.dart (patch=${NEW_PATCH}, updatedAt)`);

// 4. Commit + push (only app_version.dart — pubspec untouched on patches).
console.log("\n=== Step 2: Commit + push ===");
run("git", ["add", "mobile/lib/core/app_version.dart"]);
const commitMsg = `chore(mobile): patch ${NEW_PATCH} — OTA fix`;
try {
  runInherit("git", ["commit", "-m", commitMsg]);
} catch (e) {
  die("Error: git commit failed.", e);
}
try {
  run("git", ["pull", "--rebase", "origin", "main"]);
} catch (e) {
  try {
    run("git", ["rebase", "--abort"]);
    console.error("Rebase aborted; working tree left as it was before the pull.");
  } catch {
    console.error("Warning: `git rebase --abort` failed — repo may still be mid-rebase. Run it manually.");
  }
  die("Error: git pull --rebase origin main failed. Resolve the conflict and re-run.", e);
}
try {
  runInherit("git", ["push", "origin", "main"]);
} catch (e) {
  die("Error: git push origin main failed.", e);
}

// 5. Create + push annotated hotfix tag (matches mobile-patch.yml regex:
//    ^v[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+-hotfix\.[0-9]+$).
console.log("\n=== Step 3: Create + push hotfix tag ===");
const SEMVER = VERSION.split("+")[0];
const BUILD = VERSION.split("+")[1];
const TAG = `v${SEMVER}+${BUILD}-hotfix.${NEW_PATCH}`;
console.log(`\n*** TAG: ${TAG} ***`);
try {
  run("git", ["tag", "-a", TAG, "-m", `Patch ${NEW_PATCH} for ${VERSION}`]);
} catch (e) {
  die(`Error: git tag ${TAG} failed.`, e);
}
try {
  runInherit("git", ["push", "origin", TAG]);
} catch (e) {
  die(`Error: git push origin ${TAG} failed.`, e);
}

// 6. Optional: watch the workflow run (gh CLI).
console.log("\n=== Step 4: Watch workflow run (optional) ===");
try {
  const runId = run("gh", [
    "run", "list",
    "--workflow=mobile-patch.yml",
    "--limit=1",
    "--json", "databaseId",
    "--jq", ".[0].databaseId",
  ]).trim();
  if (runId) {
    console.log(`Watching run ${runId}...`);
    runInherit("gh", ["run", "watch", runId, "--exit-status"]);
  }
} catch {
  console.log("gh CLI not available or not authenticated — watch the run in Actions UI: https://github.com/Prashantkhuva/Meteoric/actions/workflows/mobile-patch.yml");
}

console.log(`\n✅ Patch prep complete. Tag ${TAG} pushed — workflow triggered.`);
