"use client";

const defaultLogos = [
  { name: "Vercel" },
  { name: "Supabase" },
  { name: "Stripe" },
  { name: "Linear" },
  { name: "Notion" },
  { name: "Figma" },
  { name: "GitHub" },
  { name: "Tailwind" },
];

function LogoItem({ logo }) {
  if (logo.src) {
    return (
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        className="h-8 w-auto opacity-40 hover:opacity-70 transition-opacity"
      />
    );
  }
  return (
    <span
      className="text-sm font-medium tracking-wide whitespace-nowrap px-6"
      style={{ color: "var(--text-muted)", fontFamily: "var(--font-secondary)" }}
    >
      {logo.name}
    </span>
  );
}

function MarqueeRow({ logos, reverse = false }) {
  const doubled = [...logos, ...logos];
  return (
    <div
      className="flex w-max"
      style={{
        animation: `marquee-${reverse ? "right" : "left"} 30s linear infinite`,
      }}
    >
      {doubled.map((logo, i) => (
        <LogoItem key={`${logo.name}-${i}`} logo={logo} />
      ))}
    </div>
  );
}

export default function ClientLogoMarquee({ logos = defaultLogos }) {
  return (
    <section
      className="relative py-12 sm:py-16 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p
          className="text-xs uppercase tracking-[0.2em] text-center"
          style={{ color: "var(--text-muted)" }}
        >
          Trusted by innovative teams
        </p>
      </div>

      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      >
        <div className="flex flex-col gap-4">
          <MarqueeRow logos={logos} />
          <MarqueeRow logos={logos} reverse />
        </div>
      </div>
    </section>
  );
}
