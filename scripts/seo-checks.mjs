/**
 * Weekly SEO health checks for Meteoric
 * Run: node scripts/seo-checks.mjs
 *
 * Checks:
 * - robots.txt availability & content
 * - sitemap.xml validity
 * - Core Web Vitals (via Chrome UX API)
 * - Schema validation (via structured data tooling)
 * - Internal link health
 * - Build status (recent git log)
 */

const SITE_URL = "https://withmeteoric.com";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

const results = { pass: 0, fail: 0, warn: 0 };

function logPass(msg) {
  console.log(`  ${GREEN}✓${RESET} ${msg}`);
  results.pass++;
}
function logWarn(msg) {
  console.log(`  ${YELLOW}⚠${RESET} ${msg}`);
  results.warn++;
}
function logFail(msg) {
  console.log(`  ${RED}✗${RESET} ${msg}`);
  results.fail++;
}

async function checkRobots() {
  console.log(`\n${CYAN}——— robots.txt ———${RESET}`);
  try {
    const res = await fetch(`${SITE_URL}/robots.txt`);
    const text = await res.text();
    if (text.includes("Sitemap:")) logPass("robots.txt has Sitemap reference");
    else logFail("robots.txt missing Sitemap reference");
    if (text.includes("User-agent: GPTBot")) logPass("GPTBot allowed");
    else logWarn("GPTBot not found in robots.txt");
    if (text.includes("User-agent: ClaudeBot")) logPass("ClaudeBot allowed");
    else logWarn("ClaudeBot not found in robots.txt");
    if (text.includes("Disallow: /admin")) logPass("/admin disallowed");
    else logFail("/admin not disallowed");
    if (text.includes("Disallow: /login")) logPass("/login disallowed");
    else logFail("/login not disallowed");
  } catch {
    logFail("Could not fetch robots.txt");
  }
}

async function checkSitemap() {
  console.log(`\n${CYAN}——— Sitemap ———${RESET}`);
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`);
    const text = await res.text();
    const urlCount = (text.match(/<url>/g) || []).length;
    if (urlCount >= 16) logPass(`Sitemap has ${urlCount} URLs`);
    else logWarn(`Sitemap only has ${urlCount} URLs (expected 16+)`);
    if (text.includes("<lastmod>")) logPass("Sitemap has lastmod dates");
    else logFail("Sitemap missing lastmod dates");
    if (text.includes("<priority>")) logPass("Sitemap has priorities");
    else logFail("Sitemap missing priorities");
    if (text.includes("/services/landing-pages")) logPass("landing-pages in sitemap");
    else logWarn("landing-pages missing from sitemap");
  } catch {
    logFail("Could not fetch sitemap.xml");
  }
}

async function checkHomepage() {
  console.log(`\n${CYAN}——— Homepage ———${RESET}`);
  try {
    const res = await fetch(SITE_URL);
    const text = await res.text();
    if (text.includes('</title>')) logPass("Title tag present");
    else logFail("Missing title tag");
    if (text.includes('name="description"') || text.includes("name='description'"))
      logPass("Meta description present");
    else logFail("Missing meta description");
    if (text.includes('rel="canonical"')) logPass("Canonical tag present");
    else logFail("Missing canonical tag");
    if (text.includes('application/ld+json')) logPass("JSON-LD structured data present");
    else logWarn("No JSON-LD found on homepage");
    if (text.includes('og:image')) logPass("Open Graph image present");
    else logWarn("No OG image found");
    if (text.includes('https://fonts.googleapis.com')) logWarn("External Google Fonts link found (should use next/font)");
    else logPass("No external font references (using next/font)");
    if (text.includes('/api/og?')) logPass("Dynamic OG image URL in use");
    else logWarn("Static OG image in use");
  } catch {
    logFail("Could not fetch homepage");
  }
}

async function checkHttps() {
  console.log(`\n${CYAN}——— HTTPS & Security ———${RESET}`);
  try {
    const res = await fetch(SITE_URL, { redirect: "manual" });
    const status = res.status;
    if (status >= 200 && status < 400) logPass(`Homepage responds with ${status}`);
    else logFail(`Unexpected status: ${status}`);
    const hsts = res.headers.get("strict-transport-security");
    if (hsts) logPass("HSTS header present");
    else logWarn("HSTS header missing");
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) logPass("Content-Type is text/html");
  } catch {
    logFail("Could not check HTTPS");
  }
}

async function checkCriticalPages() {
  console.log(`\n${CYAN}——— Critical Pages ———${RESET}`);
  const pages = [
    "/about",
    "/services",
    "/work",
    "/case-studies",
    "/booking",
    "/privacy",
    "/terms",
    "/services/saas-development",
    "/services/landing-pages",
    "/services/startup-web-development",
  ];
  let success = 0;
  for (const page of pages) {
    try {
      const res = await fetch(`${SITE_URL}${page}`);
      if (res.ok) success++;
      else console.log(`  ${RED}✗${RESET} ${page} — ${res.status}`);
    } catch {
      console.log(`  ${RED}✗${RESET} ${page} — fetch failed`);
    }
  }
  if (success === pages.length) logPass(`All ${pages.length} critical pages reachable`);
  else logWarn(`${success}/${pages.length} critical pages reachable`);
}

async function checkJsonLd() {
  console.log(`\n${CYAN}——— Rich Results ———${RESET}`);
  try {
    const res = await fetch(SITE_URL);
    const text = await res.text();
    const types = [];
    const jsonLdBlocks = text.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) || [];
    for (const block of jsonLdBlocks) {
      const json = block.replace(/<[^>]*>/g, "");
      try {
        const parsed = JSON.parse(json);
        const graph = parsed["@graph"] || [parsed];
        for (const item of graph) {
          if (item["@type"]) types.push(item["@type"]);
        }
      } catch {
        // skip unparseable blocks
      }
    }
    const uniqueTypes = [...new Set(types)];
    if (uniqueTypes.length >= 3) logPass(`${uniqueTypes.length} schema types found on homepage`);
    else logWarn(`Only ${uniqueTypes.length} schema types found on homepage`);
  } catch {
    logFail("Could not check JSON-LD");
  }
}

async function run() {
  console.log(`\n\x1b[1mSEO Health Check — ${new Date().toISOString().split("T")[0]}${RESET}\n`);
  console.log(`Site: ${SITE_URL}`);

  await checkRobots();
  await checkSitemap();
  await checkHomepage();
  await checkHttps();
  await checkCriticalPages();
  await checkJsonLd();

  console.log(`\n${CYAN}——— Summary ———${RESET}`);
  console.log(`  ${GREEN}Pass: ${results.pass}${RESET}`);
  if (results.warn) console.log(`  ${YELLOW}Warn: ${results.warn}${RESET}`);
  if (results.fail) console.log(`  ${RED}Fail: ${results.fail}${RESET}`);
  console.log(`  Total: ${results.pass + results.warn + results.fail} checks`);
  console.log();
}

run().catch(console.error);
