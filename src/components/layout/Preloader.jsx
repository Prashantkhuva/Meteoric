"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CHARS = "METEORIC".split("");

export default function Preloader() {
  const overlayRef = useRef(null);
  const counterRef = useRef(null);
  const charsRef = useRef([]);
  const lineRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      const id = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(id);
    }

    const overlay = overlayRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        gsap.set(overlay, { display: "none" });
      },
    });

    // 1) horizontal line expands from center
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
    );

    // 2) characters reveal with stagger
    tl.fromTo(
      charsRef.current,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.3",
    );

    // 3) line fades out
    tl.to(lineRef.current, { opacity: 0, duration: 0.4 }, "-=0.1");

    // 4) counter
    tl.to(
      counterRef.current,
      {
        textContent: 100,
        duration: 1,
        snap: { textContent: 1 },
        ease: "power1.inOut",
      },
      "-=0.5",
    );

    // 5) pause
    tl.to({}, { duration: 0.2 });

    // 6) fade out
    tl.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    return () => tl.kill();
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707]"
    >
      {/* horizontal line */}
      <div
        ref={lineRef}
        className="w-24 h-[1px] bg-white/15 origin-center mb-8"
      />

      {/* brand name */}
      <div className="flex overflow-hidden" aria-hidden="true">
        {CHARS.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              charsRef.current[i] = el;
            }}
            className="inline-block text-[clamp(2rem,7vw,64px)] leading-none tracking-[0.08em] text-white opacity-0"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* counter */}
      <span
        ref={counterRef}
        className="mt-8 text-[11px] tracking-[0.3em] text-white/20 tabular-nums"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        0
      </span>
    </div>
  );
}
