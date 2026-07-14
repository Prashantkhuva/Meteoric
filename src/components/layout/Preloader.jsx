"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CHARS = "METEORIC".split("");

// ponytail: deterministic pseudo-random for consistent meteor positions
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const METEOR_COUNT = 18;
const rng = seededRandom(42);
const meteors = Array.from({ length: METEOR_COUNT }, () => ({
  top: `${rng() * 65}%`,
  left: `${rng() * 110 - 10}%`,
  delay: `${rng() * 4}s`,
  duration: `${1.2 + rng() * 2.5}s`,
  dist: 400 + rng() * 400,
  width: 80 + rng() * 180,
  opacity: 0.3 + rng() * 0.7,
}));

export default function Preloader() {
  const overlayRef = useRef(null);
  const counterRef = useRef(null);
  const charsRef = useRef([]);
  const tagRef = useRef(null);
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

    // 1) stagger characters in
    tl.fromTo(
      charsRef.current,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
      },
    );

    // 2) tagline fades in
    tl.fromTo(
      tagRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2",
    );

    // 3) count 0 → 100
    tl.to(
      counterRef.current,
      {
        textContent: 100,
        duration: 1.2,
        snap: { textContent: 1 },
        ease: "power1.inOut",
      },
      "-=0.3",
    );

    // 4) pause
    tl.to({}, { duration: 0.3 });

    // 5) everything fades out
    tl.to(overlay, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    return () => tl.kill();
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707] overflow-hidden"
    >
      {/* ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-[#EAEFFF]/[0.03] blur-[100px]" />
      </div>

      {/* meteor shower — pure CSS */}
      {meteors.map((m, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: m.top,
            left: m.left,
            width: m.width,
            height: 2,
            background: `linear-gradient(90deg, transparent, rgba(234,239,255,${m.opacity * 0.6}), rgba(255,255,255,${m.opacity}))`,
            borderRadius: 2,
            boxShadow: `0 0 ${6 + m.opacity * 10}px ${2 + m.opacity * 4}px rgba(234,239,255,${m.opacity * 0.4})`,
            "--m-angle": "215deg",
            "--m-dist": m.dist,
            animation: `meteor-fall ${m.duration} linear ${m.delay} infinite`,
          }}
        />
      ))}

      {/* brand name */}
      <div className="relative flex overflow-hidden z-10" aria-hidden="true">
        {CHARS.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              charsRef.current[i] = el;
            }}
            className="inline-block text-[clamp(2.5rem,8vw,72px)] leading-none tracking-[-0.03em] text-white opacity-0"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* tagline */}
      <span
        ref={tagRef}
        className="relative z-10 mt-3 text-[11px] uppercase tracking-[0.35em] text-white/25 opacity-0"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        Digital Craftsmanship
      </span>

      {/* counter */}
      <span
        ref={counterRef}
        className="relative z-10 mt-6 text-xs tracking-[0.25em] text-white/30 tabular-nums"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        0
      </span>
    </div>
  );
}
