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

  useEffect(() => {
    initGtag();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Premium reveal: after preloader, animate main content in
  useGSAP(() => {
    if (!preloaderDone || !contentRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = contentRef.current.children;

    if (prefersReduced) {
      gsap.set(sections, { opacity: 1, y: 0 });
      return;
    }

    // Set initial hidden state
    gsap.set(sections, { opacity: 0, y: 30 });

    // Stagger reveal — premium feel
    gsap.to(sections, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "transform",
    });
  }, [preloaderDone, pathname]);

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");

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
      {!isAdmin && preloaderDone && <Navbar />}
      {!isAdmin && preloaderDone && <MagneticCursor />}
      {isAdmin ? (
        children
      ) : (
        <main ref={contentRef} id="main-content" style={{ opacity: 0 }}>
          {children}
        </main>
      )}
      {!isAdmin && preloaderDone && <Footer />}
    </>
  );
}
