// Ship a new Meteoric Admin mobile release.
//
// Usage: node scripts/upload-app-release.mjs <path-to-apk> <version> <build> [notes]
//   e.g. node scripts/upload-app-release.mjs mobile/build/app/outputs/flutter-apk/universal.apk 0.4.1 6 "Bug fixes"
//
// What it does:
//   1. Uploads the APK as a GitHub Release asset on the public
//      Prashantkhuva/meteoric-app-releases repo (Supabase free tier caps
//      uploads at 50MB, so the APK lives on GitHub).
//   2. Updates latest.json in the public Supabase Storage bucket
//      `app-releases` — this is what the app polls on launch.
import { createClient } from "@supabase/supabase-js";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

// Resolve .env relative to this script so it works from any working directory.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

try {
  for (const line of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const [apkPath, version, build, notes = ""] = process.argv.slice(2);
if (!apkPath || !version || !build) {
  console.error(
    "Usage: node scripts/upload-app-release.mjs <apk> <version> <build> [notes]"
  );
  process.exit(1);
}

const REPO = "Prashantkhuva/meteoric-app-releases";
const apkUrl = `https://github.com/${REPO}/releases/download/v${version}/universal.apk`;

// 1. GitHub release with the APK (falls back to re-upload if release exists)
try {
  execSync(
    `gh release create v${version} "${apkPath}#Meteoric Admin ${version} (universal)" --repo ${REPO} --title "v${version}" --notes "${notes}"`,
    { stdio: "inherit" }
  );
} catch {
  console.log(`Release v${version} already exists — uploading asset instead`);
  execSync(
    `gh release upload v${version} "${apkPath}#Meteoric Admin ${version} (universal)" --repo ${REPO} --clobber`,
    { stdio: "inherit" }
  );
}
console.log(`GitHub release v${version} created`);

// 2. Update manifest on Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
const manifest = JSON.stringify({
  version,
  build: Number(build),
  url: apkUrl,
  notes,
});
const { error } = await supabase.storage
  .from("app-releases")
  .upload("latest.json", Buffer.from(manifest), {
    contentType: "application/json",
    upsert: true,
  });
if (error) throw error;
console.log(`Manifest updated → build ${build}`);
console.log(`Verify: curl ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/app-releases/latest.json`);
