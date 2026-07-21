"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import MeteorBackground from "./MeteorBackground";
import Link from "next/link";
import StaggerText from "@/components/layout/StaggerText";
function Hero() {
  const containerRef = useRef(null);
  const mainTextRef = useRef(null);
  const mutedTextRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  useEffect(() => {
    import("@calcom/embed-react").then(({ getCalApi }) =>
      getCalApi({ namespace: "let-s-build" }).then((cal) =>
        cal("ui", { theme: "dark", layout: "month_view" }),
      ),
    );
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
    },
    { scope: containerRef },
  );

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-black flex items-center pt-28 md:pt-0"
    >
      <div className="absolute inset-0 pointer-events-none">
        <MeteorBackground showBrand={false} />
      </div>

      <div className="sr-only">
        Meteoric has shipped 12+ production projects since 2024 with 100% client
        satisfaction. Average project delivery takes 7-14 days. Services include
        SaaS development, landing pages, web applications, and full-stack
        development for startups and founders worldwide.
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center gap-8 px-5 sm:px-6 md:px-0 md:-translate-y-12"
      >
        <h1 className="relative font-semibold text-4xl sm:text-6xl md:text-7xl leading-[1.15] tracking-tight text-white">
          <span ref={mainTextRef} className="block">
            We design and ship high-performance software
          </span>
          <span
            ref={mutedTextRef}
            className="block text-white/55 mt-2 font-secondary-italic"
          >
            — websites and apps, fast.
          </span>
        </h1>

        <p
          ref={subtextRef}
          className="relative max-w-2xl text-base md:text-lg text-white/60 leading-relaxed"
        >
          Meteoric is a software development agency that partners with founders
          to design, develop, and launch modern websites and SaaS products that
          actually convert — not just look good.
        </p>

        <div
          ref={ctaRef}
          className="relative flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <button
            type="button"
            onClick={openCal}
            className="group relative inline-flex items-center overflow-hidden border-2 border-[#EAEFFF] px-8 py-4 rounded-full font-semibold text-sm cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.03]"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            <span className="fill-circle bg-[#EAEFFF]" />
            <span className="relative z-10">
              <StaggerText hovered={ctaHovered} hoverColor="#070707">
                {"Book a Free Strategy Call"}
              </StaggerText>
            </span>
          </button>

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
