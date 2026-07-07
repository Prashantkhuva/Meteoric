"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <h2 className="text-sm font-semibold text-white tracking-tight leading-snug">
                {faq.q}
              </h2>
              <span
                className={`shrink-0 w-6 h-6 rounded-full border border-white/[0.08] flex items-center justify-center transition-all duration-300 ${
                  isOpen ? "bg-white/[0.06] border-white/[0.15]" : ""
                }`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  <line x1="5" y1="0" x2="5" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="5" x2="10" y2="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5">
                    <div className="w-full h-px bg-white/[0.04] mb-4" />
                    {faq.a_html ? (
                      <p
                        className="text-white/45 text-sm leading-relaxed [&_a]:text-white/60 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-white"
                        dangerouslySetInnerHTML={{ __html: faq.a_html }}
                      />
                    ) : (
                      <p className="text-white/45 text-sm leading-relaxed">{faq.a}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
