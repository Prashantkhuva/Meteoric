import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

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
    };
  }, []);

  return null;
}
