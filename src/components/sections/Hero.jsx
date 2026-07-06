"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MeteorBackground from "./MeteorBackground";
import Link from "next/link";

const heroWords = "We design and ship high-performance websites".split(" ");
const mutedWords = ["—", ..."in weeks, not months.".split(" ")];

function Hero() {
  const containerRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async function () {
      try {
        const { getCalApi } = await import("@calcom/embed-react");
        if (cancelled) return;
        const cal = await getCalApi({ namespace: "let-s-build" });
        cal("ui", { theme: "dark", layout: "month_view" });
      } catch {
        /* embed optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".gsap-word").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
      if (subtextRef.current) { subtextRef.current.style.opacity = "1"; subtextRef.current.style.transform = "none"; }
      if (ctaRef.current) { ctaRef.current.style.opacity = "1"; ctaRef.current.style.transform = "none"; }
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
    tl.fromTo(containerRef.current?.querySelectorAll(".gsap-word"),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04 },
    )
      .from(subtextRef.current, { y: 30, opacity: 0 }, "-=0.25")
      .from(ctaRef.current, { y: 30, opacity: 0 }, "-=0.2");
  }, { scope: containerRef });

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-black flex items-center px-6 md:px-16 pt-28 md:pt-0"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <MeteorBackground showBrand={false} />
      </div>

      {/* Content */}
      <div ref={containerRef} className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center gap-8 md:-translate-y-[45px]">
        {/* Heading */}
        <h1 className="relative font-semibold text-4xl sm:text-6xl md:text-7xl leading-[1.15] tracking-tight text-white">
          <span className="block [&>.gsap-word:not(:last-child)]:mr-[0.25em]">
            {heroWords.map((word, i) => (
              <span key={i} className="gsap-word inline-block">{word}</span>
            ))}
          </span>
          <span className="block text-white/55 mt-2 font-secondary-italic [&>.gsap-word:not(:last-child)]:mr-[0.25em]">
            {mutedWords.map((word, i) => (
              <span key={i} className="gsap-word inline-block">{word}</span>
            ))}
          </span>
        </h1>

        {/* Subtext */}
        <p ref={subtextRef} className="relative max-w-2xl text-base md:text-lg text-white/60 leading-relaxed">
          Meteoric partners with founders to design, develop, and launch modern
          websites and SaaS products that actually convert — not just look good.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="relative flex flex-col sm:flex-row items-center gap-4 mt-4">
          {/* Primary CTA */}
          <a
            href="#"
            data-cal-namespace="let-s-build"
            data-cal-link="prashantkhuva/let-s-build"
            data-cal-config='{"layout":"month_view"}'
            className="relative overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-black">
              Book a Free Strategy Call
            </span>
          </a>

          {/* Secondary CTA */}
          <Link
            href="/#process"
            className="group relative inline-flex items-center gap-2 text-base font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            See How We Build
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-white/60 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
