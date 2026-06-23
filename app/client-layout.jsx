"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { initGtag, trackPageView } from "@/lib/analytics/gtag";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    initGtag();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/login");

  return (
    <>
      <SmoothScroll />
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
