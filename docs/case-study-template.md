# Case Study Template & Publishing Guide

Fill-in template for a Meteoric case study. This file is documentation only —
it is not routed, not in the sitemap, and not in production navigation.

## How the system works

| Piece | File |
| --- | --- |
| Project record (drives `/work/[slug]`) | `src/data/projects.ts` |
| Case-study record (challenge, solution, results…) | `src/data/case-studies.ts` |
| Shared types | `src/data/types.ts` |
| Page template | `src/components/pages/CaseStudy.jsx` |
| Index pages | `src/components/pages/Work.jsx`, `src/components/pages/CaseStudies.jsx` |
| Classification labels + disclosure copy | `src/lib/work-type.js` |
| SEO meta + CreativeWork JSON-LD | `app/(marketing)/work/[slug]/page.jsx` |

Link the two records with `caseStudySlug` on the project. Without it, the
`/work/[slug]` page still renders (project-only view: overview, tech, CTA).

## Fields

### Required (every case study)

- `slug`, `name`, `tagline` — project identity.
- `projectType` — classification shown on cards ("Web Design", "SaaS"…).
- `client`, `timeline`, `role` — overview meta.
- `challenge`, `solution` — one paragraph each, factual.
- `technology[]` — real stack used.
- `metaTitle`, `metaDescription` — page `<title>` / meta description.
- `image`, `imageAlt` — preview shot + meaningful alt (describe what the
  image shows; never stuff keywords or repeat the title).
- `serviceLink`, `relatedProjects[]` — internal linking.
- `gradient`, `accent` — visual tokens (copy from an existing record).

### Conditional / gated

- `workType` — `"client" | "internal" | "concept" | "open-source"`.
  Set only when the classification is certain. Non-client values trigger the
  prominent disclosure banner automatically. Unset = no badge, no disclosure.
- `industry`, `servicesProvided[]`, `deliverables[]` — render only when set.
- `screenshots[]` — `{ src, alt }`; renders under the solution section.
- `results[]` + `resultsVerified: true` — **Results section renders only
  when `resultsVerified` is true.** Verify every metric against a public
  source first (screenshot/analytics/marketplace page), then set the flag.
- `liveUrl` + `liveUrlVerified: true` — live button renders only when the
  URL is reachable, accurate, and intended to be public.
- `testimonial` — `{ quote, author, role?, company?, verified, permitted }`.
  Renders only when `verified` AND `permitted` are both `true`.
- `draft: true` — record excluded from sitemap, static generation, index
  pages, and `CollectionPage.hasPart`.

## Semantic structure (built into the template)

H1 (project title) → Overview → The challenge → The solution →
How we built it → Results (verified only) → Technology → Next step CTA.

Structured data: `BreadcrumbList` + `SpeakableSpecification` +
`CreativeWork` (name, description, image, tech keywords, org author).
No `AggregateRating`, `Review`, `Offer`, or `Product` schema — ever.

## Example draft record (not published)

```ts
// src/data/case-studies.ts
{
  slug: "example-draft",
  name: "Example Project",
  projectType: "Web App",
  industry: "TODO",
  workType: "concept",          // triggers disclosure banner
  draft: true,                  // never reaches sitemap/nav/pages
  // …fill required fields, then remove `draft` when ready.
}
```

## Related known issue

`relatedBlogPosts` in `src/data/services.ts` references slugs that do not
exist in `src/data/blog-posts.ts` — unrelated to case studies, tracked
separately.
