"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mainWords = "We build digital products that feel inevitable — clean interfaces, solid architecture, software that actually works.".split(" ");
const mutedWords = "No noise. Just results.".split(" ");

export default function ManifestoSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headingRef.current?.querySelectorAll(".mani-word").forEach(el => {
        el.style.filter = "none";
        el.style.opacity = "1";
      });
      return;
    }

    const words = headingRef.current?.querySelectorAll(".mani-word");
    if (!words?.length) return;

    gsap.fromTo(words,
      { filter: "blur(8px)", opacity: 0.1 },
      {
        filter: "blur(0px)",
        opacity: 1,
        stagger: {
          each: 1 / words.length,
          ease: "none",
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.5,
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
        <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-10">
          <span className="font-display text-white/30 not-italic mr-2">01</span>
          Our Philosophy
        </p>

        <h2 ref={headingRef} className="text-3xl md:text-5xl font-secondary-italic leading-snug text-white/80 [&>.mani-word:not(:last-child)]:mr-[0.25em]">
          {mainWords.map((word, i) => (
            <span key={i} className="mani-word inline-block">{word} </span>
          ))}
          <span className="block mt-2 text-white/40 [&>.mani-word:not(:last-child)]:mr-[0.25em]">
            {mutedWords.map((word, i) => (
              <span key={i} className="mani-word inline-block">{word} </span>
            ))}
          </span>
        </h2>
      </div>
    </section>
  );
}
