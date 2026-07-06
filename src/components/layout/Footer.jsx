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
            <p className="text-white/25 uppercase tracking-[0.3em] text-xs mb-10">
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

          {/* ── WORDMARK + COPYRIGHT ── */}
          <div className="pt-10 pb-6 overflow-hidden">
            {/* Huge Background Text */}
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

            {/* Footer Bottom */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
              {/* Left Side */}
              <p className="text-sm text-white/30">
                © 2026 Meteoric. All rights reserved.
              </p>

              {/* Center — internal links */}
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer navigation">
                <Link href="/work" className="text-white/30 hover:text-white transition-colors duration-300">Work</Link>
                <Link href="/blog" className="text-white/30 hover:text-white transition-colors duration-300">Blog</Link>
                <Link href="/#services" className="text-white/30 hover:text-white transition-colors duration-300">Services</Link>
                <Link href="/#process" className="text-white/30 hover:text-white transition-colors duration-300">Process</Link>
                <Link href="/about" className="text-white/30 hover:text-white transition-colors duration-300">About</Link>
              </nav>

              {/* Right Side */}
              <Link
                href="/about"
                className="group text-sm text-white/30 hover:text-white transition-colors duration-300"
              >
                Built & Designed by{" "}
                <span className="text-white font-medium inline-flex items-center gap-1">
                  Prashant
                  <span className="translate-y-px group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowUpRight size={12} />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}><RequestModal isOpen={isOpen} setIsOpen={setIsOpen} /></Suspense>
    </>
  );
}
