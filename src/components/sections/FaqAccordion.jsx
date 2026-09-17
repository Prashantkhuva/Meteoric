"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-2.5">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`group rounded-xl border transition-all duration-400 ${
              isOpen
                ? "bg-gradient-to-b from-white/[0.03] to-transparent"
                : "bg-white/[0.02]"
            }`}
            style={{
              borderColor: isOpen ? "var(--border-hover)" : "var(--border-color)",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-4 text-left"
            >
              <span
                className="text-sm pr-4 leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {faq.question}
              </span>
              <span
                className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center"
                style={{
                  borderColor: isOpen ? "var(--accent-dim)" : "var(--border-color)",
                  background: isOpen ? "var(--accent-glow)" : "transparent",
                  color: isOpen ? "var(--accent)" : "var(--text-muted)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                <Plus size={12} />
              </span>
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p
                  className="text-sm leading-relaxed px-5 md:px-6 pb-5 pt-1 max-w-2xl"
                  style={{
                    color: "var(--text-secondary)",
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.05s",
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
