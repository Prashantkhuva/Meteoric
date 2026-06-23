"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
        aria-live="polite"
        aria-relevant="additions removals"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 pr-3 shadow-lg backdrop-blur-sm min-w-[280px] max-w-sm",
        isError
          ? "border-red-500/20 bg-red-500/10 text-red-400"
          : isInfo
          ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      )}
      role="status"
    >
      {isError ? (
        <AlertCircle size={18} className="shrink-0" />
      ) : isInfo ? (
        <Info size={18} className="shrink-0" />
      ) : (
        <CheckCircle2 size={18} className="shrink-0" />
      )}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity hover:bg-white/[0.06]"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
