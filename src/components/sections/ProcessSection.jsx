"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";

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

  useSectionAnimations(
    sectionRef,
    () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        headingRef.current
          ?.querySelectorAll(".split-line")
          .forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
          });
        progressRef.current.style.height = "100%";
        timelineRef.current?.querySelectorAll(".proc-step").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.querySelectorAll(".proc-dot, .proc-num, .proc-title, .proc-desc, .proc-tags > *").forEach(
            (child) => {
              child.style.opacity = "1";
              child.style.transform = "none";
              child.style.filter = "none";
            },
          );
        });
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
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
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
      steps.forEach((step) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 82%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        });

        const dot = step.querySelector(".proc-dot");
        const num = step.querySelector(".proc-num");
        const title = step.querySelector(".proc-title");
        const desc = step.querySelector(".proc-desc");
        const tags = step.querySelector(".proc-tags");

        tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" });
        if (num) tl.fromTo(num, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.25");
        if (title) tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
        if (desc) tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.25");
        if (tags) tl.fromTo(tags.children, { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3, ease: "power2.out" }, "-=0.2");
      });
    }
  },
  [],
);

  return (
    <section
        ref={sectionRef}
        id="process"
        className="relative overflow-hidden scroll-mt-24 py-24 sm:py-28 lg:py-32"
        style={{ background: "var(--bg-primary)" }}
      >
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle_at_center, var(--accent-glow), transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div ref={headingRef} className="mb-20 max-w-4xl sm:mb-24 lg:mb-32">
          <p className="uppercase tracking-[0.2em] text-xs mb-5" style={{ color: "var(--text-muted)" }}>
            <span className="font-display not-italic mr-2" style={{ color: "var(--text-muted)" }}>03</span>
            Working Together
          </p>

          <h2 className="text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-6xl" style={{ color: "var(--text-primary)" }}>
            A structured process built for <span className="font-secondary-italic" style={{ color: "var(--text-secondary)" }}>modern product development.</span>
          </h2>

          <p className="mt-5 sm:mt-6 lg:mt-8 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            Every project moves through a clear workflow
          </p>
          <p className="mt-3 sm:mt-3.5 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-muted)" }}>
            <span className="mr-2 font-display not-italic" style={{ color: "var(--text-muted)" }}>—</span>
            from{" "}
            <span className="font-secondary-italic" style={{ color: "var(--text-secondary)" }}>strategy and design</span>
            {" "}to{" "}
            <span className="font-secondary-italic" style={{ color: "var(--text-secondary)" }}>development and launch</span>.
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 overflow-hidden sm:left-5">
            <div className="absolute inset-0" style={{ background: "var(--border-color)" }} />
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full rounded-full"
              style={{ height: "0%", background: "linear-gradient(to bottom, var(--accent), var(--accent-dim), transparent)", boxShadow: "0 0 14px var(--accent-glow)" }}
            />
          </div>

          <div className="space-y-16 sm:space-y-24 lg:space-y-32">
            {process.map((item) => (
              <div
                key={item.id}
                className="proc-step relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-x-6 md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-24"
              >
                <div className="relative flex items-start">
                  <div className="proc-dot relative z-10 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10" style={{ border: "1px solid var(--border-color)", background: "var(--bg-secondary)", boxShadow: "0 0 20px var(--accent-glow)" }}>
                    <div className="absolute inset-0 rounded-full" style={{ border: "1px solid var(--border-color)" }} />
                    <div className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3" style={{ background: "var(--text-primary)", boxShadow: "0 0 12px var(--accent-glow)" }} />
                  </div>
                  <span className="proc-num hidden md:block absolute left-20 top-0 text-5xl font-semibold tracking-tight" style={{ color: "var(--text-muted)" }}>
                    {item.id}
                  </span>
                </div>

                <div className="min-w-0 pb-10 sm:pb-12 md:pb-16">
                  <h3 className="proc-title mb-5 text-2xl font-semibold tracking-tight sm:text-3xl md:mb-8 md:text-5xl font-display" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="proc-desc mb-8 max-w-2xl text-base leading-relaxed sm:text-lg md:mb-10 md:text-xl" style={{ color: "var(--accent-dim)" }}>
                    {item.description}
                  </p>
                  <div className="proc-tags flex flex-wrap gap-3">
                    {item.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="rounded-full px-3 py-1.5 text-xs transition-colors duration-300 sm:px-4 sm:py-2 sm:text-sm"
                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)" }}
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
