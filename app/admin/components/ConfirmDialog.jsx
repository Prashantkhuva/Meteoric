"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, destructive, loading }) {
  const confirmRef = useRef(null);
  const dialogRef = useFocusTrap(open);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => confirmRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onCancel}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative w-full max-w-sm rounded-xl border border-white/[0.08] bg-[#121212] p-6 shadow-xl"
          >
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/30 hover:bg-white/[0.04] hover:text-white/50 transition-colors"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
            <h2 id="confirm-title" className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">{message}</p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-white/50 hover:bg-white/[0.03] hover:text-white/70 transition-colors"
              >
                Cancel
              </button>
              <button
                ref={confirmRef}
                onClick={onConfirm}
                disabled={loading}
                className={destructive
                  ? "rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  : "rounded-lg bg-[#EAEFFF] px-4 py-2 text-sm font-semibold text-[#121212] hover:bg-[#EAEFFF]/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                }
              >
                {loading ? "Deleting..." : confirmLabel || "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
