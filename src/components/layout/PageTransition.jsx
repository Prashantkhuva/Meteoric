"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

// Premium route enter: soft rise + settle, keyed by pathname so every
// navigation re-runs the motion. Exit is skipped (App Router unmounts
// the outgoing page immediately) — enter carries the polish.
const EASE = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return children;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 40, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
