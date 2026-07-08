import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, sitemapRoutes } from "../src/lib/seo/config.js";
import { posts } from "../src/data/blog.js";

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

const blogRoutes = posts.map((post) => ({
  path: `/blog/${post.slug}`,
  priority: "0.7",
  changefreq: "monthly",
}));

const allRoutes = [...sitemapRoutes, ...blogRoutes];

const blogPostByPath = Object.fromEntries(
  posts.map((p) => [`/blog/${p.slug}`, p]),
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allRoutes
  .map((route) => {
    const post = blogPostByPath[route.path];
    const imageTag = post
      ? `\n    <image:image>\n      <image:loc>${SITE_URL}${post.image}</image:loc>\n    </image:image>`
      : "";
    return `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${imageTag}
  </url>`;
  })
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

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "sitemap.xml"), sitemap, "utf8"),
  writeFile(path.join(outputDir, "robots.txt"), robots, "utf8"),
]);

console.log(`Generated sitemap.xml and robots.txt in ${path.relative(rootDir, outputDir)}`);
