import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../src/lib/seo/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// robots.txt and sitemap.xml are Next.js metadata routes:
//   app/robots.js  -> /robots.txt
//   app/sitemap.js -> /sitemap.xml
// Writing static files into public/ for either would conflict with them
// (Next build error E212). This script verifies the routes exist instead.

const routes = [
  ["app/robots.js", `${SITE_URL}/robots.txt`],
  ["app/sitemap.js", `${SITE_URL}/sitemap.xml`],
];

let ok = true;
for (const [file, url] of routes) {
  try {
    await access(path.join(rootDir, file));
    console.log(`OK  ${file} -> ${url}`);
  } catch {
    ok = false;
    console.error(`MISSING ${file} (serves ${url})`);
  }
}

if (!ok) {
  process.exit(1);
}
