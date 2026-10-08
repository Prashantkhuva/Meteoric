"use client";

import { useEffect, useRef } from "react";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";

export function useFocusTrap(open?: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (previousFocusRef.current?.focus) {
        previousFocusRef.current.focus();
      }
      unlockScroll();
      return;
    }
    const el = ref.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    }

    el.addEventListener("keydown", handleKey);
    first?.focus();
    lockScroll();

    return () => {
      el.removeEventListener("keydown", handleKey);
      unlockScroll();
    };
  }, [open]);

  return ref;
}
