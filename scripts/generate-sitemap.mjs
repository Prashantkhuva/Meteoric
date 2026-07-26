import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, sitemapRoutes } from "../src/lib/seo/config.js";
import { projects } from "../src/data/projects.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const outDirArgIndex = process.argv.indexOf("--out-dir");
const outDir =
  outDirArgIndex >= 0 && process.argv[outDirArgIndex + 1]
    ? process.argv[outDirArgIndex + 1]
    : "public";

const outputDir = path.resolve(rootDir, outDir);
function routeUrl(routePath) {
  if (routePath === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${routePath}`;
}

const serviceSlugs = [
  "landing-pages",
  "saas-development",
  "startup-web-development",
  "nextjs-development",
  "web-applications",
];

const serviceUrls = serviceSlugs.map((slug) => ({
  path: `/services/${slug}`,
  changefreq: "monthly",
  priority: "0.8",
}));

const workUrls = projects.map((project) => ({
  path: `/work/${project.slug}`,
  changefreq: "monthly",
  priority: "0.7",
}));

const lastmodIndex = {};
sitemapRoutes.forEach((r) => { lastmodIndex[r.path] = r.lastmod; });

const allRoutes = [...sitemapRoutes, ...serviceUrls, ...workUrls];

function routeLastmod(route) {
  return lastmodIndex[route.path] || new Date().toISOString().split("T")[0];
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <lastmod>${routeLastmod(route)}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `# Meteoric — ${SITE_URL}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /login

User-agent: Google-Extended
Allow: /
Disallow: /admin
Disallow: /login

User-agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /login

User-agent: ClaudeBot
Allow: /
Disallow: /admin
Disallow: /login

User-agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /login

User-agent: CCBot
Allow: /
Disallow: /admin
Disallow: /login

User-agent: meta-externalagent
Allow: /
Disallow: /admin
Disallow: /login

User-agent: Amazonbot
Allow: /
Disallow: /admin
Disallow: /login

User-agent: Bytespider
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "sitemap.xml"), sitemap, "utf8"),
  writeFile(path.join(outputDir, "robots.txt"), robots, "utf8"),
]);

console.log(`Generated sitemap.xml and robots.txt in ${path.relative(rootDir, outputDir)}`);
