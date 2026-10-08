"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname]);

  return null;
}