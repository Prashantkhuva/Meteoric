"use client";

import { useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import Link from "next/link";
import GridLines from "@/components/ui/GridLines";
import { trackEvent } from "@/lib/analytics/gtag";

function Hero() {
  const containerRef = useRef(null);
  const mainTextRef = useRef(null);
  const mutedTextRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  useGSAP(
    () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        document.querySelectorAll(".split-line").forEach((el) => {
          el.style.transform = "none";
        });
        if (subtextRef.current) {
          subtextRef.current.style.transform = "none";
        }
        if (ctaRef.current) {
          ctaRef.current.style.transform = "none";
        }
        return;
      }
      const run = () => {
        const mainSplit = new SplitText(mainTextRef.current, {
          type: "lines",
          linesClass: "split-line",
        });
        const mutedSplit = new SplitText(mutedTextRef.current, {
          type: "lines",
          linesClass: "split-line",
        });
        const allLines = [...mainSplit.lines, ...mutedSplit.lines];

        gsap.set(allLines, { opacity: 1 });
        gsap.set([subtextRef.current, ctaRef.current], { opacity: 1 });
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.45 },
        });
        tl.fromTo(allLines, { y: 40 }, { y: 0, stagger: 0.08 })
          .from(subtextRef.current, { y: 30 }, "-=0.25")
          .from(ctaRef.current, { y: 30 }, "-=0.2");

        gsap.to(containerRef.current, {
          y: 60,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      };

      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(run, { timeout: 1200 });
      } else {
        setTimeout(run, 100);
      }
    },
    { scope: containerRef },
  );

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Hero background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/hero-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 40%, transparent 60%, var(--bg-primary) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--bg-primary) 0%, transparent 15%, transparent 85%, var(--bg-primary) 100%)" }} />
      </div>

      <GridLines />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-12 py-24 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Left: Text content */}
          <div ref={containerRef}>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl mb-6" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)", border: "1px solid var(--border-color)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>Currently accepting new projects</span>
            </div>

            <h1
              className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              <span ref={mainTextRef} className="block">
                Ship Fast.
              </span>
              <span ref={mutedTextRef} className="block font-secondary-italic" style={{ color: "var(--text-secondary)" }}>
                Ship Right. Ship Meteoric.
              </span>
            </h1>

            <div
              ref={subtextRef}
              className="max-w-md text-base md:text-lg leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              A software development agency that partners with founders
              to design, develop, and launch modern websites and SaaS products that
              actually convert.
            </div>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <button
                type="button"
                onClick={() => {
                  trackEvent("booking_click", { button_location: "/hero" });
                  openCal();
                }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:opacity-90"
                style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
              >
                Book a Free Strategy Call
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>

              <Link
                href="/#process"
                className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-primary)", backdropFilter: "blur(3px)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                See How We Build
              </Link>
            </div>
          </div>

          {/* Right: Decorative space — image fills this area */}
          <div className="hidden md:block" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
