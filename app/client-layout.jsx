"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import MagneticCursor from "@/components/ui/MagneticCursor";
import { initGtag, trackPageView } from "@/lib/analytics/gtag";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    initGtag();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

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
      {!isAdmin && <Navbar />}
      {!isAdmin && preloaderDone && <MagneticCursor />}
      {isAdmin ? children : <main id="main-content">{children}</main>}
      {!isAdmin && <Footer />}
    </>
  );
}
