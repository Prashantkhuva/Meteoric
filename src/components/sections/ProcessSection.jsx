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
          el.querySelectorAll(
            ".proc-dot, .proc-num, .proc-title, .proc-desc, .proc-tags > *",
          ).forEach((child) => {
            child.style.opacity = "1";
            child.style.transform = "none";
            child.style.filter = "none";
          });
        });
        return;
      }

      const split = new SplitText(headingRef.current, {
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
          start: "top 75%",
          end: "bottom 65%",
          scrub: 0.3,
        },
      });

      const steps = timelineRef.current?.querySelectorAll(".proc-step");
      if (steps?.length) {
        steps.forEach((step) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none reverse none",
              invalidateOnRefresh: true,
            },
          });

          const dot = step.querySelector(".proc-dot");
          const num = step.querySelector(".proc-num");
          const title = step.querySelector(".proc-title");
          const desc = step.querySelector(".proc-desc");
          const tags = step.querySelector(".proc-tags");

          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
          );
          if (num)
            tl.fromTo(
              num,
              { x: -15, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
              "-=0.2",
            );
          if (title)
            tl.fromTo(
              title,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
              "-=0.2",
            );
          if (desc)
            tl.fromTo(
              desc,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
              "-=0.2",
            );
          if (tags)
            tl.fromTo(
              tags.children,
              { y: 10, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.25,
                ease: "power2.out",
              },
              "-=0.15",
            );
        });
      }
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden scroll-mt-24 py-14 sm:py-16 lg:py-20"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div ref={headingRef} className="mb-10 max-w-4xl sm:mb-12 lg:mb-14">
          <p
            className="uppercase tracking-[0.15em] text-caption mb-4 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Our Process
          </p>

          <h2
            className="text-heading-1 font-semibold leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            A structured process built for{" "}
            <span className="font-secondary-italic" style={{ color: "var(--text-secondary)" }}>
              modern product development.
            </span>
          </h2>

          <p
            className="mt-4 max-w-2xl text-body-sm leading-normal"
            style={{ color: "var(--text-secondary)" }}
          >
            Every project moves through a clear workflow — from strategy and
            design to development and launch.
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-0 h-full w-px sm:left-[22px]">
            <div
              className="absolute inset-0"
              style={{ background: "var(--border-color)" }}
            />
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full rounded-full"
              style={{
                height: "0%",
                background:
                  "linear-gradient(to bottom, var(--accent), var(--accent-dim), transparent)",
                boxShadow: "0 0 10px var(--accent-glow)",
              }}
            />
          </div>

          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {process.map((item) => (
              <div
                key={item.id}
                className="proc-step relative flex gap-5 sm:gap-6 md:gap-10"
              >
                {/* Dot + number */}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center sm:h-11 sm:w-11">
                  <div
                    className="proc-dot relative z-10 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10"
                    style={{
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      boxShadow: "0 0 16px var(--accent-glow)",
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                      style={{
                        background: "var(--text-primary)",
                        boxShadow: "0 0 8px var(--accent-glow)",
                      }}
                    />
                  </div>
                  <span
                    className="proc-num absolute -right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.id}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 pb-2">
                  <h3
                    className="proc-title mb-1.5 text-lg font-medium tracking-tight sm:text-xl"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="proc-desc mb-3 max-w-xl text-body-sm leading-relaxed sm:mb-3.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.description}
                  </p>
                  <div className="proc-tags flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          border: "1px solid var(--border-color)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {tag}
                      </span>
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
