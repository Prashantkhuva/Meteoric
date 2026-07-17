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
      <Preloader onDone={() => setPreloaderDone(true)} />
      {!isAdmin && <SmoothScroll />}
      {!isAdmin && <Navbar />}
      {!isAdmin && preloaderDone && <MagneticCursor />}
      {isAdmin ? children : <main>{children}</main>}
      {!isAdmin && <Footer />}
    </>
  );
}
