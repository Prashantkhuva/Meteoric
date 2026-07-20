"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";

export default function ManifestoSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headingRef.current?.querySelectorAll(".split-line").forEach(el => {
        el.style.opacity = "1";
      });
      return;
    }

    const split = new SplitText(headingRef.current, { type: "lines", linesClass: "split-line" });
    if (!split.lines?.length) return;

    gsap.fromTo(split.lines,
      { opacity: 0.1 },
      {
        opacity: 1,
        stagger: { each: 1 / split.lines.length, ease: "none" },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      },
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-32 sm:py-40 lg:py-48"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="text-white/60 uppercase tracking-[0.2em] text-xs mb-10">
          <span className="font-display text-white/40 not-italic mr-2">01</span>
          Our Philosophy
        </p>

        <h2 ref={headingRef} className="text-3xl md:text-5xl font-secondary-italic leading-snug text-white/80">
          We build digital products that feel inevitable — clean interfaces, solid architecture, software that actually works.
          <span className="block mt-2 text-white/40">No noise. Just results.</span>
        </h2>
      </div>
    </section>
  );
}
