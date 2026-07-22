"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ManifestoSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headingRef.current?.querySelectorAll(".split-word").forEach(el => {
        el.style.opacity = "1";
        el.style.filter = "none";
      });
      return;
    }

    const split = new SplitText(headingRef.current, { type: "words", wordsClass: "split-word" });
    if (!split.words?.length) return;

    gsap.set(split.words, { opacity: 0.08, filter: "blur(8px)" });

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
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-32 sm:py-40 lg:py-48"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <ScrollReveal direction="down">
          <p className="text-white/60 uppercase tracking-[0.2em] text-xs mb-10">
            <span className="font-display text-white/40 not-italic mr-2">01</span>
            Our Philosophy
          </p>
        </ScrollReveal>

        <h2 ref={headingRef} className="text-3xl md:text-5xl font-secondary-italic leading-snug text-white/80">
          We build digital products that feel inevitable — clean interfaces, solid architecture, software that actually works.
          <span className="block mt-2 text-white/40">No noise. Just results.</span>
        </h2>
      </div>
    </section>
  );
}
