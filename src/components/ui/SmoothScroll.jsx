import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    function handleAnchorClick(event) {
      const link = event.target.closest('a[href^="#"]');

      if (!link) return;

      const hash = link.getAttribute("href");
      const target = hash === "#" ? document.body : document.querySelector(hash);

      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target);
      window.history.pushState(null, "", hash);
    }

    let frameId;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    document.addEventListener("click", handleAnchorClick);
    frameId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const scrollTarget = hash
      ? document.querySelector(hash)
      : 0;

    const timeoutId = window.setTimeout(() => {
      lenisRef.current?.scrollTo(scrollTarget || 0, { immediate: !hash });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
