"use client";

import { useCallback, useRef, useState, Suspense, lazy } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import Link from "next/link";
import GridLines from "@/components/ui/GridLines";
import { trackEvent } from "@/lib/analytics/gtag";

const HeroScene = lazy(() => import("./HeroScene"));

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

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.55 },
        });
        tl.fromTo(allLines, { y: 60 }, { y: 0, stagger: 0.1 })
          .from(ctaRef.current, { y: 30 }, "-=0.25")
          .from(subtextRef.current, { y: 30 }, "-=0.15");

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
      {/* 3D scene canvas */}
      <div className="absolute inset-0" aria-hidden="true">
        <Suspense fallback={<HeroFallback />}>
          <HeroScene />
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
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, #010405 100%)",
          opacity: 0.6 + scrollProgress * 0.4,
        }}
      />

      {/* Top/bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #010405 0%, transparent 6%, transparent 94%, #010405 100%)",
        }}
      />

      <GridLines />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-12 flex flex-col justify-center min-h-screen py-16 md:py-20">
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-[1fr_0.55fr] gap-8 md:gap-12 items-start">
          {/* Left: Headline + Buttons */}
          <div className="max-w-md">
            <h1
              className="font-semibold leading-[1.1] tracking-[-0.02em] mb-2"
              style={{
                color: "#ffffff",
                fontSize: "clamp(2.25rem, 6vw, 2.5rem)",
              }}
            >
              <span ref={mainTextRef} className="block">
                Ship Fast.
              </span>
              <span
                ref={mutedTextRef}
                className="block"
                style={{ color: "#ffffff" }}
              >
                Ship Right.
              </span>
              <span
                className="block"
                style={{ color: "#ffffff" }}
              >
                Ship Meteoric.
              </span>
            </h1>

            <div
              ref={ctaRef}
              className="flex flex-row items-center gap-3"
            >
              <button
                type="button"
                onClick={() => {
                  trackEvent("booking_click", { button_location: "/hero" });
                  openCal();
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
                style={{
                  background: "#ffffff",
                  color: "#010405",
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

              <Link
                href="/#process"
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-[13px] font-semibold transition-all duration-300 hover:opacity-70"
                style={{
                  color: "#ffffff",
                }}
              >
                See How We Build
              </Link>
            </div>
          </div>

          {/* Right: Description */}
          <div
            ref={subtextRef}
            className="md:pt-2 max-w-[260px] md:ml-20"
          >
            <p
              className="leading-relaxed"
              style={{
                color: "#ffffff",
                fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
              }}
            >
              SaaS products, web apps, and startup MVPs — from first deploy to
              scale.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Hero;
