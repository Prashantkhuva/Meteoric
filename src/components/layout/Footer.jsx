import { useState, lazy, Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const RequestModal = lazy(() => import("./NavBar/RequestModal"));

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer
        id="contact"
        className="relative overflow-hidden bg-black border-t border-[#EAEFFF]/8"
      >
        {/* Subtle bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[37.5rem] h-[18.75rem] max-w-[90vw] bg-[#EAEFFF]/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* ── CTA BLOCK ── */}
          <div className="py-24 sm:py-28 lg:py-32 border-b border-white/5">
            <p className="text-white/50 uppercase tracking-[0.3em] text-xs mb-10">
              Start a Project
            </p>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.0] tracking-tight text-white max-w-4xl">
              Ready to launch?
              <span className="block text-white/25 mt-2 font-secondary-italic">
                Let's make it happen.
              </span>
            </h2>

            <p className="mt-8 text-white/40 text-base md:text-lg leading-relaxed max-w-xl">
              We partner with founders to design and build web products that
              drive real results — from landing pages to full SaaS platforms.
            </p>

            <button
              onClick={() => setIsOpen(true)}
              className="group mt-12 inline-flex items-center gap-2 overflow-hidden border border-white/20 text-white px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Start a Project
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

          {/* ── WORDMARK ── */}
          <div className="pt-10 overflow-hidden">
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
              <Link href="/work" className="text-white/40 hover:text-white transition-colors">Work</Link>
              <Link href="/case-studies" className="text-white/40 hover:text-white transition-colors">Case Studies</Link>
              <Link href="/services" className="text-white/40 hover:text-white transition-colors">Services</Link>
              <Link href="/blog" className="text-white/40 hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="text-white/40 hover:text-white transition-colors">About</Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
              <p className="text-white/30">&copy; 2026 Meteoric.</p>
              <Link href="/privacy" className="text-white/30 hover:text-white transition-colors">Privacy</Link>
              <span className="text-white/10">/</span>
              <Link href="/terms" className="text-white/30 hover:text-white transition-colors">Terms</Link>
              <span className="text-white/10">/</span>
              <Link href="/about" className="text-white/30 hover:text-white transition-colors group inline-flex items-center gap-1">
                Built by Prashant <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}><RequestModal isOpen={isOpen} setIsOpen={setIsOpen} /></Suspense>
    </>
  );
}
