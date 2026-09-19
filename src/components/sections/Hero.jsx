"use client";

import { useCallback, useRef, useState, Suspense, lazy } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import Link from "next/link";
import GridLines from "@/components/ui/GridLines";
import { trackEvent } from "@/lib/analytics/gtag";

const WarpCanvas = lazy(() => import("./WarpCanvas"));

function HeroFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(40,60,120,0.12) 0%, #010405 70%)",
      }}
    />
  );
}

function Hero() {
  const containerRef = useRef(null);
  const mainTextRef = useRef(null);
  const mutedTextRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);
  const visualRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
        [badgeRef, subtextRef, ctaRef, visualRef].forEach((ref) => {
          if (ref.current) ref.current.style.transform = "none";
        });
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
        gsap.set([badgeRef.current, subtextRef.current, ctaRef.current], {
          opacity: 1,
        });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.55 },
        });
        tl.fromTo(
          badgeRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
        )
          .fromTo(allLines, { y: 60 }, { y: 0, stagger: 0.1 }, "-=0.2")
          .from(subtextRef.current, { y: 30, opacity: 0 }, "-=0.3")
          .from(ctaRef.current, { y: 30, opacity: 0 }, "-=0.25");

        if (visualRef.current) {
          gsap.fromTo(
            visualRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.3 },
          );
        }

        ScrollTrigger.create({
          trigger: containerRef.current.parentElement,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        });

        gsap.to(containerRef.current, {
          y: 100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current.parentElement,
            start: "top top",
            end: "60% top",
            scrub: 0.5,
          },
        });

        if (visualRef.current) {
          gsap.to(visualRef.current, {
            y: -60,
            scale: 1.1,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current.parentElement,
              start: "top top",
              end: "60% top",
              scrub: 0.5,
            },
          });
        }
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
      style={{ background: "#010405" }}
    >
      {/* Warp starfield canvas */}
      <div className="absolute inset-0" aria-hidden="true">
        <Suspense fallback={<HeroFallback />}>
          <WarpCanvas scrollProgress={scrollProgress} />
        </Suspense>
      </div>

      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 50% 50%, rgba(60,90,180,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, #010405 100%)",
          opacity: 0.6 + scrollProgress * 0.4,
        }}
      />

      {/* Top/bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #010405 0%, transparent 10%, transparent 90%, #010405 100%)",
        }}
      />

      <GridLines />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-12 py-20 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Text */}
          <div ref={containerRef}>
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: 0,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-[11px] font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Currently accepting new projects
              </span>
            </div>

            <h1
              className="font-semibold text-hero leading-[1.05] tracking-tight mb-6"
              style={{ color: "#e8e8e4" }}
            >
              <span ref={mainTextRef} className="block">
                Ship Fast.
              </span>
              <span
                ref={mutedTextRef}
                className="block font-secondary-italic"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Ship Right. Ship Meteoric.
              </span>
            </h1>

            <div
              ref={subtextRef}
              className="max-w-md text-body-sm md:text-body leading-relaxed mb-8"
              style={{
                color: "rgba(255,255,255,0.5)",
                opacity: 0,
              }}
            >
              A software development agency that partners with founders
              to design, develop, and launch modern websites and SaaS
              products that actually convert.
            </div>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-start gap-3"
              style={{ opacity: 0 }}
            >
              <button
                type="button"
                onClick={() => {
                  trackEvent("booking_click", { button_location: "/hero" });
                  openCal();
                }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "#e8e8e4",
                  color: "#010405",
                }}
              >
                Book a Free Strategy Call
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>

              <Link
                href="/#process"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium transition-all duration-300 hover:bg-white/10"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                See How We Build
              </Link>
            </div>
          </div>

          {/* Right: Floating visual */}
          <div className="hidden md:flex justify-center items-center">
            <div
              ref={visualRef}
              className="relative"
              style={{ opacity: 0 }}
            >
              <img
                src="/images/hero-bg.webp"
                alt=""
                className="w-full max-w-lg object-contain"
                style={{
                  filter: "brightness(0.8) contrast(1.1)",
                  maskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 75%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 75%)",
                  animation: "heroFloat 6s ease-in-out infinite",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(60,90,180,0.1) 0%, transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}} />
    </section>
  );
}

export default Hero;
