export const slugToImage = {
  "mongodb-schema-design-for-saas-billing": "/images/blog/blog-mongodb-schema.webp",
  "how-to-build-a-saas-mvp-step-by-step-guide": "/images/blog/blog-saas-mvp.webp",
  "mongodb-vs-postgresql-for-saas": "/images/blog/blog-mongodb-vs-postgres.webp",
  "gsap-vs-framer-motion-production-guide": "/images/blog/blog-gsap-vs-framer.webp",
  "supabase-vs-firebase-2026-comparison": "/images/blog/blog-supabase-vs-firebase.webp",
  "what-is-a-web-development-agency": "/images/blog/blog-web-agency.webp",
  "the-meteoric-guide-to-choosing-your-tech-stack": "/images/blog/blog-tech-stack.webp",
  "how-to-implement-aeo-answer-engine-optimization-for-saas": "/images/blog/blog-aeo.webp",
  "why-visitors-leave-your-website-issues-and-solutions": "/images/blog/blog-website-issues.webp",
  "high-converting-landing-page-structure-for-saas": "/images/blog/blog-landing-page.webp",
  "long-tail-seo-strategy-for-funded-startups": "/images/blog/blog-long-tail-seo.webp",
  "ai-search-optimization-how-to-get-cited-by-chatgpt": "/images/blog/blog-ai-search.webp",
  "startup-seo-on-a-budget-what-to-do-first": "/images/blog/blog-startup-seo.webp",
  "nextjs-vs-remix-2026-comparison": "/images/blog/blog-tech-stack.webp",
  "react-vs-nextjs-for-startup-websites": "/images/blog/blog-tech-stack.webp",
  "conversion-focused-web-design-beyond-pretty-ui": "/images/blog/blog-landing-page.webp",
  "building-a-saas-prototype-in-3-weeks-a-case-study": "/images/blog/blog-saas-mvp.webp",
  "how-much-does-a-startup-website-cost": "/images/blog/blog-startup-seo.webp",
  "how-to-choose-a-web-development-agency": "/images/blog/blog-web-agency.webp",
  "complete-website-audit-checklist-for-startups": "/images/blog/blog-website-issues.webp",
};

export const FALLBACK_BLOG_IMAGE = "/images/blog/blog-tech-stack.webp";

export function postImage(post) {
  return slugToImage[post.slug] || FALLBACK_BLOG_IMAGE;
}
