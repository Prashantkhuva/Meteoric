#!/usr/bin/env node
// check-version.mjs — Pre-build guard for Android versionCode.
//
// Android requires versionCode to monotonically increase. If pubspec.yaml
// has a build number <= what's already published, this script auto-bumps
// both pubspec.yaml and app_version.dart to latest + 1.
//
// Usage:  node scripts/check-version.mjs [--dry-run]
//
// Run BEFORE `flutter build apk`. It reads the remote manifest from
// Supabase, compares with local, and fixes if needed.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBSPEC = join(ROOT, "mobile", "pubspec.yaml");
const APP_VERSION = join(ROOT, "mobile", "lib", "core", "app_version.dart");
const DRY_RUN = process.argv.includes("--dry-run");

// 1. Load .env for Supabase credentials
try {
  for (const line of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

// 2. Fetch remote build number from latest.json
let remoteBuild = 0;
try {
  const url =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/app-releases/latest.json`;
  const res = await fetch(url);
  if (res.ok) {
    const manifest = await res.json();
    remoteBuild = manifest.highest_build || manifest.build || 0;
    console.log(
      `Remote build: ${remoteBuild} (version ${manifest.version}, highest_build: ${manifest.highest_build})`
    );
  }
} catch (e) {
  console.warn(`Warning: could not fetch remote manifest: ${e.message}`);
}

// 3. Parse local version from pubspec.yaml
const pubspec = readFileSync(PUBSPEC, "utf8");
const versionMatch = pubspec.match(/^version:\s*(.+)/m);
if (!versionMatch) {
  console.error("Error: no 'version' line in pubspec.yaml");
  process.exit(1);
}
const fullVersion = versionMatch[1].trim();
const plusIdx = fullVersion.indexOf("+");
const semver = plusIdx !== -1 ? fullVersion.slice(0, plusIdx) : fullVersion;
let localBuild =
  plusIdx !== -1 ? parseInt(fullVersion.slice(plusIdx + 1), 10) : 1;

console.log(`Local version: ${fullVersion} (build ${localBuild})`);

// 4. Compute next build
const nextBuild = Math.max(remoteBuild, localBuild) + 1;

if (nextBuild === localBuild) {
  console.log("Version OK — local build is ahead of remote.");
  process.exit(0);
}

console.log(`\nBumping local build: ${localBuild} -> ${nextBuild}`);
console.log(`New version: ${semver}+${nextBuild}`);

if (DRY_RUN) {
  console.log("(dry run — no files changed)");
  process.exit(0);
}

// 5. Update pubspec.yaml
const newPubspec = pubspec.replace(
  /^version:\s*.+/m,
  `version: ${semver}+${nextBuild}`
);
writeFileSync(PUBSPEC, newPubspec);
console.log(`Updated pubspec.yaml`);

// 6. Update app_version.dart
let appVersion = readFileSync(APP_VERSION, "utf8");
appVersion = appVersion.replace(
  /static const String version = '.+'/,
  `static const String version = '${semver}+${nextBuild}'`
);
writeFileSync(APP_VERSION, appVersion);
console.log(`Updated app_version.dart`);

console.log(`\nReady to build: flutter build apk --release --no-tree-shake-icons`);
console.log(`Then upload: node scripts/upload-app-release.mjs <apk> ${semver} ${nextBuild}`);
