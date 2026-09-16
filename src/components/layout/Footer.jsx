import Link from "next/link";
import StaggerLink from "./StaggerLink";
import GridLines from "@/components/ui/GridLines";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        background: "var(--footer-bg)",
        borderColor: "var(--footer-border)",
      }}
    >
      <GridLines />
      {/* Subtle bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[37.5rem] h-[18.75rem] max-w-[90vw] blur-[120px] rounded-full pointer-events-none"
        style={{ background: "var(--accent-glow)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* ── WORDMARK ── */}
        <div className="pt-12 sm:pt-16 lg:pt-24 overflow-hidden">
          <div
            className="text-[22vw] sm:text-[16vw] md:text-[14vw] leading-none tracking-[-0.08em] font-semibold select-none whitespace-nowrap"
            aria-hidden="true"
            style={{
              background: "linear-gradient(135deg, var(--footer-text) 0%, var(--footer-muted) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span style={{ fontFamily: "var(--font-secondary)" }}>meteor</span>
            <span style={{ fontFamily: "var(--font-primary)" }}>ic</span>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 py-8 sm:py-10 border-t"
          style={{ borderColor: "var(--footer-border)" }}
        >
          {/* Nav links — centered rows on mobile, left on desktop */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-1">
            <StaggerLink href="/work" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: "8px 14px" }}>Work</StaggerLink>
            <StaggerLink href="/case-studies" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: "8px 14px" }}>Case Studies</StaggerLink>
            <StaggerLink href="/services" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: "8px 14px" }}>Services</StaggerLink>
            <StaggerLink href="/about" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: "8px 14px" }}>About</StaggerLink>
            <StaggerLink href="/blog" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: "8px 14px" }}>Blog</StaggerLink>
            <StaggerLink href="/booking" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: "8px 14px" }}>Book a Call</StaggerLink>
          </div>

          {/* Legal + copyright — centered on mobile, right on desktop */}
          <div className="flex flex-col items-center gap-2 text-sm">
            <p className="text-center text-xs sm:text-sm leading-relaxed" style={{ color: "var(--footer-muted)" }}>
              &copy; 2026{" "}
              <Link href="/" className="transition-colors duration-200" style={{ color: "var(--footer-text)" }}>
                Meteoric
              </Link>
              . <span style={{ color: "var(--footer-muted)", opacity: 0.6 }}>Web &amp; Software Development Agency</span>
            </p>
            <div className="flex items-center gap-3">
              <StaggerLink href="/privacy" hoverColor="var(--footer-text)" style={{ fontSize: 12, fontWeight: 400, color: "var(--footer-muted)", padding: "6px 10px" }}>Privacy</StaggerLink>
              <span className="text-xs" style={{ color: "var(--footer-muted)", opacity: 0.3 }}>/</span>
              <StaggerLink href="/terms" hoverColor="var(--footer-text)" style={{ fontSize: 12, fontWeight: 400, color: "var(--footer-muted)", padding: "6px 10px" }}>Terms</StaggerLink>
              <span className="text-xs" style={{ color: "var(--footer-muted)", opacity: 0.3 }}>/</span>
              <StaggerLink href="/editorial-policy" hoverColor="var(--footer-text)" style={{ fontSize: 12, fontWeight: 400, color: "var(--footer-muted)", padding: "6px 10px" }}>Editorial</StaggerLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
