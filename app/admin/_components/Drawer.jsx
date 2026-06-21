"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

export function Drawer({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l border-white/[0.06] bg-[#0a0a0a] shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-6 py-4">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 transition-colors"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
