import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-black border-t border-[#EAEFFF]/8"
    >
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[37.5rem] h-[18.75rem] max-w-[90vw] bg-[#EAEFFF]/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* ── WORDMARK ── */}
        <div className="pt-16 sm:pt-20 lg:pt-24 overflow-hidden">
          <div
            className="text-[18vw] md:text-[14vw] leading-none tracking-[-0.08em] font-semibold select-none whitespace-nowrap"
            aria-hidden="true"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "normal" }}>meteor</span>
            <span style={{ fontFamily: "var(--font-inter)" }}>ic</span>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-white/5">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/work" data-no-magnetic className="text-white/40 hover:text-white hover:bg-white/[0.04] px-3 py-1.5 rounded-lg transition-all duration-200">Work</Link>
            <Link href="/case-studies" data-no-magnetic className="text-white/40 hover:text-white hover:bg-white/[0.04] px-3 py-1.5 rounded-lg transition-all duration-200">Case Studies</Link>
            <Link href="/services" data-no-magnetic className="text-white/40 hover:text-white hover:bg-white/[0.04] px-3 py-1.5 rounded-lg transition-all duration-200">Services</Link>
            <Link href="/about" data-no-magnetic className="text-white/40 hover:text-white hover:bg-white/[0.04] px-3 py-1.5 rounded-lg transition-all duration-200">About</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
            <p className="text-white/30">&copy; 2026 Meteoric.</p>
            <Link href="/privacy" data-no-magnetic className="text-white/30 hover:text-white hover:bg-white/[0.04] px-2 py-1 rounded-lg transition-all duration-200">Privacy</Link>
            <span className="text-white/10">/</span>
            <Link href="/terms" data-no-magnetic className="text-white/30 hover:text-white hover:bg-white/[0.04] px-2 py-1 rounded-lg transition-all duration-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
