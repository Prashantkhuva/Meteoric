"use client";

import { useRef, useCallback } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";
import StaggerLink from "./StaggerLink";
import GridLines from "@/components/ui/GridLines";

export default function Footer() {
  const ctaRef = useRef(null);
  const headingRef = useRef(null);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  useSectionAnimations(
    ctaRef,
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const heading = headingRef.current;
      if (heading) {
        const split = new SplitText(heading, {
          type: "lines",
          linesClass: "split-line",
        });
        gsap.fromTo(
          split.lines,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power3.out",
            duration: 0.5,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              toggleActions: "play none reverse none",
              invalidateOnRefresh: true,
            },
          },
        );
      }
    },
    [],
  );

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        background: "var(--footer-bg)",
        borderColor: "var(--footer-border)",
      }}
    >
      {/* ── CTA SECTION ── */}
      <div ref={ctaRef} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/cta-bg.webp"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, var(--footer-bg) 0%, transparent 20%, transparent 80%, var(--footer-bg) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
          <h2
            ref={headingRef}
            className="text-3xl md:text-5xl font-display tracking-tight leading-[1.05] mb-4"
            style={{ color: "#ffffff" }}
          >
            Let&apos;s ship your next product
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: "var(--footer-text)" }}
          >
            Book a free strategy call to discuss your project, timeline, and how
            we can help.
          </p>

          <button
            onClick={openCal}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
            style={{
              background: "var(--footer-text)",
              color: "var(--footer-bg)",
            }}
          >
            Book a call
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 12 12"
              className="size-2 -rotate-90 transition-transform duration-150 group-hover:translate-x-px"
            >
              <path
                fill="currentColor"
                d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <GridLines />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* ── WORDMARK ── */}
        <div className="pt-12 sm:pt-16 lg:pt-24 overflow-hidden">
          <div
            className="text-[22vw] sm:text-[16vw] md:text-[14vw] leading-none tracking-[-0.08em] font-semibold select-none whitespace-nowrap"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(135deg, var(--footer-text) 0%, var(--footer-muted) 100%)",
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
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--footer-muted)" }}
            >
              Web &amp; Software Development Agency
            </p>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--footer-text)" }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <StaggerLink
                  href="/services/landing-pages"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Landing Pages
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/services/saas-development"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  SaaS Development
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/services/web-applications"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Web Apps
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/services/nextjs-development"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Full-Stack
                </StaggerLink>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--footer-text)" }}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <StaggerLink
                  href="/work"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Work
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/case-studies"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Case Studies
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/about"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  About
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/blog"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Blog
                </StaggerLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--footer-text)" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <StaggerLink
                  href="/privacy"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Privacy Policy
                </StaggerLink>
              </li>
              <li>
                <StaggerLink
                  href="/terms"
                  hoverColor="var(--footer-text)"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--footer-muted)",
                    padding: 0,
                  }}
                >
                  Terms of Service
                </StaggerLink>
              </li>
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-t"
          style={{ borderColor: "var(--footer-border)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--footer-muted)", opacity: 0.6 }}
          >
            &copy; 2026 Meteoric. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <StaggerLink
              href="https://github.com/Prashantkhuva"
              hoverColor="var(--footer-text)"
              style={{ fontSize: 12, color: "var(--footer-muted)", padding: 0 }}
            >
              GitHub
            </StaggerLink>
            <StaggerLink
              href="https://linkedin.com"
              hoverColor="var(--footer-text)"
              style={{ fontSize: 12, color: "var(--footer-muted)", padding: 0 }}
            >
              LinkedIn
            </StaggerLink>
            <StaggerLink
              href="https://x.com/prashantkhuva_"
              hoverColor="var(--footer-text)"
              style={{ fontSize: 12, color: "var(--footer-muted)", padding: 0 }}
            >
              X
            </StaggerLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
