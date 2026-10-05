"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";
import { revealFrom, revealTo, clearRevealClip } from "@/lib/scroll-reveal";

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  ...props
}) {
  const ref = useRef(null);

  useSectionAnimations(ref, () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ref.current,
      revealFrom(direction),
      {
        ...revealTo,
        duration,
        delay,
        ease: "power3.out",
        immediateRender: true,
        onComplete: () => clearRevealClip(ref.current),
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none reverse none",
          invalidateOnRefresh: true,
        },
      },
    );
  });

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
