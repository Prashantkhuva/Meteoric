"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-setup";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import MagneticCursor from "@/components/ui/MagneticCursor";
import { initGtag, trackPageView } from "@/lib/analytics/gtag";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const contentRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    initGtag();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Content stays visible immediately (overlay preloader fades over it) — this
  // avoids delaying LCP. Only the navbar reveals after the preloader completes.
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      if (navbarRef.current) gsap.set(navbarRef.current, { opacity: 1 });
      return;
    }

    if (!preloaderDone) {
      if (navbarRef.current) gsap.set(navbarRef.current, { opacity: 0 });
      return;
    }

    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "transform" },
      );
    }
  }, [preloaderDone, pathname]);

  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[#EAEFFF] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:outline-none focus:ring-2 focus:ring-black"
      >
        Skip to content
      </a>
      <Preloader onDone={() => setPreloaderDone(true)} />
      {!isAdmin && <SmoothScroll />}
      {!isAdmin && preloaderDone && (
        <div ref={navbarRef} style={{ opacity: 0 }} className="relative z-50">
          <Navbar />
        </div>
      )}
      {!isAdmin && preloaderDone && <MagneticCursor />}
      {isAdmin ? (
        children
      ) : (
        <main ref={contentRef} id="main-content">
          {children}
        </main>
      )}
      {!isAdmin && preloaderDone && <Footer />}
    </>
  );
}
