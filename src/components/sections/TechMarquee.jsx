const techs = [
  "Next.js",
  "React",
  "Supabase",
  "Tailwind CSS",
  "GSAP",
  "Framer Motion",
  "Node.js",
  "Stripe",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "Vercel",
];

const repeated = [...techs, ...techs];

export default function TechMarquee() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-black border-y border-white/[0.04]">
      <div className="marquee flex items-center gap-8 md:gap-12 whitespace-nowrap">
        {repeated.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="text-[clamp(1rem,2.5vw,1.5rem)] text-white/15 font-display select-none"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
