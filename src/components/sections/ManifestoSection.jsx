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
      headingRef.current?.querySelectorAll(".gsap-mani-word").forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }
    gsap.fromTo(headingRef.current?.querySelectorAll(".gsap-mani-word"),
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
      },
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-24 sm:py-28 lg:py-32"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-10">
          <span className="font-display text-white/30 not-italic mr-2">01</span>
          Our Philosophy
        </p>

        <h2
          ref={headingRef}
          className="text-3xl md:text-5xl font-secondary-italic leading-snug text-white/80 [&>.gsap-mani-word:not(:last-child)]:mr-[0.25em]"
        >
          {mainWords.map((word, i) => (
            <span key={i} className="gsap-mani-word inline-block">{word} </span>
          ))}
          <span className="block mt-2 text-white/40 [&>.gsap-mani-word:not(:last-child)]:mr-[0.25em]">
            {mutedWords.map((word, i) => (
              <span key={i} className="gsap-mani-word inline-block">{word} </span>
            ))}
          </span>
        </h2>
      </div>
    </section>
  );
}
