"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-setup";

const offset = { up: { y: 32 }, down: { y: -32 }, left: { x: 32 }, right: { x: -32 } };

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}) {
  const ref = useRef(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(ref.current,
      { ...offset[direction], opacity: 0 },
      {
        ...(direction === "left" || direction === "right" ? { x: 0 } : { y: 0 }),
        opacity: 1,
        duration,
        delay,
        ease: "power2.out",
        immediateRender: true,
        scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none reverse none", invalidateOnRefresh: true },
      },
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
