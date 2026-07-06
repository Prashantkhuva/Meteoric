// AI Citation Checker — weekly GEO monitoring
// Checks if Meteoric is cited by major AI engines for target queries.
// Usage: node scripts/check-ai-citations.mjs

const TARGET_QUERIES = [
  "best web development agency for startups",
  "react next js development agency",
  "saas development agency",
  "full stack development agency india",
  "product development studio for founders",
];

const SITE = "withmeteoric.vercel.app";

async function checkQuery(engine, query) {
  const results = { engine, query, cited: false, snippet: null };

  try {
    if (engine === "perplexity") {
      const res = await fetch(
        `https://api.perplexity.ai/search?q=${encodeURIComponent(query)}&source=${SITE}`,
        { headers: { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY || "demo"}` } },
      );
      const data = await res.json();
      results.cited = JSON.stringify(data).includes(SITE);
      results.snippet = data.results?.[0]?.snippet?.slice(0, 200) || null;
    } else if (engine === "google") {
      const res = await fetch(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        { headers: { "User-Agent": "Mozilla/5.0" } },
      );
      const text = await res.text();
      results.cited = text.includes(SITE);
    } else if (engine === "bing") {
      const res = await fetch(
        `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        { headers: { "User-Agent": "Mozilla/5.0" } },
      );
      const text = await res.text();
      results.cited = text.includes(SITE);
    }
  } catch (err) {
    results.error = err.message;
  }

  return results;
}

async function run() {
  console.log("=== AI Citation Checker ===");
  console.log(`Target: ${SITE}`);
  console.log(`Queries: ${TARGET_QUERIES.length}`);
  console.log("");

  for (const query of TARGET_QUERIES) {
    console.log(`\nQuery: "${query}"`);
    for (const engine of ["google", "bing", "perplexity"]) {
      const result = await checkQuery(engine, query);
      const status = result.cited ? "✓ CITED" : "✗ NOT FOUND";
      console.log(`  ${engine.padEnd(12)} ${status}`);
    }
  }

  console.log("\nDone. Manual check required for ChatGPT and Claude.");
}

run().catch(console.error);
