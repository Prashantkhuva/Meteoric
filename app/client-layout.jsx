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

  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/editor");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        Skip to content
      </a>
      {!isAdmin && <SmoothScroll />}
      {!isAdmin && <Navbar isHome={pathname === "/"} />}
      {isAdmin ? (
        children
      ) : (
        <main id="main-content" style={{ background: "var(--bg-primary)" }}>
          {children}
        </main>
      )}
      {!isAdmin && <Footer />}
    </>
  );
}
