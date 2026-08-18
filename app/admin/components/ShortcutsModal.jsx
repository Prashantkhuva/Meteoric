"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X, Keyboard } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const GROUPS = [
  {
    title: "Global navigation",
    shortcuts: [
      { keys: "g d", label: "Dashboard" },
      { keys: "g l", label: "Leads" },
      { keys: "g c", label: "Clients" },
      { keys: "g r", label: "Reviews" },
      { keys: "g p", label: "Proposals" },
      { keys: "g i", label: "Invoices" },
      { keys: "g b", label: "Bank accounts" },
      { keys: "g j", label: "Projects" },
      { keys: "g k", label: "Bookings" },
      { keys: "g m", label: "Compose email" },
      { keys: "g s", label: "Sent emails" },
      { keys: "g e", label: "Settings" },
    ],
  },
  {
    title: "List pages",
    shortcuts: [
      { keys: "n", label: "Create new item" },
      { keys: "/", label: "Focus search" },
      { keys: "Esc", label: "Close dialogs / drawers" },
    ],
  },
  {
    title: "Confirm dialogs",
    shortcuts: [
      { keys: "Enter", label: "Confirm action" },
      { keys: "Esc", label: "Cancel" },
    ],
  },
  {
    title: "Compose email",
    shortcuts: [
      { keys: "Ctrl / ⌘ + Enter", label: "Send email" },
    ],
  },
];

function Kbd({ children }) {
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-white/75">
      {children}
    </kbd>
  );
}

export function ShortcutsModal({ open, onClose }) {
  const trapRef = useFocusTrap(open);

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-xl border border-white/[0.08] bg-[#121212] p-6 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/30 hover:bg-white/[0.04] hover:text-white/50 transition-colors"
              aria-label="Close shortcuts"
            >
              <X size={16} />
            </button>
            <h2 id="shortcuts-title" className="flex items-center gap-2 text-lg font-semibold text-white">
              <Keyboard size={17} className="text-[#EAEFFF]/70" />
              Keyboard shortcuts
            </h2>
            <p className="mt-1 text-xs text-white/40">Press <Kbd>?</Kbd> anywhere to toggle this panel</p>

            <div className="mt-5 space-y-5">
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25 mb-2">
                    {group.title}
                  </p>
                  <div className="space-y-1.5">
                    {group.shortcuts.map((s) => (
                      <div key={s.keys} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-white/60">{s.label}</span>
                        <span className="flex items-center gap-1">
                          {s.keys.split(" ").map((part, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {i > 0 && <span className="text-white/25 text-xs">then</span>}
                              <Kbd>{part}</Kbd>
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}