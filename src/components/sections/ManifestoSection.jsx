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
      className="relative py-20 sm:py-24"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <ScrollReveal direction="down">
          <p className="uppercase tracking-[0.15em] text-caption mb-4 font-medium" style={{ color: "var(--text-secondary)" }}>
            Our Vision
          </p>
        </ScrollReveal>

        <h2 ref={headingRef} className="text-heading-2 md:text-heading-1 font-secondary-italic leading-snug" style={{ color: "var(--text-primary)" }}>
          We build digital products that feel inevitable — clean interfaces, solid architecture, software that actually works.
          <span className="block mt-1.5" style={{ color: "var(--text-muted)" }}>No noise. Just results.</span>
        </h2>
      </div>
    </section>
  );
}
