"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-setup";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import Logo from "@/components/sections/Logo";

const EASE_IN = "expo.out";
const EASE_OUT = "power4.inOut";

export default function Preloader({ onDone }) {
  const overlayRef = useRef(null);
  const glowRef = useRef(null);
  const logoMaskRef = useRef(null);
  const logoInnerRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const numRef = useRef(null);
  const statusRef = useRef(null);
  const footerRef = useRef(null);
  const streakRef = useRef(null);
  const [done, setDone] = useState(false);
  const lockedRef = useRef(false);
  const flashedRef = useRef(false);

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

    gsap.set(logoInnerRef.current, { yPercent: 120 });
    gsap.set(logoMaskRef.current, { opacity: 0 });
    gsap.set(trackRef.current, { opacity: 0, scaleX: 0.4 });
    gsap.set(fillRef.current, { scaleX: 0 });
    gsap.set([numRef.current, statusRef.current, footerRef.current], {
      opacity: 0,
      y: 8,
    });
    gsap.set(glowRef.current, {
      opacity: 0,
      scale: 0.85,
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(streakRef.current, { opacity: 0, xPercent: -130 });

    const progress = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        finish();
      },
    });

    // soft halo
    tl.to(
      glowRef.current,
      { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
      0,
    );

    // logo rises from mask
    tl.to(logoMaskRef.current, { opacity: 1, duration: 0.6 }, 0.15);
    tl.to(
      logoInnerRef.current,
      { yPercent: 0, duration: 1.15, ease: EASE_IN },
      0.2,
    );

    // hairline track settles in
    tl.to(
      trackRef.current,
      { opacity: 1, scaleX: 1, duration: 1, ease: EASE_IN },
      0.55,
    );

    // counter label fades up
    tl.to(
      [statusRef.current, numRef.current, footerRef.current],
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 },
      0.85,
    );

    // progress fill + count, slow and even
    tl.to(
      progress,
      {
        value: 100,
        duration: 1.35,
        ease: "power2.inOut",
        onUpdate: () => {
          if (numRef.current) {
            const n = Math.round(progress.value);
            numRef.current.textContent = String(n).padStart(2, "0");
            if (n >= 100 && !flashedRef.current) {
              flashedRef.current = true;
              gsap.fromTo(
                numRef.current,
                { color: "#EAEFFF" },
                {
                  color: "rgba(255,255,255,0.5)",
                  duration: 0.65,
                  ease: "power2.out",
                },
              );
              gsap.fromTo(
                fillRef.current,
                { filter: "brightness(2)" },
                {
                  filter: "brightness(1)",
                  duration: 0.55,
                  ease: "power2.out",
                },
              );
            }
          }
        },
      },
      0.95,
    );

    tl.to(
      fillRef.current,
      { scaleX: 1, duration: 1.35, ease: "power2.inOut" },
      0.95,
    );

    // quiet hold
    tl.to({}, { duration: 0.35 });

    // exit — content drifts up, soft fade
    const exitAt = ">";

    // meteor streak races across just before the wipe
    tl.fromTo(
      streakRef.current,
      { opacity: 0, xPercent: -130 },
      {
        opacity: 1,
        xPercent: 130,
        duration: 0.75,
        ease: "power3.inOut",
      },
      exitAt,
    );
    tl.to(
      streakRef.current,
      { opacity: 0, duration: 0.25, ease: "power2.in" },
      "-=0.25",
    );

    tl.to(
      logoInnerRef.current,
      { yPercent: -120, duration: 0.85, ease: "power3.inOut" },
      "<0.1",
    );

    tl.to(
      [trackRef.current, fillRef.current],
      { opacity: 0, duration: 0.55, ease: "power2.inOut" },
      "<0.15",
    );

    tl.to(
      [numRef.current, statusRef.current, footerRef.current],
      { opacity: 0, y: -10, duration: 0.5, ease: "power2.inOut" },
      "<0.05",
    );

    tl.to(glowRef.current, { opacity: 0, duration: 0.7 }, "<0.1");

    // curtain wipes up — slow, luxurious
    tl.to(
      overlay,
      { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: EASE_OUT },
      "-=0.55",
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
      {/* meteor streak — exits across the frame before the wipe */}
      <div
        ref={streakRef}
        className="pointer-events-none absolute left-0 top-1/2 h-px w-[45vw] max-w-[520px] -translate-y-1/2 rotate-[-6deg]"
        style={{
          opacity: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(234,239,255,0.15) 35%, rgba(234,239,255,0.95) 55%, rgba(234,239,255,0.2) 75%, transparent 100%)",
          boxShadow: "0 0 12px rgba(234,239,255,0.45)",
        }}
      />

      {/* quiet halo */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,640px)] w-[min(90vw,640px)] rounded-full blur-[140px]"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.85)",
          background:
            "radial-gradient(circle, rgba(234,239,255,0.07) 0%, rgba(234,239,255,0.02) 40%, transparent 70%)",
        }}
      />

      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px",
        }}
      />

      {/* center lockup */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6">
        {/* logo, masked reveal */}
        <div ref={logoMaskRef} className="overflow-hidden py-1">
          <div ref={logoInnerRef} className="will-change-transform">
            <Logo light={false} className="h-7 w-auto md:h-9" />
          </div>
        </div>

        {/* progress hairline */}
        <div
          ref={trackRef}
          className="h-px w-[min(60vw,240px)] origin-center bg-white/10"
          style={{ opacity: 0 }}
        >
          <div
            ref={fillRef}
            className="h-px w-full origin-left"
            style={{
              transform: "scaleX(0)",
              background:
                "linear-gradient(90deg, rgba(234,239,255,0.25), rgba(234,239,255,0.95))",
            }}
          />
        </div>

        {/* counter */}
        <div className="flex items-center gap-3">
          <span
            ref={statusRef}
            className="text-[10px] uppercase tracking-[0.32em] text-white/30"
            style={{ opacity: 0 }}
          >
            Initializing
          </span>
          <span
            ref={numRef}
            className="text-[11px] tabular-nums tracking-[0.2em] text-white/50"
            style={{ opacity: 0 }}
          >
            00
          </span>
        </div>
      </div>

      {/* footer whisper */}
      <div
        ref={footerRef}
        className="absolute inset-x-0 bottom-0 flex justify-center pb-8"
        style={{ opacity: 0 }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/20">
          Meteoric — Digital Craftsmanship
        </span>
      </div>
    </div>
  );
}
