"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";

const process = [
  {
    id: "01",
    title: "Discovery",
    description:
      "We align on the product vision, audience, requirements, and goals before development begins.",
    tags: ["Strategy", "Planning", "Scope"],
  },
  {
    id: "02",
    title: "Design Direction",
    description:
      "Interfaces and user flows designed around clarity, usability, and modern interaction patterns.",
    tags: ["UX", "UI Systems", "Motion"],
  },
  {
    id: "03",
    title: "Development",
    description:
      "Frontend and backend systems engineered for performance, scalability, and maintainability.",
    tags: ["Frontend", "Backend", "APIs"],
  },
  {
    id: "04",
    title: "Launch",
    description:
      "Deployment, optimization, and final polishing before the product goes live.",
    tags: ["Testing", "Deployment", "Support"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headingRef.current?.querySelectorAll(".split-line").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
      progressRef.current.style.height = "100%";
      timelineRef.current?.querySelectorAll(".proc-step").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }

    const split = new SplitText(headingRef.current, { type: "lines", linesClass: "split-line" });
    gsap.fromTo(split.lines,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top bottom",
          toggleActions: "play reset play reset",
        },
      },
    );

    gsap.to(progressRef.current, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 10%",
        end: "bottom 90%",
        scrub: 0.3,
      },
    });

    const steps = timelineRef.current?.querySelectorAll(".proc-step");
    if (steps?.length) {
      gsap.fromTo(steps,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }, { scope: sectionRef });

  return (
    <section
        ref={sectionRef}
        id="process"
        className="relative overflow-hidden scroll-mt-24 py-24 sm:py-28 lg:py-32 bg-black"
      >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,239,255,0.03),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div ref={headingRef} className="mb-20 max-w-4xl sm:mb-24 lg:mb-32">
          <p className="text-white/30 uppercase tracking-[0.2em] text-xs mb-5">
            <span className="font-display text-white/30 not-italic mr-2">02</span>
            Working Together
          </p>

          <h2 className="text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-6xl">
            A structured process built for <span className="text-white/55 font-secondary-italic">modern product development.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/50 sm:mt-8 sm:text-lg">
            Every project moves through a clear workflow — from strategy and
            design to development and launch.
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 overflow-hidden sm:left-5">
            <div className="absolute inset-0 bg-white/10" />
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full rounded-full bg-linear-to-b from-[#EAEFFF] via-[#EAEFFF]/60 to-transparent shadow-[0_0_14px_rgba(234,239,255,0.35)]"
              style={{ height: "0%" }}
            />
          </div>

          <div className="space-y-16 sm:space-y-24 lg:space-y-32">
            {process.map((item) => (
              <div
                key={item.id}
                className="proc-step relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-x-6 md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-24"
              >
                <div className="relative flex items-start">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#111111] shadow-[0_0_20px_rgba(255,255,255,0.06)] sm:h-10 sm:w-10">
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] sm:h-3 sm:w-3" />
                  </div>
                  <span className="hidden md:block absolute left-20 top-0 text-white/15 text-5xl font-semibold tracking-tight">
                    {item.id}
                  </span>
                </div>

                <div className="min-w-0 pb-10 sm:pb-12 md:pb-16">
                  <h3 className="mb-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:mb-8 md:text-5xl font-display">
                    {item.title}
                  </h3>
                  <p className="mb-8 max-w-2xl text-base leading-relaxed text-[#EAEFFF]/50 sm:text-lg md:mb-10 md:text-xl">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {item.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-white/40 transition-colors duration-300 hover:bg-white/5 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
