/**
 * Writes public/og-image.png — solid-color PNG (no dependencies).
 * Dimensions must match OG_IMAGE_WIDTH / OG_IMAGE_HEIGHT in src/seo.config.js.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "../src/seo.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outPath = path.join(rootDir, "public", "og-image.png");

/** PNG CRC-32 over type + data */
function crc32(buf) {
  let c = ~0 >>> 0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (~c >>> 0) >>> 0;
}

function packChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * RGB 8-bit truecolor, filter type 0 per scanline.
 * Brand placeholder: near-black (#0a0a0a).
 */
function createSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowLen = 1 + width * 3;
  const raw = Buffer.alloc(rowLen * height);
  for (let y = 0; y < height; y++) {
    const off = y * rowLen;
    raw[off] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const p = off + 1 + x * 3;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
    }
  }

  const compressed = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    packChunk("IHDR", ihdr),
    packChunk("IDAT", compressed),
    packChunk("IEND", Buffer.alloc(0)),
  ]);
}

const png = createSolidPng(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, 10, 10, 10);
await writeFile(outPath, png);
console.log(`Wrote ${path.relative(rootDir, outPath)} (${OG_IMAGE_WIDTH}×${OG_IMAGE_HEIGHT})`);
