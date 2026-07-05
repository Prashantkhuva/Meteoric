import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 800;

const themes = [
  {
    name: "strategy",
    slug: "why-your-startup-needs-a-product-studio-not-an-agency",
    bg: "#1a1a1a",
    accent: "#6b7280",
    accent2: "#4f46e5",
  },
  {
    name: "design",
    slug: "designing-for-conversion-lessons-from-12-shipped-projects",
    bg: "#1a1a1a",
    accent: "#6b7280",
    accent2: "#059669",
  },
  {
    name: "casestudy",
    slug: "building-a-saas-prototype-in-3-weeks-a-case-study",
    bg: "#1a1a1a",
    accent: "#6b7280",
    accent2: "#d97706",
  },
  {
    name: "engineering",
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    bg: "#1a1a1a",
    accent: "#6b7280",
    accent2: "#2563eb",
  },
];

function generateSVG(theme, index) {
  const shapes = [];
  const rng = (seed) => {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };
  const rand = rng(index * 9973 + 104729);

  // Background gradient overlay to lift from pure black
  shapes.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg_${index})" />`);
  const bgGrad = `<radialGradient id="bg_${index}" cx="50%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#5a5a5a" stop-opacity="0.6" />
    <stop offset="100%" stop-color="#121212" stop-opacity="0.8" />
  </radialGradient>`;

  // Dark ambient blobs — large, subtle, grayscale
  const blobCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < blobCount; i++) {
    const cx = Math.floor(rand() * WIDTH);
    const cy = Math.floor(rand() * HEIGHT);
    const rx = 300 + Math.floor(rand() * 400);
    const ry = 250 + Math.floor(rand() * 350);
    const gray = 100 + Math.floor(rand() * 70);
    const blur = 80 + Math.floor(rand() * 100);
    const fid = `b${i}_${index}`;
    shapes.push(`<filter id="${fid}"><feGaussianBlur stdDeviation="${blur}" /></filter>`);
    shapes.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgb(${gray},${gray},${gray})" opacity="0.35" filter="url(#${fid})" />`);
  }

  // Thin intersecting lines — faint geometric structure
  for (let i = 0; i < 6; i++) {
    const x1 = Math.floor(rand() * WIDTH);
    const y1 = Math.floor(rand() * HEIGHT);
    const x2 = Math.floor(rand() * WIDTH);
    const y2 = Math.floor(rand() * HEIGHT);
    shapes.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.08)" stroke-width="0.3" />`);
  }

  // A few very faint circles
  for (let i = 0; i < 5; i++) {
    const cx = Math.floor(rand() * WIDTH);
    const cy = Math.floor(rand() * HEIGHT);
    const r = 50 + Math.floor(rand() * 150);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.4" />`);
  }

  // Subtle accent hint — just barely visible
  for (let i = 0; i < 3; i++) {
    const cx = Math.floor(rand() * WIDTH);
    const cy = Math.floor(rand() * HEIGHT);
    const r = 80 + Math.floor(rand() * 120);
    const blur = 40 + Math.floor(rand() * 60);
    const fid = `g${i}_${index}`;
    shapes.push(`<filter id="${fid}"><feGaussianBlur stdDeviation="${blur}" /></filter>`);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${theme.accent2}" opacity="0.1" filter="url(#${fid})" />`);
  }

  // Tiny accent stars
  for (let i = 0; i < 6; i++) {
    const sx = Math.floor(rand() * WIDTH);
    const sy = Math.floor(rand() * HEIGHT);
    const sr = 0.5 + rand() * 1.5;
    shapes.push(`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${theme.accent2}" opacity="${0.1 + rand() * 0.15}" />`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>${bgGrad}${shapes.filter(s => s.includes("<filter")).join("")}</defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${theme.bg}" />
  ${shapes.filter(s => !s.includes("<filter")).join("")}
</svg>`;

  return svg;
}

async function generate() {
  for (let i = 0; i < themes.length; i++) {
    const theme = themes[i];
    const svg = generateSVG(theme, i);
    const outputPath = `public/images/blog/${theme.slug}.png`;
    await sharp(Buffer.from(svg)).png().toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }
  console.log("Done!");
}

generate().catch(console.error);
