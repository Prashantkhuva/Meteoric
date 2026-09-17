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

        {/* ── LINK COLUMNS ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 sm:py-12 border-t"
          style={{ borderColor: "var(--footer-border)" }}
        >
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs leading-relaxed" style={{ color: "var(--footer-muted)" }}>
              Web &amp; Software Development Agency
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--footer-text)" }}>Services</h4>
            <ul className="space-y-2.5">
              <li><StaggerLink href="/services/landing-pages" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Landing Pages</StaggerLink></li>
              <li><StaggerLink href="/services/saas-development" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>SaaS Development</StaggerLink></li>
              <li><StaggerLink href="/services/web-applications" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Web Apps</StaggerLink></li>
              <li><StaggerLink href="/services/nextjs-development" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Full-Stack</StaggerLink></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--footer-text)" }}>Company</h4>
            <ul className="space-y-2.5">
              <li><StaggerLink href="/work" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Work</StaggerLink></li>
              <li><StaggerLink href="/case-studies" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Case Studies</StaggerLink></li>
              <li><StaggerLink href="/about" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>About</StaggerLink></li>
              <li><StaggerLink href="/blog" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Blog</StaggerLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--footer-text)" }}>Legal</h4>
            <ul className="space-y-2.5">
              <li><StaggerLink href="/privacy" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Privacy Policy</StaggerLink></li>
              <li><StaggerLink href="/terms" hoverColor="var(--footer-text)" style={{ fontSize: 13, fontWeight: 400, color: "var(--footer-muted)", padding: 0 }}>Terms of Service</StaggerLink></li>
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-t"
          style={{ borderColor: "var(--footer-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--footer-muted)", opacity: 0.6 }}>
            &copy; 2026 Meteoric. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <StaggerLink href="https://github.com/Prashantkhuva" hoverColor="var(--footer-text)" style={{ fontSize: 12, color: "var(--footer-muted)", padding: 0 }}>GitHub</StaggerLink>
            <StaggerLink href="https://linkedin.com" hoverColor="var(--footer-text)" style={{ fontSize: 12, color: "var(--footer-muted)", padding: 0 }}>LinkedIn</StaggerLink>
            <StaggerLink href="https://x.com/prashantkhuva_" hoverColor="var(--footer-text)" style={{ fontSize: 12, color: "var(--footer-muted)", padding: 0 }}>X</StaggerLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
