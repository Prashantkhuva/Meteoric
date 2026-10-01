"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { consumeCurtainNav } from "@/lib/curtain-nav";

// Premium route enter: soft rise + settle, keyed to pathname so every
// navigation re-runs the motion. Skipped when RouteCurtain handled the
// nav (double motion under the overlay). Exit is skipped (App Router
// unmounts the outgoing page immediately) — enter carries the polish.
// First load renders plain children (SSR + hydration match): wrapping
// the initial paint in opacity:0 would hide SEO text until JS hydrates,
// and the enter would play under the preloader anyway. The wrapper only
// kicks in after the first client-side navigation.
const EASE = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [skip] = useState(() => consumeCurtainNav());
  const [seen, setSeen] = useState({ path: pathname, navigated: false });

  if (seen.path !== pathname) {
    setSeen({ path: pathname, navigated: true });
  }

  if (reduce || skip || !seen.navigated) return children;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
