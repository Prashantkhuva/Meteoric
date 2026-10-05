"use client";

import { useEffect, useRef } from "react";

/**
 * Directional masked-wipe reveal via IntersectionObserver + CSS transitions.
 *
 * No GSAP/ScrollTrigger per element — one cheap IO per node, clip-path animates
 * on the compositor-friendly CSS path. `direction` = travel direction:
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

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  style,
  ...props
}) {
  const ref = useRef(null);
  const from = FROM[direction] || FROM.up;

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.hasAttribute("data-reveal")) return;

    const onEnd = (ev) => {
      if (ev.target !== el || ev.propertyName !== "clip-path") return;
      el.removeEventListener("transitionend", onEnd);
      el.style.clipPath = "none";
      el.style.transform = "none";
      el.style.opacity = "1";
      el.classList.remove("rv-in");
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.addEventListener("transitionend", onEnd);
        el.classList.add("rv-in");
      },
      // Same trigger point as the old ScrollTrigger: "top 90%"
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      el.removeEventListener("transitionend", onEnd);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        "--rv-clip": from.clip,
        "--rv-t": `translate3d(${from.x}px, ${from.y}px, 0)`,
        "--rv-dur": `${duration}s`,
        "--rv-delay": `${delay}s`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
