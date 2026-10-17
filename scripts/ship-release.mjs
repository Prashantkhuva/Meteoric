#!/usr/bin/env node
// ship-release.mjs — Prep a new mobile release: bump version, fetch IST,
// commit+push, create+push tag vX.Y.Z+N. Tag push triggers mobile-release.yml.
//
// Usage: npm run ship:release   (or: node scripts/ship-release.mjs)
//
// Requires: git, .env with NEXT_PUBLIC_SUPABASE_URL (for check-version.mjs).
// Optional: gh CLI (for run watch tail — happy path works without it).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_VERSION = join(ROOT, "mobile", "lib", "core", "app_version.dart");

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

// Guard: version files must not already be dirty (don't sweep unrelated work).
const status = run("git", ["status", "--porcelain", "mobile/pubspec.yaml", "mobile/lib/core/app_version.dart"]);
if (status.trim()) {
  console.error("Error: mobile/pubspec.yaml or app_version.dart already dirty. Commit/stash first.");
  process.exit(1);
}

// 1. Bump version (check-version.mjs handles build above remote highest).
console.log("\n=== Step 1: Bump version (check-version.mjs) ===");
runInherit("node", ["scripts/check-version.mjs"]);

// 2. Read new version from pubspec.
const pubspec = readFileSync(join(ROOT, "mobile", "pubspec.yaml"), "utf8");
const versionMatch = pubspec.match(/^version:\s*(.+)/m);
if (!versionMatch) { console.error("Error: no version line in pubspec.yaml"); process.exit(1); }
const FULL = versionMatch[1].trim();
const SEMVER = FULL.split("+")[0];
const BUILD = FULL.split("+")[1];
console.log(`New version: ${FULL} (semver=${SEMVER}, build=${BUILD})`);

// 3. Fetch real IST, write updatedAt into app_version.dart.
console.log("\n=== Step 2: Fetch real IST ===");
let istTimeStr;
try {
  const res = await fetch("https://time.is/IST");
  const html = await res.text();
  // time.is embeds current time in a clock div — parse HH:MM:SS pattern near "id=aclk"
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

// Get full date for updatedAt string format: '16 Oct 2026 · 6:21 PM'
const nowIst = new Date(Date.now() + (5.5 * 60 + 30) * 60 * 1000);
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const day = nowIst.getUTCDate();
const month = months[nowIst.getUTCMonth()];
const year = nowIst.getUTCFullYear();
const updatedAt = `${day} ${month} ${year} · ${istTimeStr}`;
console.log(`updatedAt string: '${updatedAt}'`);

let appVersion = readFileSync(APP_VERSION, "utf8");
appVersion = appVersion.replace(
  /static const String updatedAt = '[^']*'/,
  `static const String updatedAt = '${updatedAt}'`
);
// Also ensure patch is 0 (new release = patch reset).
appVersion = appVersion.replace(
  /static const int patch = \d+/,
  "static const int patch = 0"
);
writeFileSync(APP_VERSION, appVersion);
console.log(`Updated app_version.dart (updatedAt + patch=0)`);

// 4. Commit + push.
console.log("\n=== Step 3: Commit + push ===");
run("git", ["add", "mobile/pubspec.yaml", "mobile/lib/core/app_version.dart"]);
const commitMsg = `chore(mobile): v${FULL} — release prep`;
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

// 5. Create + push annotated tag.
console.log("\n=== Step 4: Create + push tag ===");
const TAG = `v${FULL}`;
console.log(`\n*** TAG: ${TAG} ***`);
try {
  run("git", ["tag", "-a", TAG, "-m", `Release ${FULL}`]);
} catch (e) {
  die(`Error: git tag ${TAG} failed.`, e);
}
try {
  runInherit("git", ["push", "origin", TAG]);
} catch (e) {
  die(`Error: git push origin ${TAG} failed.`, e);
}

// 6. Optional: watch the workflow run (gh CLI).
console.log("\n=== Step 5: Watch workflow run (optional) ===");
try {
  const runId = run("gh", ["run", "list", "--workflow=mobile-release.yml", "--limit=1", "--json", "databaseId", "--jq", ".[0].databaseId"]).trim();
  if (runId) {
    console.log(`Watching run ${runId}...`);
    runInherit("gh", ["run", "watch", runId, "--exit-status"]);
  }
} catch {
  console.log("gh CLI not available or not authenticated — watch the run in Actions UI: https://github.com/Prashantkhuva/Meteoric/actions/workflows/mobile-release.yml");
}

console.log(`\n✅ Release prep complete. Tag ${TAG} pushed — workflow triggered.`);
