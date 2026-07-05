const arts = [
  // Post 0 — indigo/purple, cellular/network pattern
  {
    shapes: [
      { cx: 60, cy: 40, r: 28, fill: "rgba(129,140,248,0.12)" },
      { cx: 120, cy: 80, r: 20, fill: "rgba(129,140,248,0.08)" },
      { cx: 30, cy: 100, r: 16, fill: "rgba(129,140,248,0.06)" },
      { cx: 160, cy: 30, r: 22, fill: "rgba(129,140,248,0.10)" },
      { cx: 90, cy: 130, r: 14, fill: "rgba(129,140,248,0.07)" },
    ],
    lines: [
      { x1: 60, y1: 40, x2: 120, y2: 80 },
      { x1: 60, y1: 40, x2: 30, y2: 100 },
      { x1: 120, y1: 80, x2: 160, y2: 30 },
      { x1: 30, y1: 100, x2: 90, y2: 130 },
    ],
  },
  // Post 1 — emerald/teal, organic leaf pattern
  {
    shapes: [
      { cx: 100, cy: 60, r: 32, fill: "rgba(52,211,153,0.10)" },
      { cx: 40, cy: 110, r: 18, fill: "rgba(52,211,153,0.07)" },
      { cx: 150, cy: 100, r: 14, fill: "rgba(52,211,153,0.06)" },
      { cx: 80, cy: 20, r: 12, fill: "rgba(52,211,153,0.05)" },
      { cx: 180, cy: 50, r: 20, fill: "rgba(52,211,153,0.08)" },
    ],
    lines: [
      { x1: 100, y1: 60, x2: 40, y2: 110 },
      { x1: 100, y1: 60, x2: 150, y2: 100 },
      { x1: 40, y1: 110, x2: 180, y2: 50 },
      { x1: 80, y1: 20, x2: 100, y2: 60 },
    ],
  },
  // Post 2 — amber/orange, geometric triangle pattern
  {
    shapes: [
      { cx: 80, cy: 50, r: 24, fill: "rgba(245,158,11,0.11)" },
      { cx: 140, cy: 90, r: 18, fill: "rgba(245,158,11,0.07)" },
      { cx: 50, cy: 120, r: 15, fill: "rgba(245,158,11,0.06)" },
      { cx: 170, cy: 40, r: 12, fill: "rgba(245,158,11,0.05)" },
      { cx: 110, cy: 140, r: 20, fill: "rgba(245,158,11,0.09)" },
    ],
    lines: [
      { x1: 80, y1: 50, x2: 140, y2: 90 },
      { x1: 140, y1: 90, x2: 50, y2: 120 },
      { x1: 50, y1: 120, x2: 170, y2: 40 },
      { x1: 170, y1: 40, x2: 110, y2: 140 },
      { x1: 110, y1: 140, x2: 80, y2: 50 },
    ],
  },
  // Post 3 — sky/blue, dot-constellation
  {
    shapes: [
      { cx: 50, cy: 30, r: 6, fill: "rgba(56,189,248,0.15)" },
      { cx: 140, cy: 45, r: 8, fill: "rgba(56,189,248,0.12)" },
      { cx: 100, cy: 90, r: 10, fill: "rgba(56,189,248,0.10)" },
      { cx: 170, cy: 110, r: 5, fill: "rgba(56,189,248,0.08)" },
      { cx: 60, cy: 140, r: 7, fill: "rgba(56,189,248,0.10)" },
      { cx: 30, cy: 80, r: 4, fill: "rgba(56,189,248,0.06)" },
    ],
    lines: [
      { x1: 50, y1: 30, x2: 140, y2: 45 },
      { x1: 140, y1: 45, x2: 100, y2: 90 },
      { x1: 100, y1: 90, x2: 170, y2: 110 },
      { x1: 170, y1: 110, x2: 60, y2: 140 },
      { x1: 60, y1: 140, x2: 30, y2: 80 },
      { x1: 30, y1: 80, x2: 50, y2: 30 },
    ],
  },
];

export default function BlogArt({ index, className = "" }) {
  const art = arts[index % arts.length];

  return (
    <svg
      viewBox="0 0 200 160"
      className={`w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {art.lines.map((line, i) => (
        <line
          key={`l${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      ))}
      {art.shapes.map((shape, i) => (
        <circle
          key={`c${i}`}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={shape.fill}
        />
      ))}
    </svg>
  );
}
