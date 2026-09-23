"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap-setup";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import Logo from "@/components/sections/Logo";

const EASE_COVER = "power4.inOut";
const EASE_OPEN = "expo.out";
const OPEN_CLIP = "inset(0% 0% 100% 0%)";
const COVERED_CLIP = "inset(0% 0% 0% 0%)";

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function internalPath(href) {
  if (!href) return null;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (url.hash && url.pathname === window.location.pathname) return null;
    return url.pathname + url.search;
  } catch {
    return null;
  }
}

function shouldSkip(anchor) {
  if (!anchor || anchor.target === "_blank") return true;
  if (anchor.hasAttribute("download")) return true;
  if (anchor.hasAttribute("data-no-curtain")) return true;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return true;
  }
  const path = internalPath(href);
  if (!path) return true;
  return path === window.location.pathname + window.location.search;
}

export default function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const glowRef = useRef(null);
  const logoMaskRef = useRef(null);
  const logoInnerRef = useRef(null);
  const hairlineRef = useRef(null);
  const busy = useRef(false);
  const expecting = useRef(null);
  const firstPath = useRef(true);
  const covered = useRef(false);
  const locked = useRef(false);

  const lockHere = () => {
    if (!locked.current) {
      lockScroll();
      locked.current = true;
    }
  };
  const unlockHere = () => {
    if (locked.current) {
      unlockScroll();
      locked.current = false;
    }
  };

  const reveal = useCallback((duration = 0.7) => {
    const overlay = overlayRef.current;
    if (!overlay) return Promise.resolve();
    covered.current = false;

    if (prefersReduced()) {
      gsap.set(overlay, { clipPath: OPEN_CLIP, pointerEvents: "none" });
      unlockHere();
      return Promise.resolve();
    }

    lockHere();

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { overwrite: false },
        onComplete: () => {
          gsap.set(overlay, { pointerEvents: "none" });
          gsap.set(logoInnerRef.current, { yPercent: 130 });
          gsap.set(hairlineRef.current, { opacity: 1, scaleX: 1 });
          gsap.set(glowRef.current, { opacity: 0 });
          unlockHere();
          resolve();
        },
      });

      tl.to(
        logoInnerRef.current,
        {
          yPercent: -130,
          duration: duration * 0.85,
          ease: "power3.inOut",
          overwrite: "auto",
        },
        0,
      );
      tl.to(
        hairlineRef.current,
        {
          opacity: 0,
          scaleX: 0.4,
          duration: duration * 0.55,
          ease: "power2.inOut",
        },
        0.05,
      );
      tl.to(glowRef.current, { opacity: 0, duration: duration * 0.7 }, 0);
      tl.to(
        overlay,
        { clipPath: OPEN_CLIP, duration, ease: EASE_OPEN, overwrite: "auto" },
        "-=0.35",
      );
    });
  }, []);

  const cover = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return Promise.resolve();

    if (prefersReduced()) {
      gsap.set(overlay, { clipPath: COVERED_CLIP, pointerEvents: "auto" });
      covered.current = true;
      return Promise.resolve();
    }

    lockHere();
    covered.current = true;
    gsap.set(overlay, { pointerEvents: "auto", clipPath: OPEN_CLIP });
    gsap.set(logoInnerRef.current, { yPercent: 130, y: 0, force3D: true });
    gsap.set(hairlineRef.current, { opacity: 1, scaleX: 0.35 });
    gsap.set(glowRef.current, {
      opacity: 0,
      scale: 0.85,
      xPercent: -50,
      yPercent: -50,
    });

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { overwrite: false },
        onComplete: resolve,
      });

      tl.to(
        overlay,
        { clipPath: COVERED_CLIP, duration: 0.48, ease: EASE_COVER, overwrite: "auto" },
        0,
      );
      tl.to(
        glowRef.current,
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
        0.12,
      );
      tl.fromTo(
        logoInnerRef.current,
        { yPercent: 130 },
        { yPercent: 0, duration: 0.55, ease: EASE_OPEN, overwrite: "auto" },
        0.18,
      );
      tl.to(
        hairlineRef.current,
        { scaleX: 1, duration: 0.5, ease: EASE_OPEN },
        0.22,
      );
    });
  }, []);

  // Initial open state (hidden curtain)
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.set(overlay, { clipPath: OPEN_CLIP, pointerEvents: "none" });
    gsap.set(logoInnerRef.current, { yPercent: 130 });
    gsap.set(glowRef.current, { opacity: 0 });
  }, []);

  // Pathname change → open curtain if we were covering / waiting
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (expecting.current !== null) {
      const delay = expecting.current;
      expecting.current = null;
      busy.current = true;
      const t = setTimeout(() => {
        reveal(0.72).then(() => {
          busy.current = false;
        });
      }, delay);
      return () => clearTimeout(t);
    }
    // unexpected path change while covered (safety net)
    if (covered.current && !busy.current) {
      reveal(0.65);
    }
  }, [pathname, reveal]);

  // Intercept internal navigations
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (busy.current) return;
      if (prefersReduced()) return;

      const anchor = event.target.closest?.("a");
      if (!anchor) return;
      if (shouldSkip(anchor)) return;

      const href = anchor.getAttribute("href");
      const path = internalPath(href);
      if (!path) return;

      event.preventDefault();
      busy.current = true;

      cover().then(() => {
        expecting.current = 280;
        const to = path;
        const now = window.location.pathname + window.location.search;
        if (to === now) {
          // same path (hash-only already filtered) — just open
          expecting.current = null;
          reveal(0.7).then(() => {
            busy.current = false;
          });
          return;
        }
        router.push(href, { scroll: true });
        // safety: if pathname never changes, open anyway
        setTimeout(() => {
          if (expecting.current !== null) {
            expecting.current = null;
            reveal(0.7).then(() => {
              busy.current = false;
            });
          }
        }, 3000);
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [cover, reveal, router]);

  // Back/forward: only ensure we don't stick closed if curtain was covering
  useEffect(() => {
    const onPop = () => {
      if (busy.current || prefersReduced()) return;
      if (!covered.current) return;
      busy.current = true;
      reveal(0.65).then(() => {
        busy.current = false;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [reveal]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const glow = glowRef.current;
    const logoInner = logoInnerRef.current;
    const hairline = hairlineRef.current;
    return () => {
      unlockHere();
      gsap.killTweensOf([overlay, glow, logoInner, hairline]);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9980] overflow-hidden"
      style={{
        background: "#050505",
        clipPath: OPEN_CLIP,
        pointerEvents: "none",
        willChange: "clip-path",
      }}
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,640px)] w-[min(90vw,640px)] rounded-full blur-[140px]"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.85)",
          background:
            "radial-gradient(circle, rgba(234,239,255,0.07) 0%, rgba(234,239,255,0.02) 40%, transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6">
        <div ref={logoMaskRef} className="overflow-hidden py-1">
          <div ref={logoInnerRef} className="will-change-transform">
            <Logo light={false} className="h-7 w-auto md:h-9" />
          </div>
        </div>

        <div
          ref={hairlineRef}
          className="h-px w-[min(60vw,240px)] origin-center"
          style={{
            opacity: 1,
            background:
              "linear-gradient(90deg, rgba(234,239,255,0.1), rgba(234,239,255,0.85), rgba(234,239,255,0.1))",
          }}
        />
      </div>
    </div>
  );
}
