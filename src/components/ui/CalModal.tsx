"use client";

import { lazy, Suspense, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import { registerCalModal } from "@/components/ui/cal-modal-store";

const Cal = lazy(() => import("@calcom/embed-react"));

const CAL_LINK = "prashantkhuva/let-s-build";
const CAL_NAMESPACE = "let-s-build";

const isNarrow = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

export default function CalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => registerCalModal(() => setIsOpen(true)), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getCalApi } = await import("@calcom/embed-react");
        const cal = await getCalApi({ namespace: CAL_NAMESPACE });
        if (!cancelled)
          cal("ui", {
            hideEventTypeDetails: true,
            ...(isNarrow() ? {} : { layout: "column_view" }),
            theme: "dark",
          });
      } catch {
        return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book a call"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="cal-modal-shell flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#151515] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] md:h-[80vh]"
          >
            <div className="flex h-[88px] shrink-0 items-center justify-between bg-white px-6">
              <span className="text-xl font-bold tracking-tight text-black">
                Let&apos;s Build!
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close booking modal"
                className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative flex min-h-0 max-h-full flex-1 flex-col items-stretch overflow-y-auto">
              <style>{`.cal-modal-shell .cal-inline-container iframe{height:100% !important;}`}</style>
              <Suspense fallback={null}>
                <Cal
                  namespace={CAL_NAMESPACE}
                  calLink={CAL_LINK}
                  style={{ width: "100%", height: "100%", overflow: "hidden" }}
                  config={{
                    theme: "dark",
                    ...(isNarrow() ? {} : { layout: "column_view" }),
                  }}
                />
              </Suspense>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
