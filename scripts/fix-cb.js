import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "src", "emails");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".jsx"));

// Fix template files: restore cb to plain prop (no default)
for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, "utf-8");

  // Remove any Date.now() default artifacts
  content = content.replace(/cb\s*=\s*Date\.now\(\)\s*,?/g, "cb,");

  // Remove broken regex artifacts
  content = content.replace(/,\s*\$1\)\s*\{/, ") {");
  content = content.replace(/,\s*\$1\s*\{/, ") {");
  content = content.replace(/,\s*\$1\s*\)/, ")");

  // Ensure trailing whitespace is clean
  content = content.replace(/cb,\s*\)/g, "cb)");

  fs.writeFileSync(fp, content, "utf-8");
  console.log(`Fixed: ${file}`);
}
