"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import SmoothScroll from "@/Components/ui/SmoothScroll";
import { initGtag, trackPageView } from "@/analytics/gtag";

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
