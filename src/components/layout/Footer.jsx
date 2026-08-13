"use client";

import Link from "next/link";
import StaggerLink from "./StaggerLink";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black border-t border-[#EAEFFF]/8">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[37.5rem] h-[18.75rem] max-w-[90vw] bg-[#EAEFFF]/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* ── WORDMARK ── */}
        <div className="pt-12 sm:pt-16 lg:pt-24 overflow-hidden">
          <div
            className="text-[22vw] sm:text-[16vw] md:text-[14vw] leading-none tracking-[-0.08em] font-semibold select-none whitespace-nowrap"
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 py-8 sm:py-10 border-t border-white/5">
          {/* Nav links — centered rows on mobile, left on desktop */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-1">
            <StaggerLink href="/work" hoverColor="#fff" style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", padding: "8px 14px" }}>Work</StaggerLink>
            <StaggerLink href="/case-studies" hoverColor="#fff" style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", padding: "8px 14px" }}>Case Studies</StaggerLink>
            <StaggerLink href="/services" hoverColor="#fff" style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", padding: "8px 14px" }}>Services</StaggerLink>
            <StaggerLink href="/about" hoverColor="#fff" style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", padding: "8px 14px" }}>About</StaggerLink>
            <StaggerLink href="/booking" hoverColor="#fff" style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", padding: "8px 14px" }}>Book a Call</StaggerLink>
          </div>

          {/* Legal + copyright — centered on mobile, right on desktop */}
          <div className="flex flex-col items-center gap-2 text-sm">
            <p className="text-white/25 text-center text-xs sm:text-sm leading-relaxed">
              &copy; 2026{" "}
              <Link href="/" className="hover:text-white/50 transition-colors duration-200">
                Meteoric
              </Link>
              . <span className="text-white/15">Web &amp; Software Development Agency</span>
            </p>
            <div className="flex items-center gap-3">
              <StaggerLink href="/privacy" hoverColor="#fff" style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", padding: "6px 10px" }}>Privacy</StaggerLink>
              <span className="text-white/8 text-xs">/</span>
              <StaggerLink href="/terms" hoverColor="#fff" style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", padding: "6px 10px" }}>Terms</StaggerLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
