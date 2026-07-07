// Submit sitemap to Bing IndexNow for faster AI crawler indexing
// ChatGPT uses Bing's index, so this helps ChatGPT cite your content faster.
// Run: node scripts/submit-indexnow.mjs

const SITEMAP_URL = "https://withmeteoric.vercel.app/sitemap.xml";
const INDEXNOW_URL = "https://www.bing.com/indexnow";

async function submit() {
  const payload = {
    host: "withmeteoric.vercel.app",
    key: "meteoric-indexnow-key",
    keyLocation: "https://withmeteoric.vercel.app/meteoric-indexnow-key.txt",
    urlList: [SITEMAP_URL],
  };

  const res = await fetch(`${INDEXNOW_URL}?url=${encodeURIComponent(SITEMAP_URL)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    console.log("IndexNow submission successful");
  } else {
    console.error("IndexNow submission failed:", res.status, await res.text());
  }
}

submit().catch(console.error);
