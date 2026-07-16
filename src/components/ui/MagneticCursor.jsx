"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";

const ARROW_SIZE = 28;
const BADGE_SIZE = 80;

function getTextForElement(el) {
  if (!el) return "Visit";
  const tag = el.tagName?.toLowerCase();
  if (tag === "a") {
    const text = el.textContent?.trim();
    if (text && text.length <= 20) return text;
    return "Visit";
  }
  if (tag === "button") return "Click";
  return "View";
}

export default function MagneticCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [badgeText, setBadgeText] = useState("Visit");
  const [angle, setAngle] = useState(0);
  const prevRef = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothX = useSpring(mouseX, { stiffness: 500, damping: 40 });
  const smoothY = useSpring(mouseY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.style.cursor = "none";

    const onMove = (e) => {
      mouseX.set(e.clientX - BADGE_SIZE / 2);
      mouseY.set(e.clientY - BADGE_SIZE / 2);

      const dx = e.clientX - prevRef.current.x;
      const dy = e.clientY - prevRef.current.y;
      if (dx !== 0 || dy !== 0) {
        setAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 120);
      }
      prevRef.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterInteractive = (e) => {
      const el = e.currentTarget;
      const bounds = el.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;

      setBadgeText(getTextForElement(el));
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
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="hidden md:flex"
      aria-hidden="true"
    >
      {/* Arrow — visible when NOT hovering */}
      <motion.div
        animate={{
          rotate: angle,
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
          fill="#EAEFFF"
          style={{ display: "block" }}
        >
          <path d="M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z" />
        </svg>
      </motion.div>

      {/* Frosted glass badge — visible WHEN hovering */}
      <motion.div
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          position: "absolute",
          width: BADGE_SIZE,
          height: BADGE_SIZE,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#EAEFFF",
          fontSize: "10px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {badgeText}
      </motion.div>
    </motion.div>
  );
}
