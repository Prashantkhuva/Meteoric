"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MagneticCursor() {
  const dotRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    let raf;
    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;
      dot.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnterInteractive = (e) => {
      const el = e.currentTarget;
      const bounds = el.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;

      gsap.to(dot, {
        scale: 3,
        mixBlendMode: "difference",
        backgroundColor: "#EAEFFF",
        duration: 0.3,
        ease: "power2.out",
      });

      const magnetize = (me) => {
        const dx = (me.clientX - cx) * 0.3;
        const dy = (me.clientY - cy) * 0.3;
        gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
      };

      const onLeave = () => {
        gsap.to(dot, { scale: 1, mixBlendMode: "normal", backgroundColor: "#EAEFFF", duration: 0.3 });
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
        el.removeEventListener("mousemove", magnetize);
        el.removeEventListener("mouseleave", onLeave);
      };

      el.addEventListener("mousemove", magnetize);
      el.addEventListener("mouseleave", onLeave, { once: true });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    const selectors = "a, button, [role='button']";
    document.querySelectorAll(selectors).forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseenter", onEnterInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.querySelectorAll(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
      });
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#EAEFFF] pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
