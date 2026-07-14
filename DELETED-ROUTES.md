# Deleted Routes — Remove from Google Search Console

## Services sub-routes removed 2026-07-14

Single `/services` page kept. Remove these from GSC → Removals tool.

```
https://withmeteoric.com/services/landing-pages
https://withmeteoric.com/services/saas-development
https://withmeteoric.com/services/web-applications
https://withmeteoric.com/services/full-stack-development
```

### What was deleted

- Route files: `app/(marketing)/services/{landing-pages,saas-development,web-applications,full-stack-development}/`
- Components: `src/components/pages/{LandingPages,SaaSDevelopment,WebApplications,FullStackDevelopment}.jsx`
- Sitemap entries removed from `src/lib/seo/config.js`
- llms.txt references removed
- 301 redirects added in `next.config.mjs` → `/services`
- Cross-references in About.jsx and CaseStudies.jsx updated

## Technology pages removed 2026-07-14

```
https://withmeteoric.com/technologies/next-js
https://withmeteoric.com/technologies/supabase
https://withmeteoric.com/technologies/react
https://withmeteoric.com/technologies/node-js
```

### What was deleted

- Route files: `app/(marketing)/technologies/{next-js,supabase,react,node-js}/`
- Components: `src/components/pages/{NextJsTech,SupabaseTech,ReactTech,NodeJsTech}.jsx`
- Sitemap entries removed from `src/lib/seo/config.js`
- llms.txt references removed
- Schema sameAs + SiteNavigationElement entries removed from `app/layout.jsx`
- Footer links removed from `src/components/layout/Footer.jsx`
- About.jsx cross-reference removed

---

## Blog removed 2026-07-13

Remove these URLs from GSC → Removals tool.

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
