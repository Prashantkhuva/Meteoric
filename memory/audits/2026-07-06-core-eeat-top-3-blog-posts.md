---
class: auditor-output
---

# CORE-EEAT Audit Report — Meteoric Blog (Top 3 Posts)

**Audit Date**: 2026-07-06
**Auditor**: content-quality-auditor v7.1

## Overview

| Post | Word Count | Type | Final Score | Verdict |
|------|-----------|------|-------------|---------|
| MongoDB Schema Design for SaaS Billing | ~1,100 | Technical Guide | **72/100** | SHIP |
| GSAP vs Framer Motion: Production Guide | ~1,000 | Technical Comparison | **70/100** | SHIP |
| Building an MVP in 3 Weeks: Case Study | ~600 | Case Study | **65/100** | SHIP |

No veto items triggered across any post. All three are publish-ready with recommended improvements.

---

## Audit 1: MongoDB Schema Design for SaaS Billing

### Audit Setup

**Content Type**: Technical Guide
**Dimension Weights**: C=20%, O=15%, R=15%, E=10%, Exp=10%, Ept=15%, A=5%, T=10%

### CORE Score: 70/100

#### C — Contextual Clarity (Score: 75/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| C01 | Intent Alignment | Pass | Clearly a technical schema design guide for SaaS billing |
| C02 | Direct Answer | Pass | Opens with the problem, closes with actionable approach |
| C03 | Scannability | Partial | Good headings, but no table of contents or summary box |
| C04 | Audience Match | Pass | Targets developers building SaaS billing — correct level |
| C05 | Terminology | Pass | MongoDB terms explained inline |
| C06 | Scope Discipline | Pass | Stays focused on billing schema, doesn't drift |
| C07 | Examples | Partial | Mentions formulas but no code snippets or JSON examples |
| C08 | Logical Flow | Pass | Collections → embedding → proration → metering → invoices → Stripe |
| C09 | TL;DR | Fail | No executive summary or key takeaways section |
| C10 | Semantic Closure | Pass | Ends with Stripe integration insight — satisfying conclusion |

#### O — Organization (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| O01 | Structure | Pass | Clear H2 sections |
| O02 | Headers | Pass | Descriptive, scannable headers |
| O03 | Lists | Partial | Mentions "four main collections" but no bullet list of them |
| O04 | Tables | Fail | No comparison tables (embedded vs referenced, collection schema) |
| O05 | Visual Hierarchy | Pass | H2 → paragraph flow works |
| O06 | Progressive Disclosure | Partial | Deep content but no "skip to" anchors |
| O07 | Length Appropriate | Pass | 9 min read matches depth |
| O08 | Section Balance | Pass | Sections similar length |
| O09 | Navigation Aids | Fail | No TOC, no back-to-top |
| O10 | Closing Section | Partial | Ends with "key insight" — good, but could be stronger CTA |

#### R — Referenceability (Score: 65/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| R01 | Statistics | Fail | No data, benchmarks, or performance numbers |
| R02 | External Sources | Fail | No links to MongoDB docs, Stripe docs, or references |
| R03 | Case References | Pass | References production experience at Meteoric |
| R04 | Data Freshness | Pass | Published July 2026, current |
| R05 | Verifiable Claims | Partial | "Works up to 100,000 events per month" — source? |
| R06 | Research Depth | Partial | Shows experience but no cited research |
| R07 | Comparisons | Pass | Embedded vs referenced comparison is strong |
| R08 | Methodology | Fail | No explanation of how schema was tested/validated |
| R09 | Reproducibility | Partial | Developer could follow, but no code snippets |
| R10 | Data Consistency | Pass | All claims internally consistent |

#### E — Exclusivity (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| E01 | Unique Angle | Pass | Production-tested billing schemas from 12+ projects |
| E02 | Original Research | Partial | Experience-based but no original benchmarking |
| E03 | Proprietary Data | Partial | Mentions "our rule" for embedding — good, but light |
| E04 | Insider Knowledge | Pass | Clearly from real production experience |
| E05 | Framework/Method | Pass | Embed active, reference history — a clear methodology |
| E06 | Beyond Generic | Partial | Better than MongoDB docs, but not unique enough |
| E07 | First-Hand | Pass | Written by someone who built these systems |
| E08 | Contrarian View | Partial | "Stripe is not source of truth" — mildly contrarian |
| E09 | Timeliness | Pass | 2026 billing challenges are current |
| E10 | Niche Authority | Pass | Narrow topic where Meteoric can win |

### EEAT Score: 74/100

#### Exp — Experience (Score: 80/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| Exp01 | First-Person | Pass | "After building billing systems for multiple SaaS products at Meteoric" |
| Exp02 | Specific Examples | Pass | Real collections, real tradeoffs |
| Exp03 | Practical Detail | Pass | Proration formula given explicitly |
| Exp04 | Anecdotal | Pass | "100,000 events per month" threshold from experience |
| Exp05 | Lessons Learned | Partial | Could add "what went wrong" examples |
| Exp06 | Before/After | Fail | No before/after of bad vs good schema |
| Exp07 | Context | Pass | Explains why each decision was made |
| Exp08 | Scope Realism | Pass | Practical, not theoretical |
| Exp09 | Hands-On Detail | Pass | Aggregation pipeline mentioned specifically |
| Exp10 | Practitioner Voice | Pass | Reads like a developer, not a content marketer |

#### Ept — Expertise (Score: 75/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| Ept01 | Technical Accuracy | Pass | Schema design patterns are correct |
| Ept02 | Depth | Pass | Goes into proration math, aggregation, embedding tradeoffs |
| Ept03 | Terminology | Pass | Correct MongoDB terms ($bucket, aggregation pipeline) |
| Ept04 | Scope Match | Pass | Appropriate depth for target audience |
| Ept05 | Common Mistakes | Partial | Mentions "common mistake" with embedding vs references |
| Ept06 | Best Practices | Pass | Embeds active subscription, snapshots invoice pricing |
| Ept07 | Nuance | Pass | Explains tradeoffs, not just one approach |
| Ept08 | Complexity Acknowledged | Pass | "Seems simple until you actually build it" |
| Ept09 | Advanced Insights | Partial | $bucket aggregation is a good advanced touch |
| Ept10 | Author Credibility | Partial | No bio or credentials section visible on page |

#### A — Authority (Score: 60/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| A01 | Backlinks | N/A | Site-level — insufficient data |
| A02 | Brand Mentions | N/A | Site-level — insufficient data |
| A03 | Domain Authority | N/A | Site-level — insufficient data |
| A04 | Author Bio | Partial | Mentions Meteoric but no individual author bio |
| A05 | External Validation | Fail | No links to shipped billing systems or client references |
| A06 | Peer References | Fail | No citations from industry |
| A07 | Social Proof | Partial | Could mention number of projects (12+) |
| A08 | Publication Recency | Pass | Published July 2026 |
| A09 | Publishing Platform | Partial | Medium-authority domain |
| A10 | Consistency | Pass | Matches Meteoric's brand voice |

#### T — Trust (Score: 80/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| T01 | Transparency | Pass | Clear about being Meteoric's approach |
| T02 | Bias Acknowledged | Pass | Honest about tradeoffs in each approach |
| T03 | HTTPS | Pass | Site is on HTTPS |
| T04 | Affiliate Disclosure | Pass | No affiliate links — clean |
| T05 | Editorial Policy | N/A | Site-level |
| T06 | Factual Claims | Pass | Technical claims are accurate |
| T07 | Balanced View | Pass | Acknowledges when to deviate from approach |
| T08 | Updates/Fixes | Fail | No changelog or last-updated note |
| T09 | Reviews | N/A | Not applicable for technical guide |
| T10 | Contact Info | Pass | Site has contact flow |

### Score Summary

| Dimension | Raw Score | Weight | Weighted |
|-----------|-----------|--------|----------|
| C — Contextual Clarity | 75 | 20% | 15.0 |
| O — Organization | 70 | 15% | 10.5 |
| R — Referenceability | 65 | 15% | 9.8 |
| E — Exclusivity | 70 | 10% | 7.0 |
| Exp — Experience | 80 | 10% | 8.0 |
| Ept — Expertise | 75 | 15% | 11.3 |
| A — Authority | 60 | 5% | 3.0 |
| T — Trust | 80 | 10% | 8.0 |

**Weighted Total: 72/100**
**GEO Score (CORE)**: (75+70+65+70)/4 = **70/100**
**SEO Score (EEAT)**: (80+75+60+80)/4 = **74/100**

### Verdict: SHIP

**Critical issues**: None. No veto items triggered (C01 Pass, R10 Pass, T04 Pass).

---

## Audit 2: GSAP vs Framer Motion — Production Guide

### Audit Setup

**Content Type**: Technical Comparison / Blog Post
**Dimension Weights**: C=20%, O=15%, R=15%, E=10%, Exp=10%, Ept=15%, A=5%, T=10%

### CORE Score: 68/100

#### C — Contextual Clarity (Score: 75/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| C01 | Intent Alignment | Pass | Clear comparison — reader knows what to expect |
| C02 | Direct Answer | Pass | "The Short Answer" section gives immediate verdict |
| C03 | Scannability | Partial | No code blocks or visual examples |
| C04 | Audience Match | Pass | Targets developers evaluating animation libs |
| C05 | Terminology | Pass | GSAP, ScrollTrigger, AnimatePresence explained |
| C06 | Scope Discipline | Pass | Stays focused on comparison, doesn't drift |
| C07 | Examples | Partial | Describes use cases but no code |
| C08 | Logical Flow | Pass | Short answer → bundle → GSAP wins → FM wins → our stack |
| C09 | TL;DR | Partial | "The Short Answer" acts as TL;DR |
| C10 | Semantic Closure | Pass | "Using both gives best of both worlds" — strong close |

#### O — Organization (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| O01 | Structure | Pass | Clear H2 breakdown |
| O02 | Headers | Pass | "When GSAP Wins" / "When Framer Motion Wins" — clear |
| O03 | Lists | Fail | No pros/cons lists, bullet comparisons |
| O04 | Tables | Fail | No comparison table (would be ideal here) |
| O05 | Visual Hierarchy | Pass | H2 structure works |
| O06 | Progressive Disclosure | Partial | Could add "Jump to decision" link |
| O07 | Length Appropriate | Pass | 10 min read matches depth |
| O08 | Section Balance | Pass | GSAP wins and FM wins are balanced |
| O09 | Navigation Aids | Fail | No TOC, no back-to-top |
| O10 | Closing Section | Partial | "Our Stack" is good but could be stronger decision framework |

#### R — Referenceability (Score: 60/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| R01 | Statistics | Partial | Bundle size numbers provided (14KB, 25-35KB, 30-40KB) |
| R02 | External Sources | Fail | No links to GSAP docs, Framer Motion docs, or bundle analysis tools |
| R03 | Case References | Partial | References 12+ projects but no specific links |
| R04 | Data Freshness | Pass | Published July 2026 |
| R05 | Verifiable Claims | Partial | Bundle sizes are verifiable but no source cited |
| R06 | Research Depth | Partial | Good analysis but no external measurements |
| R07 | Comparisons | Pass | Central comparison is the entire post — strong |
| R08 | Methodology | Fail | No explanation of how bundle sizes were measured |
| R09 | Reproducibility | Partial | Developer could test claims |
| R10 | Data Consistency | Pass | All numbers internally consistent |

#### E — Exclusivity (Score: 60/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| E01 | Unique Angle | Partial | Many GSAP vs FM posts exist |
| E02 | Original Research | Partial | Bundle size analysis is somewhat unique |
| E03 | Proprietary Data | Partial | "Our stack at Meteoric" is unique |
| E04 | Insider Knowledge | Pass | Real production experience with both |
| E05 | Framework/Method | Pass | Decision framework — use case matching |
| E06 | Beyond Generic | Partial | Richer than most but still familiar format |
| E07 | First-Hand | Pass | Written by someone shipping both daily |
| E08 | Contrarian View | Pass | "Bundle size difference is smaller than assumed" — contrarian |
| E09 | Timeliness | Pass | 2026 versions, current |
| E10 | Niche Authority | Partial | Good but saturated topic |

### EEAT Score: 73/100

#### Exp — Experience (Score: 80/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| Exp01 | First-Person | Pass | "I use both GSAP and Framer Motion in production every week" |
| Exp02 | Specific Examples | Pass | Parallax, modals, SVG animation, gesture interactions |
| Exp03 | Practical Detail | Pass | Bundle sizes, import patterns |
| Exp04 | Anecdotal | Partial | Could use more "when I ran into problems" stories |
| Exp05 | Lessons Learned | Partial | "Most advice gets it wrong" — good contrarian take |
| Exp06 | Before/After | Pass | GSAP→FM migration examples implicit in comparison |
| Exp07 | Context | Pass | Explains WHEN to use each, not just what they do |
| Exp08 | Scope Realism | Pass | Honest about both having similar bundle sizes |
| Exp09 | Hands-On Detail | Pass | Import strategy details |
| Exp10 | Practitioner Voice | Pass | Clearly from hands-on developer |

#### Ept — Expertise (Score: 75/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| Ept01 | Technical Accuracy | Pass | All claims about libraries are accurate |
| Ept02 | Depth | Pass | Goes beyond surface to bundle analysis, animation types |
| Ept03 | Terminology | Pass | Uses correct GSAP/FM terminology |
| Ept04 | Scope Match | Pass | Appropriate for comparing animation libraries |
| Ept05 | Common Mistakes | Pass | "Bundle size myth" is a common mistake identified |
| Ept06 | Best Practices | Pass | Tree-shaking, import strategies |
| Ept07 | Nuance | Pass | "Similar weights for equivalent functionality" |
| Ept08 | Complexity Acknowledged | Pass | "Picking the wrong one means fighting the tool" |
| Ept09 | Advanced Insights | Partial | Could add advanced: reflow performance, GPU composition |
| Ept10 | Author Credibility | Partial | Mentions 12+ projects but no formal bio |

#### A — Authority (Score: 55/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| A01 | Backlinks | N/A | Site-level |
| A02 | Brand Mentions | N/A | Site-level |
| A03 | Domain Authority | N/A | Site-level |
| A04 | Author Bio | Partial | No individual author attribution |
| A05 | External Validation | Fail | No links to projects using this stack |
| A06 | Peer References | Fail | No citations |
| A07 | Social Proof | Partial | 12+ projects mentioned |
| A08 | Publication Recency | Pass | July 2026 |
| A09 | Publishing Platform | Partial | Startup blog, medium authority |
| A10 | Consistency | Pass | Matches site tone |

#### T — Trust (Score: 80/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| T01 | Transparency | Pass | Clear about Meteoric using both |
| T02 | Bias Acknowledged | Pass | Honest about where each excels |
| T03 | HTTPS | Pass | |
| T04 | Affiliate Disclosure | Pass | No affiliate links |
| T05 | Editorial Policy | N/A | |
| T06 | Factual Claims | Pass | Accurate |
| T07 | Balanced View | Pass | Gives both libraries fair treatment |
| T08 | Updates/Fixes | Fail | No last-updated note |
| T09 | Reviews | N/A | |
| T10 | Contact Info | Pass | |

### Score Summary

| Dimension | Raw Score | Weight | Weighted |
|-----------|-----------|--------|----------|
| C | 75 | 20% | 15.0 |
| O | 70 | 15% | 10.5 |
| R | 60 | 15% | 9.0 |
| E | 60 | 10% | 6.0 |
| Exp | 80 | 10% | 8.0 |
| Ept | 75 | 15% | 11.3 |
| A | 55 | 5% | 2.8 |
| T | 80 | 10% | 8.0 |

**Weighted Total: 70/100**
**GEO Score (CORE)**: (75+70+60+60)/4 = **66/100**
**SEO Score (EEAT)**: (80+75+55+80)/4 = **73/100**

### Verdict: SHIP

**Critical issues**: None. No veto items triggered.

---

## Audit 3: Building an MVP in 3 Weeks — Case Study

### Audit Setup

**Content Type**: Case Study
**Dimension Weights**: C=15%, O=15%, R=20%, E=10%, Exp=15%, Ept=10%, A=5%, T=10%

### CORE Score: 63/100

#### C — Contextual Clarity (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| C01 | Intent Alignment | Pass | Clearly an MVP case study |
| C02 | Direct Answer | Pass | "21 days, seed round closed" — result upfront |
| C03 | Scannability | Partial | Week-by-week but no timeline visual |
| C04 | Audience Match | Pass | Startup founders evaluating MVP |
| C05 | Terminology | Pass | Supabase, Next.js, Figma — correct |
| C06 | Scope Discipline | Pass | Focused on one project |
| C07 | Examples | Partial | Describes scope but no screenshots |
| C08 | Logical Flow | Pass | Week 1 → Week 2 → Week 3 → Result |
| C09 | TL;DR | Fail | No executive summary |
| C10 | Semantic Closure | Partial | Result stated but no "what we'd do differently" |

#### O — Organization (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| O01 | Structure | Pass | Weekly breakdown |
| O02 | Headers | Pass | "Week 1: Scope and Architecture" |
| O03 | Lists | Partial | No bullet list of tech decisions |
| O04 | Tables | Fail | No timeline table, no feature comparison |
| O05 | Visual Hierarchy | Pass | Clean |
| O06 | Progressive Disclosure | Partial | Short enough not to need it |
| O07 | Length Appropriate | Pass | 8 min |
| O08 | Section Balance | Pass | Even |
| O09 | Navigation Aids | Fail | No TOC |
| O10 | Closing Section | Partial | Result is stated but weak CTA |

#### R — Referenceability (Score: 50/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| R01 | Statistics | Pass | "21 days", "200+ beta users", "seed round closed" |
| R02 | External Sources | Fail | No links to the product, no testimonials |
| R03 | Case References | Pass | Refers to the specific project |
| R04 | Data Freshness | Pass | May 2026 |
| R05 | Verifiable Claims | Partial | Seed round claim — unverifiable without link |
| R06 | Research Depth | Partial | Week-level detail is good |
| R07 | Comparisons | Fail | No comparison to alternative approach |
| R08 | Methodology | Partial | Describes process but no formal framework |
| R09 | Reproducibility | Partial | Other founders could follow approach |
| R10 | Data Consistency | Pass | Consistent |

#### E — Exclusivity (Score: 60/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| E01 | Unique Angle | Partial | Many MVP case studies |
| E02 | Original Research | Partial | Real 3-week timeline is unique data |
| E03 | Proprietary Data | Pass | Meteoric's actual process |
| E04 | Insider Knowledge | Pass | Behind-the-scenes of real project |
| E05 | Framework/Method | Partial | Week-by-week process is a framework |
| E06 | Beyond Generic | Partial | More specific than average |
| E07 | First-Hand | Pass | Written by builder |
| E08 | Contrarian View | Partial | "Design in browser" is mildly contrarian |
| E09 | Timeliness | Pass | 2026 |
| E10 | Niche Authority | Partial | Good but short |

### EEAT Score: 68/100

#### Exp — Experience (Score: 75/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| Exp01 | First-Person | Pass | "A fintech founder came to us" |
| Exp02 | Specific Examples | Pass | Detailed week-by-week |
| Exp03 | Practical Detail | Pass | Design in browser, Supabase setup |
| Exp04 | Anecdotal | Pass | Whiteboarding story |
| Exp05 | Lessons Learned | Partial | Implicit but not explicit |
| Exp06 | Before/After | Pass | Before: concept → After: funded |
| Exp07 | Context | Pass | Explains why each decision was made |
| Exp08 | Scope Realism | Pass | Honest about what was cut |
| Exp09 | Hands-On Detail | Pass | Architecture decisions explained |
| Exp10 | Practitioner Voice | Pass | |

#### Ept — Expertise (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| Ept01 | Technical Accuracy | Pass | Stack choices are correct |
| Ept02 | Depth | Partial | High-level, misses technical details |
| Ept03 | Terminology | Pass | |
| Ept04 | Scope Match | Partial | Deeper technical breakdown would help |
| Ept05 | Common Mistakes | Partial | "Most things on 'later' list never needed to be built" |
| Ept06 | Best Practices | Pass | Supabase, browser-first design |
| Ept07 | Nuance | Pass | Acknowledges tradeoffs |
| Ept08 | Complexity Acknowledged | Pass | |
| Ept09 | Advanced Insights | Partial | Could add pricing/architecture decisions |
| Ept10 | Author Credibility | Partial | No author bio |

#### A — Authority (Score: 50/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| A01-A03 | Site-level | N/A | |
| A04 | Author Bio | Fail | Not attributed to named author |
| A05 | External Validation | Fail | No client testimonial or quantified results link |
| A06 | Peer References | Fail | |
| A07 | Social Proof | Partial | "seed round closed" |
| A08 | Publication Recency | Pass | May 2026 |
| A09 | Publishing Platform | Partial | |
| A10 | Consistency | Pass | |

#### T — Trust (Score: 70/100)

| ID | Check | Score | Notes |
|----|-------|-------|-------|
| T01 | Transparency | Pass | Clear about Meteoric's role |
| T02 | Bias Acknowledged | Pass | |
| T03-T05 | Site-level | N/A | |
| T06 | Factual Claims | Pass | |
| T07 | Balanced View | Pass | Mentions what was cut |
| T08 | Updates/Fixes | Fail | No update note |
| T09 | Reviews | N/A | |
| T10 | Contact Info | Pass | |

### Score Summary

| Dimension | Raw Score | Weight | Weighted |
|-----------|-----------|--------|----------|
| C | 70 | 15% | 10.5 |
| O | 70 | 15% | 10.5 |
| R | 50 | 20% | 10.0 |
| E | 60 | 10% | 6.0 |
| Exp | 75 | 15% | 11.3 |
| Ept | 70 | 10% | 7.0 |
| A | 50 | 5% | 2.5 |
| T | 70 | 10% | 7.0 |

**Weighted Total: 65/100**
**GEO Score (CORE)**: (70+70+50+60)/4 = **63/100**
**SEO Score (EEAT)**: (75+70+50+70)/4 = **66/100**

### Verdict: SHIP

**Critical issues**: None. No veto items triggered.

---

## Cross-Post Findings

### Should-Fix (applies to all 3 posts)

1. **No code snippets or visual examples** — All 3 posts are text-only. Adding code blocks, JSON schemas, or comparison tables would significantly improve O, R, and GEO scores.
2. **No author byline/bio** — Posts lack individual author attribution. Adding "By Prashant Khuva, Founder & Lead Developer at Meteoric" with bio link would boost Ept and A scores.
3. **No external references** — None link to docs, source code, or third-party validations. Adding 2-3 authoritative links per post improves R score.
4. **No TL;DR / executive summary** — Especially for the 9-10 min reads. A bolded 2-sentence summary at the top helps GEO extraction.
5. **No last-updated date** — Adding `dateModified` to the schema and showing it in the UI would improve T08.

### Post-Specific Improvements

**MongoDB Billing (72 → potential 85):**
- Add 2-3 code snippets (schema examples, aggregation pipeline)
- Add a comparison table (embedded vs referenced)
- Reference MongoDB documentation

**GSAP vs Framer Motion (70 → potential 83):**
- Add a comparison decision table (15 use cases, which lib wins)
- Add bundle size benchmark methodology
- Link to live Meteoric site sections using each library

**MVP Case Study (65 → potential 80):**
- Add screenshots or mockups of the prototype
- Add a timeline infographic (text-based table)
- Add quantified results ($ raised, users signed up)
- Add "What we'd do differently" section

### Quick Wins (30 min each)

- [ ] Add author byline to all 3 posts
- [ ] Add TL;DR section to MongoDB and GSAP posts
- [ ] Add `dateModified` to blog schema rendering
- [ ] Add 1-2 external reference links per post

### Medium Effort (1-2 hours each)

- [ ] Add code snippets to MongoDB post (2-3 examples)
- [ ] Add comparison table to GSAP post
- [ ] Add timeline table to MVP case study

```yaml
status: DONE
objective: "CORE-EEAT audit of top 3 Meteoric blog posts — MongoDB billing, GSAP vs FM, MVP case study"
cap_applied: false
raw_overall_score: 69
final_overall_score: 69
key_findings:
  - title: "No code or visual examples across any post"
    severity: high
    evidence: "All 3 posts are pure text — no code blocks, JSON, tables, or images beyond cover photos"
  - title: "No author attribution"
    severity: high
    evidence: "None of the 6 posts have an individual author byline, bio, or credentials section"
  - title: "Weak external sourcing"
    severity: medium
    evidence: "0 external reference links across all 3 posts — no docs, benchmarks, or citations"
  - title: "No TL;DR or executive summaries"
    severity: medium
    evidence: "Posts jump straight into content — GEO extraction would benefit from bolded summaries"
  - title: "MVP case study lacks quantified results"
    severity: low
    evidence: "Mentions seed round closed but no specific dollar amount, user count, or timeline metrics"
evidence_summary: "3 blog posts audited: MongoDB billing (72), GSAP vs FM (70), MVP case study (65)"
open_loops:
  - "Add author byline to blog.js data structure"
  - "Add dateModified field and UI rendering to blog posts"
  - "Consider adding a codeBlocks type to blog.js content model"
recommended_next_skill: "internal-linking-optimizer"
```
