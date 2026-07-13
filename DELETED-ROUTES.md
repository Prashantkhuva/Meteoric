# Deleted Routes — Remove from Google Search Console

Blog removed from Meteoric on 2026-07-13. Remove these URLs from GSC → Removals tool.

## Routes to remove (12 URLs)

```
https://withmeteoric.com/blog
https://withmeteoric.com/blog/what-is-a-web-development-agency
https://withmeteoric.com/blog/how-to-build-a-saas-mvp-step-by-step-guide
https://withmeteoric.com/blog/building-a-saas-prototype-in-3-weeks-a-case-study
https://withmeteoric.com/blog/the-meteoric-guide-to-choosing-your-tech-stack
https://withmeteoric.com/blog/mongodb-schema-design-for-saas-billing
https://withmeteoric.com/blog/gsap-vs-framer-motion-production-guide
https://withmeteoric.com/blog/supabase-vs-firebase-2026-comparison
https://withmeteoric.com/blog/how-much-does-a-startup-website-cost
https://withmeteoric.com/blog/how-to-choose-a-web-development-agency
https://withmeteoric.com/blog/nextjs-vs-remix-2026-comparison
https://withmeteoric.com/blog/mongodb-vs-postgresql-for-saas
```

## What was deleted

- Route files: `app/(marketing)/blog/` (index + [slug])
- Components: `src/components/pages/Blog.jsx`, `BlogPost.jsx`
- Data: `src/data/blog.js` (11 posts)
- Images: `public/images/blog/` (11 cover images)
- Script: `scripts/replace-blog-posts.mjs`
- Nav/footer links, schema markup, sitemap entries, llms.txt entries

## Notes

- `public/megablog.png` kept — client portfolio project, not the blog system
- `src/data/projects.js` MegaBlog entry kept — client project showcase
- `memory/` audit files kept — internal research docs
