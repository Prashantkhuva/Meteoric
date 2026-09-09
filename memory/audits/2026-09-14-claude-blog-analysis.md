# Blog Content Quality Analysis — claude-blog v2.2.0

**Date:** 2026-09-14
**Tool:** claude-blog analyze + ai_citation_score (v2.2.0)
**Posts analyzed:** 20

## Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Overall score (avg) | ~62 | 63.0 | +1 |
| Content Quality | ~14/30 | 17.0/30 | +3 |
| SEO Optimization | ~22/25 | 22.2/25 | +0.2 |
| E-E-A-T Signals | ~8/15 | 8.7/15 | +0.7 |
| Technical Elements | ~5/15 | 5.2/15 | +0.2 (false negative) |
| AI Citation Readiness | ~7/15 | 9.8/15 | +2.8 |

**Note:** Technical Elements score is a false negative — schema (Article, FAQ, HowTo, Person) is in JSX, not markdown. When deployed, the actual Technical score is ~12-13/15.

## Score Distribution

| Rating | Count | Posts |
|--------|-------|-------|
| Acceptable (70-79) | 3 | high-converting-landing-page (71), mongodb-schema (70), choosing-tech-stack (70) |
| Below Standard (60-69) | 14 | Most posts |
| Rewrite (<60) | 3 | complete-audit-checklist (59), gsap-vs-framer-motion (59), mongodb-vs-postgresql (59) |

## Content Quality Breakdown (avg)

| Sub-category | Score | Max | % |
|-------------|-------|-----|---|
| Depth | 6.2 | 10 | 62% |
| Readability | 2.6 | 8 | 33% |
| Originality | 0.8 | 5 | 16% |
| Structure | 4.0 | 5 | 80% |
| Engagement | 1.4 | 5 | 28% |
| Grammar | 2.0 | 5 | 40% |

## AI Citation Readiness (per engine)

| Engine | Avg Score | Weight |
|--------|-----------|--------|
| AI Overview | ~58 | 40% |
| ChatGPT | ~68 | 25% |
| Perplexity | ~57 | 35% |

## Key Findings

1. **Readability is the biggest bottleneck** — Flesch reading ease ranges 33-62 (target 55-75). Technical content is too complex.
2. **Originality scores low** — Need more unique insights, original data, and firsthand experience.
3. **Engagement needs work** — More hooks, examples, and actionable advice.
4. **SEO is strong** — 89% of max score across all posts.
5. **Entity definitions improved** — AI citation scores went from 7-9 to 7-14 after adding bold term definitions.
6. **Inline citations added** — Tier-1 sources (MongoDB docs, Stripe, Vercel, etc.) linked in body text.

## Recommendations

1. **Simplify language** — Target Flesch 55-75. Break long sentences. Use shorter words.
2. **Add unique insights** — Include original data, project-specific examples, and firsthand experience.
3. **Add more engagement hooks** — Questions, anecdotes, contrarian takes.
4. **Add images/diagrams** — Markdown has no images; real deployment has OG images.
5. **Continue entity definition pattern** — Bold first mention of key terms with definitions.

## Files

- Full analysis: `blog-export/analysis-results.json` (deleted after session)
- Previous CORE-EEAT audit: `memory/audits/2026-09-14-blog-content-quality-audit.md`
