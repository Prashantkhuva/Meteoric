import sharp from "sharp";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "images", "blog");
const W = 832;
const H = 662;

const covers = [
  {
    file: "blog-cover-5.png",
    label: "MONGODB SCHEMA DESIGN FOR SAAS BILLING",
    gradient: ["#0a1628", "#070707"],
    accent: "#47A248",
  },
  {
    file: "blog-cover-6.png",
    label: "GSAP VS FRAMER MOTION",
    gradient: ["#1a0a2e", "#070707"],
    accent: "#EAEFFF",
  },
  {
    file: "blog-cover-7.png",
    label: "SUPABASE VS FIREBASE 2026",
    gradient: ["#0a1a1a", "#070707"],
    accent: "#3ECF8E",
  },
  {
    file: "blog-cover-8.png",
    label: "STARTUP WEBSITE COST GUIDE",
    gradient: ["#1a1208", "#070707"],
    accent: "#F59E0B",
  },
  {
    file: "blog-cover-9.png",
    label: "HOW TO CHOOSE YOUR AGENCY",
    gradient: ["#0a0a1a", "#070707"],
    accent: "#818CF8",
  },
];

function makeFullSVG({ gradient: [top, bottom], accent, label }) {
  const [r1, g1, b1] = [parseInt(top.slice(1,3),16), parseInt(top.slice(3,5),16), parseInt(top.slice(5,7),16)];
  const [r2, g2, b2] = [parseInt(bottom.slice(1,3),16), parseInt(bottom.slice(3,5),16), parseInt(bottom.slice(5,7),16)];
  const [ar, ag, ab] = [parseInt(accent.slice(1,3),16), parseInt(accent.slice(3,5),16), parseInt(accent.slice(5,7),16)];

  return Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgb(${r1},${g1},${b1})"/>
          <stop offset="100%" stop-color="rgb(${r2},${g2},${b2})"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <circle cx="${W*0.75}" cy="${H*0.25}" r="${H*0.35}" fill="rgb(${ar},${ag},${ab})" opacity="0.05"/>
      <circle cx="${W*0.15}" cy="${H*0.8}" r="${H*0.25}" fill="rgb(${ar},${ag},${ab})" opacity="0.03"/>
      <line x1="0" y1="${H-48}" x2="120" y2="${H-48}" stroke="rgb(${ar},${ag},${ab})" stroke-width="2" opacity="0.4"/>
      <text x="40" y="${H-60}" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="rgba(255,255,255,0.9)" letter-spacing="0.05em">
        ${label}
      </text>
    </svg>
  `);
}

async function main() {
  for (const cover of covers) {
    const svg = makeFullSVG(cover);
    await sharp(svg).png().toFile(join(OUTPUT_DIR, cover.file));
    console.log(`Generated ${cover.file}`);
  }
  console.log("Done!");
}

main().catch(console.error);
