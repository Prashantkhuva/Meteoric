// Submit sitemap to Bing IndexNow for faster AI crawler indexing
// ChatGPT uses Bing's index, so this helps ChatGPT cite your content faster.
// Run: node scripts/submit-indexnow.mjs

const INDEXNOW_URL = "https://www.bing.com/indexnow";

const URLS = [
  "https://withmeteoric.com",
  "https://withmeteoric.com/about",
  "https://withmeteoric.com/work",
  "https://withmeteoric.com/services",
  "https://withmeteoric.com/case-studies",
  "https://withmeteoric.com/privacy",
  "https://withmeteoric.com/blog",
  "https://withmeteoric.com/booking",
  "https://withmeteoric.com/terms",
  "https://withmeteoric.com/work/lete-em-know",
  "https://withmeteoric.com/work/habit-flow",
  "https://withmeteoric.com/work/megablog",
  "https://withmeteoric.com/work/mobile-preview-simulator",
  "https://withmeteoric.com/services/saas-development",
  "https://withmeteoric.com/services/startup-web-development",
  "https://withmeteoric.com/services/nextjs-development",
  "https://withmeteoric.com/services/landing-pages",
  "https://withmeteoric.com/services/web-applications",
  "https://withmeteoric.com/services/saas-development-agency",
  "https://withmeteoric.com/services/web-development-agency-for-startups",
  // Blog URLs — only slugs that exist in src/data/blog-posts.ts (published posts).
  // Dead slugs removed: nextjs-vs-remix-2026-comparison, how-much-does-a-startup-website-cost,
  // building-a-saas-prototype-in-3-weeks-a-case-study, how-to-choose-a-web-development-agency,
  // react-vs-nextjs-for-startup-websites, conversion-focused-web-design-beyond-pretty-ui,
  // complete-website-audit-checklist-for-startups — re-add when published (QA report P0 #1/P0 #2).
  "https://withmeteoric.com/blog/mongodb-schema-design-for-saas-billing",
  "https://withmeteoric.com/blog/how-to-build-a-saas-mvp-step-by-step-guide",
  "https://withmeteoric.com/blog/mongodb-vs-postgresql-for-saas",
  "https://withmeteoric.com/blog/gsap-vs-framer-motion-production-guide",
  "https://withmeteoric.com/blog/supabase-vs-firebase-2026-comparison",
  "https://withmeteoric.com/blog/what-is-a-web-development-agency",
  "https://withmeteoric.com/blog/the-meteoric-guide-to-choosing-your-tech-stack",
  "https://withmeteoric.com/blog/how-to-implement-aeo-answer-engine-optimization-for-saas",
  "https://withmeteoric.com/blog/why-visitors-leave-your-website-issues-and-solutions",
  "https://withmeteoric.com/blog/high-converting-landing-page-structure-for-saas",
  "https://withmeteoric.com/blog/long-tail-seo-strategy-for-funded-startups",
  "https://withmeteoric.com/blog/ai-search-optimization-how-to-get-cited-by-chatgpt",
  "https://withmeteoric.com/blog/startup-seo-on-a-budget-what-to-do-first",
];

async function submit() {
  const payload = {
    host: "withmeteoric.com",
    key: "meteoric-indexnow-key",
    keyLocation: "https://withmeteoric.com/meteoric-indexnow-key.txt",
    urlList: URLS,
  };

  const res = await fetch(INDEXNOW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    console.log(`IndexNow: submitted ${URLS.length} URLs`);
  } else {
    console.error("IndexNow failed:", res.status, await res.text());
  }
}

submit().catch(console.error);
