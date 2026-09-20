import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname } from "path";

const QUALITY = 80;
const MAX_WIDTH = 1920;
const DIRS = ["public/images", "public/images/blog"];

async function compressDir(dir) {
  const entries = await readdir(dir);
  for (const file of entries) {
    const filePath = join(dir, file);
    const info = await stat(filePath);
    if (info.isDirectory()) {
      await compressDir(filePath);
      continue;
    }
    const ext = extname(file).toLowerCase();
    if (![".webp", ".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const sizeMB = (info.size / 1024 / 1024).toFixed(2);
    console.log(`  ${filePath} (${sizeMB} MB)`);

    try {
      const image = sharp(filePath);
      const meta = await image.metadata();
      const needsResize = meta.width && meta.width > MAX_WIDTH;

      let pipeline = image;
      if (needsResize) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      if (ext === ".png") {
        pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
      } else if (ext === ".jpg" || ext === ".jpeg") {
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
      } else {
        pipeline = pipeline.webp({ quality: QUALITY });
      }

      const buffer = await pipeline.toBuffer();
      const newSizeMB = (buffer.length / 1024 / 1024).toFixed(2);
      const saved = ((1 - buffer.length / info.size) * 100).toFixed(0);
      console.log(`    → ${newSizeMB} MB (saved ${saved}%)`);

      await sharp(buffer).toFile(filePath);
    } catch (e) {
      console.error(`    ✗ ${e.message}`);
    }
  }
}

console.log("Compressing images...\n");
for (const dir of DIRS) {
  console.log(`${dir}:`);
  await compressDir(dir);
}

// Also compress prashant.png in public root
try {
  const pPath = "public/prashant.png";
  const pStat = await stat(pPath);
  console.log(`\npublic/prashant.png (${(pStat.size / 1024).toFixed(0)} KB)`);
  const buf = await sharp(pPath).png({ quality: 85, compressionLevel: 9 }).toBuffer();
  const newKB = (buf.length / 1024).toFixed(0);
  console.log(`  → ${newKB} KB`);
  await sharp(buf).toFile(pPath);
} catch (e) {}

console.log("\nDone.");
