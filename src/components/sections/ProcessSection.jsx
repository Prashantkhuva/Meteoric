"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";

const process = [
  {
    id: "01",
    title: "Kickoff",
    description:
      "We align on your vision, target users, requirements, and goals. You get a clear scope and project timeline before a single line of code is written.",
    tags: ["Discovery call", "Scope doc", "Timeline", "Tech stack"],
  },
  {
    id: "02",
    title: "Design",
    description:
      "Interfaces and user flows designed around clarity, usability, and modern interaction patterns. You review and approve before development begins.",
    tags: ["UX", "UI Systems", "Motion", "Prototyping"],
  },
  {
    id: "03",
    title: "Development",
    description:
      "Frontend and backend systems engineered for performance, scalability, and maintainability. Built with modern tools, tested at every step.",
    tags: ["Frontend", "Backend", "APIs", "CI/CD"],
  },
  {
    id: "04",
    title: "Launch",
    description:
      "Deployment, performance optimization, and final polish. We stay with you through launch and beyond — zero handoffs.",
    tags: ["Testing", "Deployment", "Support", "Monitoring"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
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
        timelineRef.current?.querySelectorAll(".proc-step").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        const line = timelineRef.current?.querySelector(".proc-line");
        if (line) line.style.transform = "none";
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

      const steps = timelineRef.current?.querySelectorAll(".proc-step");
      if (steps?.length) {
        // Hide all steps immediately via GSAP (not React inline style)
        gsap.set(steps, { opacity: 0, y: 40 });

        steps.forEach((step) => {
          const dot = step.querySelector(".proc-dot");
          const name = step.querySelector(".proc-name");
          const desc = step.querySelector(".proc-desc");
          const tags = step.querySelector(".proc-tags");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 90%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          });

          // Step container fades in + slides up
          tl.to(step, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0);

          // Dot pops in
          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
            0.1,
          );

          // Name
          tl.fromTo(
            name,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
            0.15,
          );

          // Description
          tl.fromTo(
            desc,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
            0.25,
          );

          // Tags stagger
          if (tags) {
            tl.fromTo(
              tags.children,
              { y: 10, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.06,
                duration: 0.35,
                ease: "power2.out",
              },
              0.35,
            );
          }
        });

        // Vertical line grows as you scroll through the section
        const line = timelineRef.current?.querySelector(".proc-line");
        if (line) {
          gsap.to(line, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden scroll-mt-24"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div ref={headingRef} className="pt-16 pb-10 lg:pt-24 lg:pb-14">
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
            From idea to launch.{" "}
            <span
              className="font-secondary-italic"
              style={{ color: "var(--text-secondary)" }}
            >
              Our exact process.
            </span>
          </h2>
        </div>

        <div ref={timelineRef} className="relative pb-16 lg:pb-24">
          {/* Thin vertical line — grows on scroll */}
          <div
            className="proc-line absolute top-0 left-[5px] h-full w-px origin-top"
            style={{ scaleY: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "var(--border-color)" }}
            />
          </div>

          <div className="space-y-0">
            {process.map((item) => (
              <div
                key={item.id}
                className="proc-step relative py-12 sm:py-16 lg:py-20"
              >
                {/* Dot — 11px wide, center at left+5.5px; line center at 5.5px → left: 0 */}
                <div className="absolute left-0 top-[48px] sm:top-[64px] z-10">
                  <div
                    className="proc-dot h-[11px] w-[11px] rounded-full"
                    style={{
                      background: "var(--text-primary)",
                      boxShadow: "0 0 10px var(--accent-glow)",
                    }}
                  />
                </div>

                {/* Step name */}
                <h3
                  className="proc-name pl-10 sm:pl-12 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="proc-desc pl-10 sm:pl-12 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mb-5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.description}
                </p>

                {/* Tags */}
                <div className="proc-tags pl-10 sm:pl-12 flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wide"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
