"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

/**
 * Directional masked-wipe reveal via passive-scroll rect check + CSS transitions.
 *
 * No GSAP/ScrollTrigger per element — one cheap rect check per node on rAF,
 * clip-path animates on the compositor-friendly CSS path. `direction` = travel
 * direction:
 * - up:    enters from below, rises
 * - down:  enters from above, drops
 * - left:  enters from the right, slides leftward
 * - right: enters from the left, slides rightward
 *
 * Hidden-until-reveal only applies when `html[data-reveal]` is set (inline
 * script in root layout, skipped under prefers-reduced-motion), so SSR HTML
 * stays fully visible for no-JS / reduced-motion users.
 *
 * After the wipe finishes, inline clip-path/transform/opacity are pinned to
 * their final values so hover transforms on children are never clipped.
 * Reveal runs once — no reverse on scroll-up (avoids constant repaint).
 */

const FROM = {
  up: { clip: "inset(100% 0% 0% 0%)", x: 0, y: 48 },
  down: { clip: "inset(0% 0% 100% 0%)", x: 0, y: -48 },
  left: { clip: "inset(0% 0% 0% 100%)", x: 56, y: 0 },
  right: { clip: "inset(0% 100% 0% 0%)", x: -56, y: 0 },
};

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  direction?: keyof typeof FROM;
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const from = FROM[direction] || FROM.up;

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.hasAttribute("data-reveal")) return;

    const onEnd = (ev: TransitionEvent) => {
      if (ev.target !== el || ev.propertyName !== "clip-path") return;
      el.removeEventListener("transitionend", onEnd);
      el.style.clipPath = "none";
      el.style.transform = "none";
      el.style.opacity = "1";
      el.classList.remove("rv-in");
    };

    // Rect check on passive scroll instead of IntersectionObserver: Chromium
    // reports isIntersecting=false when the pre-state combines clip-path with
    // translate3d (clip alone and translate alone both fire, combined does
    // not) — so the observer never fires and the wipe stays stuck at FROM.
    // getBoundingClientRect() measures layout, which clip-path cannot hide.
    // Same trigger as old ScrollTrigger "top 90%" / IO rootMargin -10%.
    let done = false;
    let raf = 0;

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    const check = () => {
      raf = 0;
      if (done) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight * 0.9) {
        done = true;
        el.addEventListener("transitionend", onEnd);
        el.classList.add("rv-in");
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("transitionend", onEnd);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={
        {
          "--rv-clip": from.clip,
          "--rv-t": `translate3d(${from.x}px, ${from.y}px, 0)`,
          "--rv-dur": `${duration}s`,
          "--rv-delay": `${delay}s`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
