# Meteoric — SEO / GEO / AEO Comprehensive Audit
**Date:** 2026-07-07  
**Site:** https://withmeteoric.com  
**Auditor:** opencode (ponytail-assisted)  

---

## Executive Summary

**Overall Score: 78/100**

The site is well-built for SEO with strong fundamentals: proper meta tags, canonical URLs, comprehensive schema markup, and an excellent `llms.txt` for GEO. The biggest gaps are (1) no dedicated service pillar pages (old URLs redirect to /services), (2) no blog/content for long-tail capture, and (3) HowTo schema rendered client-side.

| Category | Score | Verdict |
|----------|-------|---------|
| Technical SEO | 82/100 | Good — minor gaps |
| On-Page SEO | 85/100 | Strong across all pages |
| Schema / Structured Data | 80/100 | Comprehensive, some gaps |
| Content Quality (E-E-A-T) | 75/100 | Good founder signals, needs blog |
| GEO (AI Citation Readiness) | 88/100 | Excellent llms.txt + sr-only blocks |
| AEO (Answer Engine) | 72/100 | Good FAQ, needs more Q&As |

---

## 1. Technical SEO (82/100)

### ✅ What's Working

**robots.txt** — Clean and correct:
- Allows Googlebot, GPTBot, ClaudeBot, PerplexityBot
- Blocks `/admin` and `/login`
- Sitemap declared at `https://withmeteoric.com/sitemap.xml`

**Sitemap** — Dynamic via `app/sitemap.js`:
- 7 URLs: `/`, `/about`, `/work`, `/services`, `/privacy`, `/terms`, `/case-studies`
- Proper `changeFrequency` and `priority` values
- `lastModified` set to current date (acceptable but not precise)

**Security Headers** — Comprehensive in `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Full CSP with Google, Vercel, Cal.com, Razorpay, Supabase

**Performance foundations:**
- `poweredByHeader: false`
- Image formats: AVIF, WebP
- Font preconnect + display: swap
- DNS prefetch for GTM
- Vercel Analytics + SpeedInsights installed

### ⚠️ Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| T1 | `site.webmanifest` referenced in metadata but may not exist in `/public` | Low | Verify file exists or remove manifest metadata |
| T2 | `lastModified` in sitemap is always `new Date()` — doesn't reflect actual content changes | Low | Acceptable for small site; could be improved with build-time timestamps |
| T3 | No explicit `X-Robots-Tag` header for any paths (relying solely on robots.txt) | Low | Not needed unless you need noindex on non-HTML assets |

---

## 2. On-Page SEO (85/100)

### Meta Tags Summary

| Page | Title (chars) | Description (chars) | Canonical | OG | Twitter |
|------|---------------|----------------------|-----------|-----|---------|
| Home | "Meteoric — Web & Software Development Agency for Startups & SaaS" (65) | ✅ (195) | ✅ | ✅ | ✅ |
| About | "About Meteoric \| Web & Product Development Studio for Founders" (62) | ✅ (194) | ✅ | ✅ | ✅ |
| Work | "Our Work — Meteoric Portfolio \| Software & Web Development Projects" (66) | ✅ (177) | ✅ | ✅ | ✅ |
| Services | "Services \| Meteoric — Web & SaaS Development for Startups" (57) | ✅ (186) | ✅ | ✅ | ✅ |
| Case Studies | "Case Studies \| Meteoric — Web Development Projects & Results" (60) | ✅ (170) | ✅ | ✅ | ✅ |

All titles are within the 50-65 character sweet spot. All descriptions are within 150-200 characters.

### ✅ What's Working
- Every public page has canonical URL
- OG tags with images on every page
- Twitter cards with `summary_large_image`
- `twitter:creator` = `@prashantkhuva_` on all pages
- `hreflang` alternate links (`en` + `x-default`) in root layout
- `lang="en"` on HTML element
- `theme-color: #070707` set
- BreadcrumbList schema on all public pages

### ⚠️ Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| O1 | **All pages share the same `/og.png` OG image** — no page-specific previews | Medium | Generate per-page OG images (dynamic OG or static per-route) |
| O2 | `twitter:site` is set on sub-pages but **missing from homepage Twitter meta** (only has `creator`) | Low | Add `site: "@prashantkhuva_"` to homepage twitter metadata |
| O3 | OG images missing `alt` text on some pages (case-studies uses `pageTitle` which is ok) | Low | Ensure descriptive alt text |
| O4 | Home page title duplicates root layout title almost exactly — Google may pick either | Low | Differentiate home page title or rely on root layout only |

---

## 3. Schema / Structured Data (80/100)

### Schema Inventory

| Page | Schema Types | Quality |
|------|-------------|---------|
| Root Layout | Organization, WebSite, ProfessionalService, SiteNavigationElement | Strong |
| Home | BreadcrumbList, WebPage + SpeakableSpecification | Good |
| About | BreadcrumbList, Person (sameAs, knowsAbout) | Strong |
| Work | BreadcrumbList, CreativeWork (graph of 4 projects) | Good |
| Services | BreadcrumbList, ProfessionalService + OfferCatalog, FAQPage (6 Q&As) | Excellent |
| Case Studies | BreadcrumbList, CollectionPage + CreativeWork parts | Good |
| ProcessSection | HowTo (4 steps) | ⚠️ Client-rendered |
| TestimonialsSection | FAQPage (additional Q&As) | Good |

### ✅ What's Working
- Organization has `AggregateRating` (5/5, 3 reviews) and `sameAs` with Wikidata
- Person schema for Prashant with `knowsAbout` and `sameAs`
- FAQPage on Services with 6 well-written Q&As
- HowTo schema for the 4-step process
- SpeakableSpecification targeting `.sr-only` content
- OfferCatalog listing 3 service categories
- CollectionPage schema on Case Studies

### ⚠️ Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| S1 | **HowTo schema is in a `"use client"` component** (`ProcessSection.jsx`) — some crawlers may not execute JS to find it | High | Move HowTo schema to a Server Component or the page-level `page.jsx` |
| S2 | **No `Review` schema with individual reviews** — only `AggregateRating` on Organization | Medium | Add individual Review schemas from the testimonials |
| S3 | ProfessionalService in root layout has `priceRange: "$$"` — not meaningful without context | Low | Remove or replace with actual price range |
| S4 | `SiteNavigationElement` doesn't include `/case-studies` in its `hasPart` | Low | Add case studies link |
| S5 | `WebSite` schema missing `potentialAction: SearchAction` (mentioned in AGENTS.md but not present in code) | Low | Add if site has search; otherwise skip |
| S6 | FAQPage in TestimonialsSection is also client-rendered | Medium | Move to page-level or ensure SSR |

---

## 4. Content Quality / E-E-A-T (75/100)

### Experience & Expertise Signals

| Signal | Present | Notes |
|--------|---------|-------|
| Founder identity | ✅ | Person schema, GitHub, LinkedIn, X links |
| Real project metrics | ✅ | Case studies with timelines, results, tech stack |
| Client testimonials | ✅ | 3 testimonials with author/role/project |
| Technical depth | ✅ | Services page shows process for each offering |
| sr-only GEO blocks | ✅ | 3 comprehensive blocks on home page |
| llms.txt | ✅ | 76 lines of structured entity data |

### Trust Signals

| Signal | Present | Notes |
|--------|---------|-------|
| AggregateRating | ✅ | 5/5 with 3 reviews |
| Post-launch support | ✅ | Mentioned in services FAQ and process |
| 100% satisfaction claim | ⚠️ | Used in sr-only + llms.txt — needs substantiation |
| Client names | ✅ | Finlytix, LaunchBright, Stellar Labs in testimonials |

### ⚠️ Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| E1 | **No blog section** — no long-tail content, no educational posts, no case study deep-dives | High | Add blog with SEO-optimized articles |
| E2 | **"12+ projects" and "100% satisfaction"** claims need more substantiation or linking to actual case studies | Medium | Link these claims to /case-studies |
| E3 | **No team page or team schema** — only founder | Low | Acceptable for solo operation |
| E4 | **No "About" content visible on home page** — E-E-A-T signals are in sr-only blocks only | Low | Consider adding visible trust indicators |

---

## 5. GEO — AI Citation Readiness (88/100)

### ✅ What's Working

**llms.txt** — Excellent:
- Clear definition ("What is Meteoric?")
- Key stats section with quantified metrics
- Services breakdown
- Portfolio with links
- Citation guidelines for AI
- Internal links section

**sr-only blocks on Home** — 3 comprehensive paragraphs:
1. Company overview + stats + portfolio references
2. Process breakdown with timelines
3. Founder background + values

**Speakable schema** — Targets `.sr-only` CSS selector

**Structured data** — Organization, Person, FAQPage all help AI systems

### ⚠️ Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| G1 | **No `llms.txt` link in HTML `<head>`** — AI crawlers find it via convention but explicit linking helps | Low | Add `<link rel="alternate" href="/llms.txt" type="text/plain">` to layout |
| G2 | **`/case-studies` page has no sr-only GEO blocks** — missed citation opportunity | Medium | Add sr-only summary blocks with metrics |
| G3 | **No comparison/definition content** — AI chatbots prefer to cite "What is X?" and "X vs Y" content | Medium | Add definition and comparison content blocks |
| G4 | **Missing `llms-full.txt` reference in `llms.txt`** — some AI crawlers look for it | Low | Add link to `llms-full.txt` in `llms.txt` |

---

## 6. AEO — Answer Engine Optimization (72/100)

### ✅ What's Working
- FAQPage schema on Services with 6 Q&As
- Additional FAQPage schema from TestimonialsSection
- Speakable schema for voice search
- Clear, direct answer formatting in FAQ
- Well-structured process content

### ⚠️ Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| A1 | **No FAQ on Home page** — missed featured snippet opportunity for "What is Meteoric?" | Medium | Add 3-4 Q&As to home page |
| A2 | **No pricing page or pricing schema** — "how much does X cost" queries go unanswered | Medium | Add pricing overview page |
| A3 | **FAQ answers could be more direct** — some start with filler ("Pricing depends on...") | Low | Lead with the direct answer |
| A4 | **No comparison content** — "Next.js vs [alternative]", "MERN vs [stack]" | Low | Add if blog section is created |

---

## Priority Fix Plan

### P0 — This Week
1. **Move HowTo schema to server-side** (`app/(marketing)/page.jsx` or new component) — S1
2. **Add llms.txt link to layout head** — G1 (1 line)
3. **Add `/case-studies` to SiteNavigationElement schema** — S4

### P1 — This Month
4. **Create `/services/saas-development` and `/services/startup-web-development` pillar pages** instead of redirecting — biggest GEO gap (AGENTS.md TODO)
5. **Add individual Review schemas** from testimonials — S2
6. **Add sr-only blocks to `/case-studies` page** — G2
7. **Add FAQ section to home page** — A1
8. **Fix TestimonialsSection FAQ to render server-side** — S6

### P2 — This Quarter
9. **Start a blog** with educational content for long-tail keywords — E1
10. **Generate page-specific OG images** — O1
11. **Add pricing overview page** — A2
12. **Add comparison/definition content** blocks — G3, A4

### P3 — Nice to Have
13. Add `twitter:site` to homepage metadata — O2
14. Remove `priceRange: "$$"` from ProfessionalService — S3
15. Verify `site.webmanifest` exists — T1
16. Add `llms-full.txt` link to `llms.txt` — G4

---

## Appendix: Schema Code Locations

| Schema | File | Line |
|--------|------|------|
| Organization + WebSite + ProfessionalService + SiteNavigationElement | `app/layout.jsx` | 81-161 |
| BreadcrumbList + Speakable (Home) | `app/(marketing)/page.jsx` | 40-56 |
| BreadcrumbList + Person (About) | `app/(marketing)/about/page.jsx` | 38-73 |
| BreadcrumbList + CreativeWork (Work) | `app/(marketing)/work/page.jsx` | 39-62 |
| BreadcrumbList + ProfessionalService + FAQPage (Services) | `app/(marketing)/services/page.jsx` | 39-124 |
| BreadcrumbList + CollectionPage (Case Studies) | `app/(marketing)/case-studies/page.jsx` | 22-43 |
| HowTo (Process) | `src/components/sections/ProcessSection.jsx` | 49-54 |
| FAQPage (Testimonials) | `src/components/sections/TestimonialsSection.jsx` | via `buildFaqJsonLd` |
| JSON-LD helpers | `src/lib/seo/jsonLd.js` | 1-27 |
| Sitemap config | `src/lib/seo/config.js` | 5-13 |
| Dynamic sitemap | `app/sitemap.js` | 1-11 |
