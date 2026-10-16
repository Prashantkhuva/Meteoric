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

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const first = el.querySelector<HTMLElement>(focusableSelector);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      // re-query each time: content can change while the trap is open
      const items = el.querySelectorAll<HTMLElement>(focusableSelector);
      const f = items[0];
      const l = items[items.length - 1];
      if (!f || !l) return;
      if (e.shiftKey) {
        if (document.activeElement === f) {
          e.preventDefault();
          l.focus();
        }
      } else if (document.activeElement === l) {
        e.preventDefault();
        f.focus();
      }
    };

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
