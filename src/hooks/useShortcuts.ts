"use client";

import { useEffect, useRef } from "react";

const MODIFIERS: Record<string, (e: KeyboardEvent) => boolean> = {
  ctrl: (e) => e.ctrlKey,
  cmd: (e) => e.metaKey,
  mod: (e) => e.metaKey || e.ctrlKey,
  alt: (e) => e.altKey,
  shift: (e) => e.shiftKey,
};

function parseBinding(binding: string) {
  const parts = binding.split("+");
  const modifiers: string[] = [];
  let key: string | null = null;
  parts.forEach((part) => {
    const name = part.trim().toLowerCase();
    if (MODIFIERS[name]) modifiers.push(name);
    else key = name;
  });
  return { modifiers, key };
}

function matches(e: KeyboardEvent, binding: string) {
  const { modifiers, key } = parseBinding(binding);
  if (key && e.key.toLowerCase() !== key) return false;
  if (!modifiers.length && (e.ctrlKey || e.metaKey || e.altKey)) return false;
  return modifiers.every((m) => MODIFIERS[m](e));
}

function isFormField(target: EventTarget | null) {
  const el = target as HTMLElement;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export function useShortcuts(shortcuts: Record<string, (e: KeyboardEvent) => void>) {
  const shortcutsRef = useRef(shortcuts);
  const seqRef = useRef<{
    prefix: string;
    secondKey: string;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (isFormField(e.target)) return;

      const bindings = Object.keys(shortcutsRef.current);

      if (seqRef.current) {
        const [, secondKey] = seqRef.current as unknown as [string, string];
        clearTimeout(seqRef.current.timer);
        seqRef.current = null;
        if (matches(e, secondKey)) {
          e.preventDefault();
          shortcutsRef.current[`g ${secondKey}`]?.(e);
          return;
        }
      }

      for (const binding of bindings) {
        if (binding.includes(" ")) continue;
        if (matches(e, binding)) {
          e.preventDefault();
          shortcutsRef.current[binding](e);
          return;
        }
      }

      const prefix = bindings.find(
        (b) => b.includes(" ") && b.split(" ")[0] === e.key.toLowerCase()
      );
      if (prefix) {
        e.preventDefault();
        seqRef.current = {
          prefix,
          secondKey: prefix.split(" ")[1],
          timer: setTimeout(() => { seqRef.current = null; }, 800),
        };
      }
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
}