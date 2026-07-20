"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";

const ARROW_SIZE = 22;
const BADGE_SIZE = 64;

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
  const [labelText, setLabelText] = useState("View");
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const smoothX = useSpring(mouseX, { stiffness: 500, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 500, damping: 35 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("no-native-cursor");

    const onMove = (e) => {
      mouseX.set(e.clientX - BADGE_SIZE / 2);
      mouseY.set(e.clientY - BADGE_SIZE / 2);
    };

      const onEnterInteractive = (e) => {
        const el = e.currentTarget;
        const isNoMagnetic = el.closest("[data-no-magnetic]") || el.hasAttribute("data-no-magnetic");

        if (isNoMagnetic) return;

        const bounds = el.getBoundingClientRect();
        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;

        setLabelText(getTextForElement(el));
        setIsHovered(true);

        const magnetize = (me) => {
          const dx = (me.clientX - cx) * 0.3;
          const dy = (me.clientY - cy) * 0.3;
          gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
        };

        const onLeave = () => {
          setIsHovered(false);
          gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
          el.removeEventListener("mousemove", magnetize);
          el.removeEventListener("mouseleave", onLeave);
        };

        el.addEventListener("mousemove", magnetize);
        el.addEventListener("mouseleave", onLeave, { once: true });
      };

    window.addEventListener("mousemove", onMove, { passive: true });

    const onMouseLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
      smoothX.jump(-9999);
      smoothY.jump(-9999);
    };
    const onMouseEnter = (e) => {
      smoothX.jump(e.clientX - BADGE_SIZE / 2);
      smoothY.jump(e.clientY - BADGE_SIZE / 2);
      mouseX.set(e.clientX - BADGE_SIZE / 2);
      mouseY.set(e.clientY - BADGE_SIZE / 2);
    };
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const selectors = "a, button, [role='button']";
    const bind = () => {
      document.querySelectorAll(selectors).forEach((el) => {
        if (el.closest("[data-no-magnetic]") || el.hasAttribute("data-no-magnetic")) return;
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseenter", onEnterInteractive);
      });
    };
    bind();

    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.classList.remove("no-native-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      observer.disconnect();
      document.querySelectorAll(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
      });
    };
  }, [mouseX, mouseY]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: smoothX,
        y: smoothY,
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      className="hidden md:flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Arrow — default state */}
      <motion.div
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "absolute",
          width: ARROW_SIZE,
          height: ARROW_SIZE,
          transformOrigin: "center center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ARROW_SIZE}
          height={ARROW_SIZE}
          viewBox="0 0 256 256"
          style={{ display: "block", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}
        >
          <path d="M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z" fill="#fff" />
        </svg>
      </motion.div>

      {/* Frosted glass badge — hover state with label text */}
      <motion.div
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          position: "absolute",
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
          transformOrigin: "center center",
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
      </motion.div>
    </motion.div>
  );
}
