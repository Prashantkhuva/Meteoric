"use client";

import { useEffect } from "react";

export function useShortcuts(shortcuts) {
  useEffect(() => {
    function handle(e) {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) return;
      const handler = shortcuts[e.key];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [shortcuts]);
}
