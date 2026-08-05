"use client";

import { useEffect } from "react";

/**
 * Defers an animation setup until the section is near the viewport.
 *
 * SplitText + ScrollTrigger creation is expensive; running it for every
 * below-the-fold section during hydration creates one big main-thread burst
 * (visible as a multi-second long task on Lighthouse). This hook waits for the
 * section to approach the viewport, then runs the setup on idle.
 *
 * @param {import("react").RefObject} ref  Ref to the section root element
 * @param {() => void} setup               GSAP/ScrollTrigger setup callback
 * @param {Array} deps                     Effect dependencies
 */
export default function useSectionAnimations(ref, setup, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ran = false;
    let cleanup = null;

    const run = () => {
      if (cancelled || ran) return;
      ran = true;
      const execute = () => {
        if (cancelled) return;
        const result = setup();
        if (typeof result === "function") cleanup = result;
      };
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(execute, { timeout: 800 });
      } else {
        setTimeout(execute, 100);
      }
    };

    // If the section is already in view (e.g. hero, short viewports), run now.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      cleanup?.();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
