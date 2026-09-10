"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";

export default function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHover = useRef(false);
  const isDown = useRef(false);
  const raf = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("no-native-cursor");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    gsap.set(dot, { x: -100, y: -100 });
    gsap.set(ring, { x: -100, y: -100 });

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const tick = () => {
      const { x, y } = pos.current;
      const speed = isHover.current ? 0.15 : 0.12;
      const ringSpeed = isHover.current ? 0.08 : 0.06;

      dotPos.current.x = lerp(dotPos.current.x, x, speed);
      dotPos.current.y = lerp(dotPos.current.y, y, speed);
      ringPos.current.x = lerp(ringPos.current.x, x, ringSpeed);
      ringPos.current.y = lerp(ringPos.current.y, y, ringSpeed);

      gsap.set(dot, { x: dotPos.current.x, y: dotPos.current.y });
      gsap.set(ring, { x: ringPos.current.x, y: ringPos.current.y });
      gsap.set(label, { x: ringPos.current.x, y: ringPos.current.y });

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onEnterInteractive = (e) => {
      const t = e.currentTarget;
      if (t.closest("[data-no-cursor]") || t.hasAttribute("data-no-cursor")) return;

      isHover.current = true;

      gsap.to(ring, {
        scale: 0.6,
        borderColor: "rgba(234, 239, 255, 0.5)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot, { scale: 0, duration: 0.2, ease: "power2.out" });

      const tag = t.tagName?.toLowerCase();
      let text = "View";
      if (tag === "a") {
        const href = t.getAttribute("href") || "";
        if (href.includes("mailto:")) text = "Mail";
        else if (href.includes("tel:")) text = "Call";
        else {
          const content = t.textContent?.trim();
          if (content && content.length <= 18) text = content;
          else text = "Visit";
        }
      } else if (tag === "button" || t.getAttribute("role") === "button") {
        text = "Click";
      }

      label.querySelector("span").textContent = text;
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" });

      const bounds = t.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;

      const magnetize = (me) => {
        const dx = (me.clientX - cx) * 0.25;
        const dy = (me.clientY - cy) * 0.25;
        gsap.to(t, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
      };

      const onLeave = () => {
        isHover.current = false;
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.15)",
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(dot, { scale: 1, duration: 0.3, ease: "power3.out" });
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.in" });
        gsap.to(t, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        t.removeEventListener("mousemove", magnetize);
        t.removeEventListener("mouseleave", onLeave);
      };

      t.addEventListener("mousemove", magnetize);
      t.addEventListener("mouseleave", onLeave, { once: true });
    };

    const onDown = () => {
      isDown.current = true;
      gsap.to(ring, { scale: 0.5, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 0.5, duration: 0.15, ease: "power2.out" });
    };

    const onUp = () => {
      isDown.current = false;
      if (!isHover.current) {
        gsap.to(ring, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        gsap.to(dot, { scale: 1, duration: 0.3, ease: "power3.out" });
      }
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring, label], { opacity: 0, duration: 0.3 });
    };
    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const selectors = "a, button, [role='button'], input, textarea, select";
    let bound = new Set();
    const bind = () => {
      document.querySelectorAll(selectors).forEach((t) => {
        if (bound.has(t)) return;
        if (t.closest("[data-no-cursor]") || t.hasAttribute("data-no-cursor")) return;
        t.addEventListener("mouseenter", onEnterInteractive);
        bound.add(t);
      });
    };
    bind();

    const observer = new MutationObserver(() => requestAnimationFrame(bind));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove("no-native-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      observer.disconnect();
      bound.forEach((t) => t.removeEventListener("mouseenter", onEnterInteractive));
      bound.clear();
    };
  }, []);

  return (
    <div className="hidden md:block" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
      {/* Dot — core cursor */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#EAEFFF",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
        }}
        aria-hidden="true"
      />
      {/* Ring — follower */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transform: "translate(-50%, -50%)",
          zIndex: 99998,
          transition: "border-color 0.3s ease",
        }}
        aria-hidden="true"
      />
      {/* Label — hover text */}
      <div
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          opacity: 0,
          scale: 0.8,
          zIndex: 99997,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          style={{
            background: "rgba(10, 10, 10, 0.9)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(234, 239, 255, 0.12)",
            borderRadius: 999,
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#EAEFFF",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            View
          </span>
        </div>
      </div>
    </div>
  );
}
