"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";

const DOT_SIZE = 12;
const LABEL_HEIGHT = 40;

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
  const prevRef = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothX = useSpring(mouseX, { stiffness: 600, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 600, damping: 35 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.style.cursor = "none";

    const onMove = (e) => {
      mouseX.set(e.clientX - DOT_SIZE / 2);
      mouseY.set(e.clientY - DOT_SIZE / 2);
      prevRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterInteractive = (e) => {
      const el = e.currentTarget;
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

    const selectors = "a, button, [role='button']";
    const bind = () => {
      document.querySelectorAll(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseenter", onEnterInteractive);
      });
    };
    bind();

    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      document.querySelectorAll(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
      });
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: smoothX,
        y: smoothY,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      className="hidden md:flex"
      aria-hidden="true"
    >
      {/* Dot — default state */}
      <motion.div
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          backgroundColor: "#EAEFFF",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Label pill — hover state */}
      <motion.div
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          height: LABEL_HEIGHT,
          borderRadius: LABEL_HEIGHT,
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          position: "absolute",
          top: (DOT_SIZE - LABEL_HEIGHT) / 2,
          left: 0,
          transformOrigin: "center center",
        }}
      >
        <span
          style={{
            color: "#EAEFFF",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
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
