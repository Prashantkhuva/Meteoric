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

    // ponytail: dynamic import avoids SSR crash — gsap + ScrollTrigger only exist in browser
    let cleanupScrollTrigger = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 1.5,
          infinite: false,
        });
        lenisRef.current = lenis;

        // Wire Lenis ↔ ScrollTrigger so pin/scrub work with smooth scroll
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        function handleAnchorClick(event) {
          const link = event.target.closest('a[href*="#"]');
          if (!link) return;
          const raw = link.getAttribute("href");
          const hashIndex = raw.indexOf("#");
          const hash = raw.slice(hashIndex);
          const linkPath = raw.slice(0, hashIndex) || "/";
          if (linkPath !== window.location.pathname) return;
          const target =
            hash === "#" ? document.body : document.querySelector(hash);
          if (!target) return;
          event.preventDefault();
          lenis.scrollTo(target);
          window.history.replaceState(null, "", raw);
        }

        document.addEventListener("click", handleAnchorClick);

        cleanupScrollTrigger = () => {
          document.removeEventListener("click", handleAnchorClick);
          lenis.destroy();
          lenisRef.current = null;
        };
      },
    );

    return () => {
      cleanupScrollTrigger();
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
