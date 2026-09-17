"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";

export default function LeadCaptureSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);

  useSectionAnimations(
    sectionRef,
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const heading = headingRef.current;
      if (heading) {
        const split = new SplitText(heading, { type: "lines", linesClass: "split-line" });
        gsap.fromTo(split.lines,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.1, ease: "power3.out", duration: 0.5,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none reverse none",
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap.fromTo(
        contentRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        },
      );
    },
    [],
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 sm:py-28 lg:py-32 overflow-hidden scroll-mt-24"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* Spacecraft background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/cta-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--hero-bg) 0%, transparent 20%, transparent 80%, var(--hero-bg) 100%)" }} />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center"
      >
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-display tracking-tight leading-[1.05] mb-4" style={{ color: "var(--hero-text)" }}>
          Let&apos;s ship your next product
        </h2>
        <p className="text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto" style={{ color: "var(--hero-text-secondary)" }}>
          Book a free strategy call to discuss your project,
          timeline, and how we can help.
        </p>

        <button
          onClick={() => {
            import("@calcom/embed-react").then(
              async ({ getCalApi }) => {
                const cal = await getCalApi({
                  namespace: "let-s-build",
                });
                cal("modal", { calLink: "prashantkhuva/let-s-build" });
              },
            );
          }}
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:opacity-90"
          style={{ background: "var(--accent)", color: "var(--accent-text)" }}
        >
          Book a Free Strategy Call
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}
