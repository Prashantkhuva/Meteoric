"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-setup";

const ARROW_SIZE = 22;
const BADGE_SIZE = 64;

// ponytail: tip offset = arrow SVG tip position scaled to ARROW_SIZE
// SVG tip at ~(41,41) in 256x256 viewBox, arrow centered in BADGE container
const ARROW_TIP_X = (41 / 256) * ARROW_SIZE + (BADGE_SIZE - ARROW_SIZE) / 2;
const ARROW_TIP_Y = (41 / 256) * ARROW_SIZE + (BADGE_SIZE - ARROW_SIZE) / 2;

function getTextForElement(el) {
  if (!el) return "View";
  const tag = el.tagName?.toLowerCase();
  if (tag === "a") {
    const href = el.getAttribute("href") || "";
    if (href.includes("mailto:")) return "Mail";
    if (href.includes("tel:")) return "Call";
    const text = el.textContent?.trim();
    if (text && text.length <= 16) return text;
    return "Visit";
  }
  if (tag === "button") return "Click";
  return "View";
}

export default function MagneticCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const hoveredRef = useRef(false);
  const [labelText, setLabelText] = useState("View");
  const cursorRef = useRef(null);
  const quickX = useRef(null);
  const quickY = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = cursorRef.current;
    if (!el) return;

    document.documentElement.classList.add("no-native-cursor");
    gsap.set(el, { x: -9999, y: -9999 });
    quickX.current = gsap.quickTo(el, "x", {
      duration: 0.22,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(el, "y", {
      duration: 0.22,
      ease: "power3.out",
    });

    const onMove = (e) => {
      if (hoveredRef.current) {
        quickX.current(e.clientX - BADGE_SIZE / 2);
        quickY.current(e.clientY - BADGE_SIZE / 2);
      } else {
        quickX.current(e.clientX - ARROW_TIP_X);
        quickY.current(e.clientY - ARROW_TIP_Y);
      }
    };

    const onEnterInteractive = (e) => {
      const t = e.currentTarget;
      if (
        t.closest("[data-no-magnetic]") ||
        t.hasAttribute("data-no-magnetic")
      )
        return;

      const bounds = t.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;

      setLabelText(getTextForElement(t));
      setIsHovered(true);
      hoveredRef.current = true;

      const magnetize = (me) => {
        const dx = (me.clientX - cx) * 0.3;
        const dy = (me.clientY - cy) * 0.3;
        gsap.to(t, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
      };

      const onLeave = () => {
        setIsHovered(false);
        hoveredRef.current = false;
        gsap.to(t, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
        t.removeEventListener("mousemove", magnetize);
        t.removeEventListener("mouseleave", onLeave);
      };

      t.addEventListener("mousemove", magnetize);
      t.addEventListener("mouseleave", onLeave, { once: true });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const onInteractDown = () => {
      if (hoveredRef.current) {
        setIsHovered(false);
        hoveredRef.current = false;
      }
    };
    window.addEventListener("mousedown", onInteractDown, { passive: true });

    const onMouseLeave = () => {
      quickX.current(-9999);
      quickY.current(-9999);
    };
    const onMouseEnter = (e) => {
      quickX.current(e.clientX - ARROW_TIP_X);
      quickY.current(e.clientY - ARROW_TIP_Y);
    };
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const selectors = "a, button, [role='button']";
    let boundEls = new Set();
    const bind = () => {
      document.querySelectorAll(selectors).forEach((t) => {
        if (boundEls.has(t)) return;
        if (
          t.closest("[data-no-magnetic]") ||
          t.hasAttribute("data-no-magnetic")
        )
          return;
        t.addEventListener("mouseenter", onEnterInteractive);
        boundEls.add(t);
      });
    };
    bind();

    const observer = new MutationObserver(() => {
      // ponytail: only rebind new elements, don't re-iterate all
      requestAnimationFrame(bind);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.classList.remove("no-native-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onInteractDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      observer.disconnect();
      boundEls.forEach((t) => {
        t.removeEventListener("mouseenter", onEnterInteractive);
      });
      boundEls.clear();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex items-center justify-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      aria-hidden="true"
    >
      {/* Arrow — default state */}
      <div
        className="absolute"
        style={{
          width: ARROW_SIZE,
          height: ARROW_SIZE,
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? "scale(0)" : "scale(1)",
          transformOrigin: "center center",
          transition: "opacity 0.15s ease, transform 0.15s ease",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ARROW_SIZE}
          height={ARROW_SIZE}
          viewBox="0 0 256 256"
          style={{ display: "block" }}
        >
          <path
            d="M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z"
            fill="#fff"
          />
        </svg>
      </div>

      {/* Frosted glass badge — hover state with label text */}
      <div
        className="absolute"
        style={{
          height: BADGE_SIZE,
          borderRadius: BADGE_SIZE,
          background: "rgba(12, 12, 12, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1)" : "scale(0)",
          transformOrigin: "center center",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {labelText}
        </span>
      </div>
    </div>
  );
}