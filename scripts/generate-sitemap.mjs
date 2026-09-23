import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../src/lib/seo/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const outDirArgIndex = process.argv.indexOf("--out-dir");
const outDir =
  outDirArgIndex >= 0 && process.argv[outDirArgIndex + 1]
    ? process.argv[outDirArgIndex + 1]
    : "public";

const outputDir = path.resolve(rootDir, outDir);

// Sitemap is served by app/sitemap.js (Next metadata route).
// Writing public/sitemap.xml would conflict with it (Next error E212).
// This script only generates robots.txt.

const robots = `# Meteoric — ${SITE_URL}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: Google-Extended
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: GPTBot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: ClaudeBot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: CCBot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: meta-externalagent
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: Amazonbot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: Bytespider
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: ChatGPT-User
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

User-agent: OAI-SearchBot
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /editor
Disallow: /*?q=

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "robots.txt"), robots, "utf8");

console.log(
  `Generated robots.txt in ${path.relative(rootDir, outputDir)} (sitemap served by app/sitemap.js)`,
);
