"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-setup";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import Logo from "@/components/sections/Logo";

const CHARS = "METEORIC".split("");
const EASE_PREMIUM = "expo.out";
const EASE_EXIT = "expo.inOut";

export default function Preloader({ onDone }) {
  const overlayRef = useRef(null);
  const glowRef = useRef(null);
  const hairlineRef = useRef(null);
  const charsRef = useRef([]);
  const tagRef = useRef(null);
  const logoRef = useRef(null);
  const metaRef = useRef(null);
  const barRef = useRef(null);
  const barWrapRef = useRef(null);
  const counterRef = useRef(null);
  const [done, setDone] = useState(false);
  const lockedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("meteoric-preloader-seen", "1");
      }
      if (lockedRef.current) {
        unlockScroll();
        lockedRef.current = false;
      }
      setDone(true);
      onDone?.();
    };

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen =
      typeof window !== "undefined" &&
      sessionStorage.getItem("meteoric-preloader-seen");

    if (seen || reduced) {
      const id = setTimeout(finish, 0);
      return () => clearTimeout(id);
    }

    lockScroll();
    lockedRef.current = true;

    const overlay = overlayRef.current;
    const chars = charsRef.current;

    gsap.set(chars, { yPercent: 115 });
    gsap.set([tagRef.current, logoRef.current, metaRef.current], {
      opacity: 0,
    });
    gsap.set(barWrapRef.current, { opacity: 0 });
    gsap.set(barRef.current, { scaleX: 0 });
    gsap.set(hairlineRef.current, { scaleX: 0, opacity: 1 });
    gsap.set(glowRef.current, {
      opacity: 0,
      scale: 0.7,
      xPercent: -50,
      yPercent: -50,
    });

    const progress = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        finish();
      },
    });

    // ambient glow breathes in
    tl.to(glowRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "power2.out",
    });

    // hairline sweeps across center
    tl.to(
      hairlineRef.current,
      { scaleX: 1, duration: 0.85, ease: EASE_PREMIUM },
      0.1,
    );

    // logo + corner meta
    tl.to(
      [logoRef.current, metaRef.current],
      { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.06 },
      0.35,
    );

    // wordmark rises from mask
    tl.to(
      chars,
      {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.045,
        ease: EASE_PREMIUM,
      },
      0.4,
    );

    // tagline: tracking opens + fade
    tl.fromTo(
      tagRef.current,
      { opacity: 0, y: 14, letterSpacing: "0.6em" },
      {
        opacity: 1,
        y: 0,
        letterSpacing: "0.35em",
        duration: 0.7,
        ease: EASE_PREMIUM,
      },
      0.85,
    );

    // hairline shrinks to sit under wordmark
    tl.to(
      hairlineRef.current,
      { scaleX: 0.35, opacity: 0.5, duration: 0.7, ease: EASE_PREMIUM },
      1.0,
    );

    // progress bar + counter
    tl.to(barWrapRef.current, { opacity: 1, duration: 0.3 }, 1.1);

    tl.to(
      progress,
      {
        value: 100,
        duration: 0.85,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(progress.value);
          if (counterRef.current) counterRef.current.textContent = String(v);
        },
      },
      1.15,
    );

    tl.to(
      barRef.current,
      { scaleX: 1, duration: 0.85, ease: "power1.inOut" },
      1.15,
    );

    // hold a beat at 100
    tl.to({}, { duration: 0.25 });

    // exit: content lifts out
    tl.to(
      chars,
      {
        yPercent: -115,
        duration: 0.55,
        stagger: 0.03,
        ease: "power3.in",
      },
      "exit",
    );

    tl.to(
      [tagRef.current, logoRef.current, metaRef.current, barWrapRef.current],
      { opacity: 0, y: -16, duration: 0.4, ease: "power2.in", stagger: 0.03 },
      "exit+=0.1",
    );

    tl.to(
      hairlineRef.current,
      { scaleX: 0, opacity: 0, duration: 0.4, ease: "power2.in" },
      "exit+=0.15",
    );

    tl.to(glowRef.current, { opacity: 0, duration: 0.4 }, "exit+=0.15");

    // curtain wipes upward
    tl.to(
      overlay,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.85,
        ease: EASE_EXIT,
      },
      "exit+=0.35",
    );

    return () => {
      tl.kill();
      if (lockedRef.current) {
        unlockScroll();
        lockedRef.current = false;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        background: "#050505",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
      aria-hidden="true"
    >
      {/* ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full blur-[110px]"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.7)",
          background:
            "radial-gradient(circle, rgba(234,239,255,0.14) 0%, rgba(234,239,255,0.03) 45%, transparent 70%)",
        }}
      />

      {/* soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* top bar: logo + meta */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div ref={logoRef} style={{ opacity: 0 }}>
          <Logo light={false} className="h-5 w-auto md:h-6" />
        </div>
        <span
          ref={metaRef}
          className="text-[10px] uppercase tracking-[0.3em] text-white/35"
          style={{ fontFamily: "var(--font-primary)", opacity: 0 }}
        >
          Digital Craftsmanship
        </span>
      </div>

      {/* center hairline */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div
          ref={hairlineRef}
          className="mx-auto h-px w-[min(88vw,720px)] origin-center"
          style={{
            transform: "scaleX(0)",
            background:
              "linear-gradient(90deg, transparent, rgba(234,239,255,0.55) 20%, rgba(234,239,255,0.85) 50%, rgba(234,239,255,0.55) 80%, transparent)",
          }}
        />
      </div>

      {/* wordmark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex overflow-hidden" aria-hidden="true">
          {CHARS.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                charsRef.current[i] = el;
              }}
              className="inline-block text-[clamp(2.4rem,9vw,80px)] leading-none tracking-[-0.03em] text-white will-change-transform"
              style={{
                fontFamily: "var(--font-secondary)",
                fontWeight: 500,
                transform: "translateY(115%)",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <span
          ref={tagRef}
          className="mt-4 text-[10px] uppercase text-white/40 md:text-[11px]"
          style={{
            fontFamily: "var(--font-primary)",
            letterSpacing: "0.35em",
            opacity: 0,
          }}
        >
          Web · Software · SaaS
        </span>
      </div>

      {/* bottom progress */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-8">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-[10px] uppercase tracking-[0.28em] text-white/30">
            Loading experience
          </span>
          <span
            ref={counterRef}
            className="text-sm tabular-nums tracking-[0.15em] text-white/70"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            0
          </span>
        </div>
        <div
          ref={barWrapRef}
          className="h-px w-full origin-left bg-white/10"
          style={{ opacity: 0 }}
        >
          <div
            ref={barRef}
            className="h-px w-full origin-left"
            style={{
              transform: "scaleX(0)",
              background:
                "linear-gradient(90deg, rgba(234,239,255,0.3), #EAEFFF)",
              boxShadow: "0 0 12px rgba(234,239,255,0.45)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
