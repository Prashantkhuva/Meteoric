/**
 * Lighthouse audit runner.
 * Usage: node scripts/lighthouse-audit.mjs [url]
 * Requires: npx lighthouse (ships with Chrome/Chromium)
 * Output: JSON report + console summary of scores.
 */

import { execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || "https://withmeteoric.com";
const outPath = resolve(__dirname, "..", "lighthouse-report.json");

console.log(`Running Lighthouse on ${url} ...\n`);

try {
  execSync(
    `npx lighthouse "${url}" --output=json --output-path="${outPath}" --chrome-flags="--headless --no-sandbox" --quiet`,
    { stdio: "inherit" }
  );
} catch {
  console.error("Lighthouse failed. Make sure Chrome/Chromium is installed.");
  process.exit(1);
}

const report = JSON.parse(readFileSync(outPath, "utf-8"));
const categories = report.categories;

console.log("── Lighthouse Scores ──\n");
for (const [key, cat] of Object.entries(categories)) {
  const score = Math.round((cat.score || 0) * 100);
  const icon = score >= 90 ? "●" : score >= 50 ? "◐" : "○";
  console.log(`  ${icon} ${cat.title}: ${score}`);
}

const perf = Math.round((categories.performance?.score || 0) * 100);
const a11y = Math.round((categories.accessibility?.score || 0) * 100);
const bp = Math.round((categories["best-practices"]?.score || 0) * 100);
const seo = Math.round((categories.seo?.score || 0) * 100);

console.log(`\n  Performance: ${perf}  |  Accessibility: ${a11y}  |  Best Practices: ${bp}  |  SEO: ${seo}`);

// Core Web Vitals from audit
const audited = report.audits;
const metrics = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"];
console.log("\n── Metrics ──\n");
for (const id of metrics) {
  const a = audited[id];
  if (a) console.log(`  ${a.title}: ${a.displayValue}`);
}

console.log(`\nFull report saved to ${outPath}`);
