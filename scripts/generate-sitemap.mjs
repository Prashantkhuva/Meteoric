import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, sitemapRoutes } from "../src/lib/seo/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const outDirArgIndex = process.argv.indexOf("--out-dir");
const outDir =
  outDirArgIndex >= 0 && process.argv[outDirArgIndex + 1]
    ? process.argv[outDirArgIndex + 1]
    : "public";

const outputDir = path.resolve(rootDir, outDir);
const today = new Date().toISOString();

function routeUrl(routePath) {
  if (routePath === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${routePath}`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map(
    (route) => `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `# Meteoric — ${SITE_URL}
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "sitemap.xml"), sitemap, "utf8"),
  writeFile(path.join(outputDir, "robots.txt"), robots, "utf8"),
]);

console.log(`Generated sitemap.xml and robots.txt in ${path.relative(rootDir, outputDir)}`);
