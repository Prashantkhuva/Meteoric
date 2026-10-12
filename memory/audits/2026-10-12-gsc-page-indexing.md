# GSC Page Indexing Audit — withmeteoric.com

**Date:** 2026-10-12
**Scope:** Google Search Console "Page indexing" report (validations started 22/09/2026)
**Method:** technical-seo-checker bulk mode — pattern-level analysis of all reported URL groups, verified against live site (HTTP status/redirect checks) and repo state (sitemap, redirects, internal links, llms.txt).

## Baseline (measured 2026-10-12)

- Live sitemap: 40 URLs, matches repo exactly (16 static + 4 work + 5 services + 15 blog).
- Redirects working: `www → apex` 308, `http → https` 301, `/technologies/* → /services` 308, retired service slugs → `/services` 308 (proxy.js host/case/`?q=`/double-slash normalization also live).
- Internal links to removed content: clean (2026-09-30 audit fixes landed; llms.txt/llms-full.txt have no dead URLs).
- Repo `main` clean, in sync with production.

## Findings by bucket

| Bucket | Pages | Cause | Status / action |
|---|---|---|---|
| Page with redirect | 36 | Legacy URLs: www/http host variants (~20), old `/technologies/*` (~6), retired service slugs (~6), removed blog posts (~7). All intentional 301/308s; none in sitemap; no internal links remain | No code bug. Drains as Google reprocesses (1–4 wks). GSC hygiene: drop stale sitemaps |
| Not found (404) | 4 | `services/seo-content-strategy`, `services/performance-optimization`, `services/landing-page-design` never existed in current repo (old-site residue / old sitemap); `/$` = junk probe | **Fixed:** 301 → `/services` added in `next.config.mjs` (2026-10-12). `/$` self-resolves as 404 |
| Crawled – currently not indexed | 5 | 2× `_next/static/media/*.woff2` font assets (crawl noise, harmless); new post `/blog/cafe-restaurant-website-design-gujarat` (crawled 10 Oct, needs time); removed post on www; `/services/landing-pages` (stale 12 Jul www crawl) | Request indexing for canonical `/services/landing-pages` + cafe post. Fonts: no action (do not robots-block assets) |
| Excluded by noindex | 1 | `/blog/react-vs-nextjs-for-startup-websites` — post removed; URL now returns 404. noindex snapshot from 28 Sept is stale | No action; clears on recrawl |
| Alternative page with proper canonical | 2 | Normal | None |
| Redirect error | 1 | Suspected `//` double-slash; fix already live in `proxy.js:79` | Confirm with example URL in GSC |
| Blocked by robots.txt | 1 | Likely `/preview` `/share` `?q=` rule (intended) | Confirm with example URL in GSC |
| Discovered – currently not indexed | 3 | Normal working state | None |

## Actions

### Done (repo)
- [x] `next.config.mjs`: 301 redirects for the 3 dead service slugs → `/services`

### Manual — Cloudflare (GEO conflict)
Live `robots.txt` carries Cloudflare-managed `Disallow: /` for GPTBot, ClaudeBot, anthropic-ai, Google-Extended, etc. — conflicts with GEO policy in AGENTS.md (allow AI crawlers for citations). Googlebot is NOT blocked, so GSC indexing is unaffected.
- [ ] Dashboard → zone `withmeteoric.com` → Security → Bots → disable AI-scraper blocking
- [ ] Security → Settings → Content Signals → relax/remove robots.txt content-signals additions
- [ ] Verify: `curl -s https://withmeteoric.com/robots.txt` no longer disallows GPTBot/ClaudeBot/Google-Extended

### Manual — Google Search Console (browser)
- [ ] Sitemaps tab: delete stale sitemap entries; keep only `https://withmeteoric.com/sitemap.xml` (40 URLs)
- [ ] URL Inspection → Request indexing: `https://withmeteoric.com/services/landing-pages`
- [ ] URL Inspection → Request indexing: `https://withmeteoric.com/blog/cafe-restaurant-website-design-gujarat`
- [ ] After deploy: re-open the 3 failed validations; expect drain within 1–4 weeks
- [ ] Grab example URLs for the lone "Redirect error" and "Blocked by robots.txt" entries to confirm coverage

## Expected drain timeline
- Redirect + 404 buckets: shrink at each Google recrawl cycle, gone in ~1–4 weeks after deploy.
- noindex + font entries: clear at next recrawl.
- Crawled-not-indexed: content decision per page; request indexing accelerates.
