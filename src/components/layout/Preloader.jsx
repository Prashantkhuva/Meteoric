"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-setup";

const CHARS = "METEORIC".split("");

export default function Preloader({ onDone }) {
  const overlayRef = useRef(null);
  const counterRef = useRef(null);
  const counterWrapRef = useRef(null);
  const charsRef = useRef([]);
  const cometRef = useRef(null);
  const trailRef = useRef(null);
  const tagRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("meteoric-preloader-seen")) {
      const id = setTimeout(() => {
        setDone(true);
        onDone?.();
      }, 0);
      return () => clearTimeout(id);
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("meteoric-preloader-seen", "1");
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      const id = setTimeout(() => {
        setDone(true);
        onDone?.();
      }, 0);
      return () => clearTimeout(id);
    }

    const overlay = overlayRef.current;
    const counter = counterRef.current;
    const comet = cometRef.current;
    const trail = trailRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onDone?.();
        gsap.set(overlay, { display: "none" });
      },
    });

    // 1) comet streaks across
    tl.fromTo(
      comet,
      { x: -60, opacity: 0 },
      { x: "110vw", opacity: 1, duration: 0.7, ease: "power2.in" },
    );

    // trail follows the comet
    tl.fromTo(
      trail,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
      "<0.1",
    );

    // fade trail
    tl.to(trail, { opacity: 0, duration: 0.3 }, "-=0.3");

    // 2) stagger characters in
    tl.fromTo(
      charsRef.current,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.35",
    );

    // 3) tagline fades in
    tl.fromTo(
      tagRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.2",
    );

    // 4) counter wraps in, then counts (sped up)
    tl.fromTo(
      counterWrapRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.15, ease: "power2.out" },
      "-=0.1",
    );

    tl.to(counter, {
      textContent: 100,
      duration: 0.4,
      snap: { textContent: 1 },
      ease: "power1.inOut",
    });

    // 5) everything fades out
    tl.to([overlay], {
      opacity: 0,
      duration: 0.25,
      ease: "power2.inOut",
    });

    return () => tl.kill();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ cursor: "none", background: "var(--bg-primary)" }}
    >
      {/* ambient glow behind everything */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "var(--accent-glow)" }}
        />
      </div>

      {/* comet streak */}
      <div
        ref={cometRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 opacity-0"
      >
        <div className="relative">
          {/* head */}
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 20px 6px var(--accent-glow), 0 0 60px 20px var(--accent-glow)",
            }}
          />
          {/* tail */}
          <div
            className="absolute top-1/2 -translate-y-1/2 right-full w-40 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent-dim))" }}
          />
        </div>
      </div>

      {/* horizontal trail line */}
      <div
        ref={trailRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] origin-left opacity-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, var(--accent-glow) 30%, var(--accent-dim) 50%, var(--accent-glow) 70%, transparent 100%)`,
        }}
      />

      {/* brand name */}
      <div className="relative flex overflow-hidden" aria-hidden="true">
        {CHARS.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              charsRef.current[i] = el;
            }}
            className="inline-block text-[clamp(2.5rem,8vw,72px)] leading-none tracking-[-0.03em] opacity-0"
            style={{ fontFamily: "var(--font-secondary)", color: "var(--text-primary)" }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* tagline */}
      <span
        ref={tagRef}
        className="mt-3 text-[11px] uppercase tracking-[0.35em] opacity-0"
        style={{ fontFamily: "var(--font-primary)", color: "var(--text-muted)" }}
      >
        Digital Craftsmanship
      </span>

      {/* counter — hidden until it starts counting */}
      <div
        ref={counterWrapRef}
        className="mt-8 flex items-center gap-3 opacity-0"
      >
        <div className="w-12 h-[1px]" style={{ background: "var(--border-color)" }} />
        <span
          ref={counterRef}
          className="text-sm tracking-[0.2em] tabular-nums"
          style={{ fontFamily: "var(--font-primary)", color: "var(--text-muted)" }}
        >
          0
        </span>
        <div className="w-12 h-[1px]" style={{ background: "var(--border-color)" }} />
      </div>
    </div>
  );
}
