import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.02),transparent_70%)]" />
      <div className="relative z-10 text-center max-w-lg">
        <p className="text-white/20 text-[8rem] md:text-[10rem] font-bold leading-none mb-4 select-none">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8">
          This page doesn't exist or has moved. Let's get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          Back to Home <ArrowUpRight size={16} />
        </Link>
      </div>
    </main>
  );
}
