// AI Citation Checker — weekly GEO monitoring
// Checks if Meteoric is cited by major search engines and provides
// guidance for manual ChatGPT/Claude/Gemini verification.
// Usage: node scripts/check-ai-citations.mjs

const TARGET_QUERIES = [
  "saas development agency",
  "startup web development agency",
  "next js development agency",
  "supabase vs firebase 2026",
  "how to choose a web development agency",
  "how much does a startup website cost",
  "react next js agency",
  "product studio vs agency",
];

const SITE = "withmeteoric.vercel.app";
const SITE_NAME = "Meteoric";

function formatDate() {
  return new Date().toISOString().split("T")[0];
}

async function checkGoogle(query) {
  const results = { engine: "google", query, cited: false, snippet: null, error: null };

  try {
    // Use Google's site: operator for targeted search
    const res = await fetch(
      `https://www.google.com/search?q=${encodeURIComponent(query + " " + SITE)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MeteoricCitationChecker/1.0; +https://withmeteoric.vercel.app)",
          Accept: "text/html",
        },
      },
    );
    const text = await res.text();
    results.cited = text.includes(SITE) || text.includes(SITE_NAME);
    // Extract a snippet if available
    const snippetMatch = text.match(/<span[^>]*class="[^"]*BNeawe[^"]*"[^>]*>([^<]+)<\/span>/);
    if (snippetMatch) results.snippet = snippetMatch[1].slice(0, 200);
  } catch (err) {
    results.error = err.message;
  }

  return results;
}

async function checkBing(query) {
  const results = { engine: "bing", query, cited: false, snippet: null, error: null };

  try {
    const res = await fetch(
      `https://www.bing.com/search?q=${encodeURIComponent(query + " " + SITE)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MeteoricCitationChecker/1.0; +https://withmeteoric.vercel.app)",
          Accept: "text/html",
        },
      },
    );
    const text = await res.text();
    results.cited = text.includes(SITE) || text.includes(SITE_NAME);
    const snippetMatch = text.match(/<p[^>]*class="[^"]*b_snippet[^"]*"[^>]*>([^<]+)<\/p>/);
    if (snippetMatch) results.snippet = snippetMatch[1].slice(0, 200);
  } catch (err) {
    results.error = err.message;
  }

  return results;
}

async function checkQuery(query) {
  const results = { query };
  results.google = await checkGoogle(query);
  results.bing = await checkBing(query);
  return results;
}

function printResults(allResults) {
  const lines = [];
  lines.push("=".repeat(60));
  lines.push(`  AI Citation Checker Report — ${formatDate()}`);
  lines.push(`  Site: ${SITE}`);
  lines.push("=".repeat(60));
  lines.push("");

  let totalCited = 0;
  let totalChecks = 0;

  for (const r of allResults) {
    lines.push(`Query: "${r.query}"`);
    for (const engine of ["google", "bing"]) {
      const result = r[engine];
      totalChecks++;
      if (result.cited) totalCited++;
      const status = result.cited ? "✓ CITED" : "✗ NOT FOUND";
      const error = result.error ? ` (${result.error})` : "";
      lines.push(`  ${engine.padEnd(10)} ${status}${error}`);
      if (result.snippet) {
        lines.push(`  ${"".padEnd(10)} Snippet: ${result.snippet}...`);
      }
    }
    lines.push("");
  }

  const pct = Math.round((totalCited / totalChecks) * 100);
  lines.push("-".repeat(60));
  lines.push(`  Citation Rate: ${totalCited}/${totalChecks} (${pct}%)`);
  lines.push("");

  // Manual check guidance
  lines.push("  ── Manual AI Checks ──");
  lines.push("");
  lines.push("  To check ChatGPT:");
  lines.push(`    Ask: "Does ${SITE} come up for 'your target query'?"`);
  lines.push("    Or sign in → Settings → Data controls → Export");
  lines.push("");
  lines.push("  To check Claude:");
  lines.push("    Ask: 'Have you heard of Meteoric (withmeteoric.vercel.app)?'");
  lines.push("    Then: 'Does it appear for [query]?'");
  lines.push("");
  lines.push("  To check Gemini:");
  lines.push("    Ask: 'What do you know about Meteoric web development?'");
  lines.push("    Then: 'Does " + SITE_NAME + " appear for [query]?'");
  lines.push("");
  lines.push("  To check Perplexity:");
  lines.push(`    Visit: https://www.perplexity.ai/search?q=${encodeURIComponent(SITE + " web development agency")}`);
  lines.push("");
  lines.push("=".repeat(60));

  return lines.join("\n");
}

async function run() {
  console.log(`Checking ${TARGET_QUERIES.length} queries across Google and Bing...\n`);

  const allResults = [];
  for (const query of TARGET_QUERIES) {
    process.stdout.write(`  "${query.slice(0, 40).padEnd(42)}... `);
    const result = await checkQuery(query);
    allResults.push(result);
    process.stdout.write("done\n");
  }

  const report = printResults(allResults);
  console.log("\n" + report);
}

run().catch(console.error);
