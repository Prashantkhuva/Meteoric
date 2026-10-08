import { useRef, useCallback } from "react";
import gsap from "gsap";

export function useCardTilt(intensity = 1) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef<DOMRect | null | undefined>(null);

  const onMouseEnter = useCallback(() => {
    boundsRef.current = cardRef.current?.getBoundingClientRect();
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || !boundsRef.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = boundsRef.current;
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      gsap.to(cardRef.current, {
        rotateX: -y * 12 * intensity,
        rotateY: x * 12 * intensity,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    [intensity],
  );

  const onMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
    boundsRef.current = null;
  }, []);

  return { cardRef, onMouseEnter, onMouseMouseMove: onMouseMove, onMouseLeave };
}
