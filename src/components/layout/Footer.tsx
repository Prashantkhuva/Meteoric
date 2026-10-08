"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerLink from "./StaggerLink";
import GridLines from "@/components/ui/GridLines";
import { footerColumns } from "@/data/navigation";
import { socialProfiles } from "@/data/social";
import { socialIcons } from "@/components/ui/social-icons";
import { openCalModal } from "@/components/ui/cal-modal-store";

const colLinkStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "var(--footer-muted)",
  display: "inline-block",
  padding: "6px 0",
};

const socialLinkStyle = {
  fontSize: 12,
  color: "var(--footer-muted)",
  padding: 0,
};

export default function Footer() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const openCal = useCallback(() => openCalModal(), []);

  useSectionAnimations(
    ctaRef,
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const heading = headingRef.current;
      if (heading) {
        const split = new SplitText(heading, {
          type: "lines",
          linesClass: "split-line",
          aria: "manual" as "auto",
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
          <Image
            src="/images/cta-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
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
              background: "#ffffff",
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
          className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 sm:py-12 border-t"
          style={{ borderColor: "var(--footer-border)" }}
        >
          {/* Brand column */}
          <ScrollReveal
            direction="up"
            className="col-span-2 md:col-span-1"
          >
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--footer-muted)" }}
            >
              Web &amp; Software Development Agency
            </p>
          </ScrollReveal>

          {footerColumns.map((col, i) => (
            <ScrollReveal key={col.heading} direction="up" delay={0.08 * (i + 1)}>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--footer-text)" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <StaggerLink
                      href={link.to}
                      hoverColor="var(--footer-text)"
                      style={colLinkStyle}
                    >
                      {link.label}
                    </StaggerLink>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}

        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-t"
          style={{ borderColor: "var(--footer-border)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--footer-muted)" }}
          >
            &copy; 2026 Meteoric. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialProfiles.map((profile) => (
              <StaggerLink
                key={profile.id}
                href={profile.url}
                aria-label={profile.label}
                hoverColor="var(--footer-text)"
                style={socialLinkStyle}
              >
                {socialIcons[profile.id]}
              </StaggerLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
