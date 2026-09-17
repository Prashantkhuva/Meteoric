"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import ScrollReveal from "@/components/ui/ScrollReveal";
import useSectionAnimations from "@/hooks/useSectionAnimations";

export default function ManifestoSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useSectionAnimations(
    sectionRef,
    () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        headingRef.current
          ?.querySelectorAll(".split-word")
          .forEach((el) => {
            el.style.opacity = "1";
            el.style.filter = "none";
          });
        return;
      }

      const split = new SplitText(headingRef.current, {
        type: "words",
        wordsClass: "split-word",
      });
      if (!split.words?.length) return;

      gsap.set(split.words, { opacity: 0.15, filter: "blur(4px)" });

      gsap.to(split.words, {
        opacity: 1,
        filter: "blur(0px)",
        stagger: { each: 1 / split.words.length, ease: "none" },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 sm:py-40 lg:py-48"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <ScrollReveal direction="down">
          <p className="uppercase tracking-[0.2em] text-xs mb-10" style={{ color: "var(--text-secondary)" }}>
            <span className="font-display not-italic mr-2" style={{ color: "var(--text-muted)" }}>01</span>
            Our Vision
          </p>
        </ScrollReveal>

        <h2 ref={headingRef} className="text-3xl md:text-5xl font-secondary-italic leading-snug" style={{ color: "var(--text-primary)" }}>
          We build digital products that feel inevitable — clean interfaces, solid architecture, software that actually works.
          <span className="block mt-2" style={{ color: "var(--text-muted)" }}>No noise. Just results.</span>
        </h2>
      </div>
    </section>
  );
}
