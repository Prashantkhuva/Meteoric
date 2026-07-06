# Internal Linking Optimization — Meteoric

**Date**: 2026-07-06
**Pages analyzed**: 7 public marketing routes + admin area
**Structure Score**: 60/100

## Current State

### Score Breakdown
- **-0** orphan pages (3 orphans are by-design: /login, preview routes)
- **-5** important pages deeper than 3 clicks from homepage: none
- **-5** pages with 0 inbound contextual links: Work page, About page
- **-10** no contextual cross-links within blog content
- **-10** no pillar/cluster architecture
- **-10** Navbar uses hash links (`/#work`) instead of full page (`/work`)
- **= 60/100**

### Linked Pages by Source
| Source | Links | Quality |
|--------|-------|---------|
| Navbar | `/`, `/#work`, `/#services`, `/blog`, `/about` | Good — appears on every page |
| Footer | `/work`, `/blog`, `/#services`, `/#process`, `/about` | Good |
| Homepage sections | `/work`, `/#process` | Light |
| Blog index → posts | 6 blog posts | Good but no context |
| Blog posts | `/blog`, 2 related posts | Minimal, no service links |
| **About page** | **0 internal links** | ❌ |
| **Work page** | **0 internal links** | ❌ |
| **Blog content** | **0 internal links** | ❌ |

## Action Plan

### Phase 1: Quick Wins (Today, <30 min each)

#### 1. Fix Navbar hash-link inconsistency
**Problem**: Navbar links to `/#work` but Footer links to `/work`. This means users on the Navbar never reach the standalone `/work` page — only the homepage section.

**Fix**: Change Navbar `/work` link to point to `/work` (the full page) with an anchor for the scroll position. Or keep both: change "Work" to point to `/work` and add a secondary "Selected Work" hash link.

**Priority**: P0 — Confusing UX, SEO missed opportunity

#### 2. Add internal links to About page
**Problem**: About page sends users exclusively to Cal.com, email, and social. Zero internal links.

**Fix**: Add 2-3 contextual links:
- "See our [portfolio](/work) of shipped projects"
- "Read insights on our [blog](/blog)"
- CTA can still be Cal.com but the page should also feed users into the site's content

**Priority**: P0 — 3rd most-linked page, zero outbound links

#### 3. Add internal links to Work page
**Problem**: Work page lists 4 projects and sends users to external project URLs. Zero internal links.

**Fix**: Add a section footer or sidebar linking to:
- "Learn about our [process](/process)"
- "Read our [latest case study](/blog/building-a-saas-prototype-in-3-weeks-a-case-study)"

**Priority**: P1

### Phase 2: Blog Content Links (This week, 1-2 hours)

#### Add contextual links within existing blog posts

**MongoDB Schema Design for SaaS Billing** → Add:
- "At Meteoric, we typically use [Supabase](/blog/the-meteoric-guide-to-choosing-your-tech-stack) for backend in SaaS projects"
- "See how we built a full SaaS prototype in [3 weeks](/blog/building-a-saas-prototype-in-3-weeks-a-case-study)"

**GSAP vs Framer Motion** → Add:
- "See these animations in action on our [portfolio site](/work)"
- "Our full tech stack decision framework is covered in [Choosing Your Tech Stack](/blog/the-meteoric-guide-to-choosing-your-tech-stack)"

**MVP in 3 Weeks** → Add:
- "This project was built using our [default tech stack](/blog/the-meteoric-guide-to-choosing-your-tech-stack)"
- "Read [Designing for Conversion](/blog/designing-for-conversion-lessons-from-12-shipped-projects) for the design principles behind this project"

**Designing for Conversion** → Add:
- "See these principles applied in our [portfolio projects](/work)"
- "Related: why a [product studio](/blog/why-your-startup-needs-a-product-studio-not-an-agency) thinks differently about conversion"

**Product Studio vs Agency** → Add:
- "See the results of this approach in our [MVP case study](/blog/building-a-saas-prototype-in-3-weeks-a-case-study)"

**Choosing Your Tech Stack** → Add:
- "For a deep dive on one component, see our [SaaS billing schema guide](/blog/mongodb-schema-design-for-saas-billing)"
- "Animation tech decisions are covered in [GSAP vs Framer Motion](/blog/gsap-vs-framer-motion-production-guide)"

### Phase 3: Pillar/Cluster Architecture (This sprint)

#### When new service pages are created
- `/services/saas-development` → link to MongoDB billing post, MVP case study, tech stack guide
- `/services/startup-web-development` → link to Product Studio post, Designing for Conversion, MVP case study

#### Add breadcrumbs
- Every blog post should have: `Home > Blog > Post Title`
- Blog index: `Home > Blog`
- Work → About pages could also benefit from breadcrumbs

#### Add "Recommended Reading" sections to blog posts
- Beyond the current "More insights" (which shows 2 random posts), add contextual recommendations:
  - MongoDB post → "Recommended: Tech Stack Guide, MVP Case Study"
  - GSAP post → "Recommended: Portfolio, Tech Stack Guide"

### Linking Score Targets

| Metric | Current | Target |
|--------|---------|--------|
| Structure Score | 60/100 | 85/100 |
| Blog posts with contextual links | 0/6 | 6/6 |
| About page internal links | 0 | 3 |
| Work page internal links | 0 | 2 |
| Anchor text variation | Poor | Good |
| Pillar/cluster linking | None | 2 clusters |

## Handoff Summary

```yaml
status: DONE
objective: "Internal linking optimization — Meteoric site inventory and repair plan"
key_findings:
  - title: "Zero contextual links in blog content"
    severity: high
    evidence: "6 blog posts with 0 internal cross-references — missed SEO + engagement opportunity"
  - title: "About and Work pages have zero outbound internal links"
    severity: high
    evidence: "Both pages are content dead ends — users must leave the site (Cal.com, external URLs)"
  - title: "Navbar uses hash links instead of full page routes"
    severity: medium
    evidence: "Navbar links to `/#work`, Footer links to `/work` — inconsistent navigation UX"
  - title: "No pillar/cluster linking structure"
    severity: medium
    evidence: "Blog posts are standalone; no service pages exist to anchor clusters"
evidence_summary: "7 public routes, 6 blog posts, Navbar, Footer, and all page-level components analyzed"
open_loops:
  - "Implement contextual links in blog.js content arrays"
  - "Add internal links to About.jsx and Work.jsx"
  - "Decide on Navbar hash vs full-page link strategy"
  - "Create service pages to anchor pillar/cluster architecture"
recommended_next_skill: "seo-content-writer (once service pages are created)"
```
