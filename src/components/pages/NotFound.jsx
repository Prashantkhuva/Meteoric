import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const suggestions = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/#contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />
      <div className="relative z-10 text-center max-w-lg">
        <p className="text-white/20 text-[8rem] md:text-[10rem] font-bold leading-none mb-4 select-none">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8">
          This page doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-white/70 text-sm font-medium hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-all duration-200"
            >
              {s.label}
              <ArrowUpRight size={13} className="opacity-50" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
