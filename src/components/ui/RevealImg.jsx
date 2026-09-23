"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-setup";
import useSectionAnimations from "@/hooks/useSectionAnimations";

export default function RevealImg({
  className = "",
  fill = false,
  sizes,
  priority = false,
  ...props
}) {
  const ref = useRef(null);

  useSectionAnimations(ref, () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const img = ref.current;
    if (!img) return;
    gsap.fromTo(
      img,
      { clipPath: "inset(100% 0 0 0)" },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          toggleActions: "play none reverse none",
          invalidateOnRefresh: true,
        },
      },
    );
  });

  return (
    <Image
      ref={ref}
      fill={fill}
      sizes={fill ? sizes : undefined}
      priority={priority}
      className={`gsap-reveal-img ${className}`}
      {...props}
    />
  );
}
