import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";

const WIDTH = 1200;
const HEIGHT = 800;

const themes = [
  {
    name: "strategy",
    slug: "why-your-startup-needs-a-product-studio-not-an-agency",
    colors: ["#1e1b4b", "#312e81", "#4338ca", "#6366f1", "#818cf8"],
    bg: ["#0f0a1a", "#1a1040", "#0f0a1a"],
    accent: "#818cf8",
  },
  {
    name: "design",
    slug: "designing-for-conversion-lessons-from-12-shipped-projects",
    colors: ["#022c22", "#064e3b", "#059669", "#34d399", "#6ee7b7"],
    bg: ["#0a1a14", "#0a2a1e", "#0a1a14"],
    accent: "#34d399",
  },
  {
    name: "casestudy",
    slug: "building-a-saas-prototype-in-3-weeks-a-case-study",
    colors: ["#1c0400", "#451a03", "#c2410c", "#f59e0b", "#fbbf24"],
    bg: ["#1a0c04", "#2a1406", "#1a0c04"],
    accent: "#f59e0b",
  },
  {
    name: "engineering",
    slug: "the-meteoric-guide-to-choosing-your-tech-stack",
    colors: ["#0c1929", "#0f2847", "#1d4ed8", "#38bdf8", "#7dd3fc"],
    bg: ["#060e1a", "#0a1a30", "#060e1a"],
    accent: "#38bdf8",
  },
];

function svgFilter(id, stdDeviation) {
  return `<filter id="${id}">
    <feGaussianBlur stdDeviation="${stdDeviation}" />
  </filter>`;
}

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

  // Large background blobs with blur
  const blobCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < blobCount; i++) {
    const cx = Math.floor(rand() * WIDTH);
    const cy = Math.floor(rand() * HEIGHT);
    const rx = 200 + Math.floor(rand() * 400);
    const ry = 200 + Math.floor(rand() * 400);
    const color = theme.colors[Math.floor(rand() * theme.colors.length)];
    const opacity = 0.15 + rand() * 0.25;
    const blur = 40 + Math.floor(rand() * 60);
    const fid = `blob${i}_${index}`;
    shapes.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" filter="url(#${fid})" />
`);
    shapes.unshift(svgFilter(`blob${i}_${index}`, blur));
  }

  // Circles (varying sizes)
  const circleCount = 8 + Math.floor(rand() * 8);
  for (let i = 0; i < circleCount; i++) {
    const cx = Math.floor(rand() * WIDTH);
    const cy = Math.floor(rand() * HEIGHT);
    const r = 10 + Math.floor(rand() * 60);
    const color = theme.colors[Math.floor(rand() * theme.colors.length)];
    const opacity = 0.08 + rand() * 0.2;
    const hasGlow = rand() > 0.6;
    if (hasGlow) {
      const fid = `glow${i}_${index}`;
      shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity * 0.5}" filter="url(#${fid})" />
`);
      shapes.unshift(svgFilter(`glow${i}_${index}`, r * 0.3));
    }
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="none" stroke="${color}" stroke-width="0.5" opacity="${opacity}" />
`);
  }

  // Geometric lines connecting points
  const points = [];
  for (let i = 0; i < 6; i++) {
    points.push({
      x: Math.floor(rand() * WIDTH),
      y: Math.floor(rand() * HEIGHT),
    });
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (rand() > 0.4) {
        const color = theme.accent;
        shapes.push(
          `<line x1="${points[i].x}" y1="${points[i].y}" x2="${points[j].x}" y2="${points[j].y}" stroke="${color}" stroke-width="0.3" opacity="0.12" />
`,
        );
      }
    }
  }

  // Large accent circle
  const acx = Math.floor(rand() * WIDTH);
  const acy = Math.floor(rand() * HEIGHT);
  const ar = 80 + Math.floor(rand() * 120);
  shapes.push(`<circle cx="${acx}" cy="${acy}" r="${ar}" fill="none" stroke="${theme.accent}" stroke-width="0.5" opacity="0.15" />
`);
  shapes.push(`<circle cx="${acx}" cy="${acy}" r="${ar * 0.3}" fill="${theme.accent}" opacity="0.08" />
`);

  // Diagonal grid lines
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(rand() * WIDTH);
    const y = Math.floor(rand() * HEIGHT);
    shapes.push(
      `<line x1="${x}" y1="0" x2="${x + Math.floor(rand() * 200 - 100)}" y2="${HEIGHT}" stroke="${theme.accent}" stroke-width="0.2" opacity="0.06" />
`,
    );
  }

  // Small decorative dots
  for (let i = 0; i < 20; i++) {
    const cx = Math.floor(rand() * WIDTH);
    const cy = Math.floor(rand() * HEIGHT);
    const r = 1 + Math.floor(rand() * 3);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${theme.accent}" opacity="0.15" />
`);
  }

  // Radial gradient overlay
  const bgGrad = `
    <defs>
      <radialGradient id="bgGrad_${index}" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${theme.bg[1]}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${theme.bg[0]}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad_${index})" />
`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    ${shapes.filter((s) => s.startsWith("<filter")).join("")}
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${theme.bg[0]}" />
  ${shapes.filter((s) => !s.startsWith("<filter")).join("")}
  ${bgGrad}
</svg>`;

  return svg;
}

async function generate() {
  for (let i = 0; i < themes.length; i++) {
    const theme = themes[i];
    const svg = generateSVG(theme, i);
    const outputPath = `public/images/blog/${theme.slug}.png`;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${outputPath}`);
  }
  console.log("Done!");
}

generate().catch(console.error);
