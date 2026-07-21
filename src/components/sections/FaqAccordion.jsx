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
            className={`group rounded-xl border transition-all duration-300 ${
              isOpen
                ? "border-white/[0.12] bg-gradient-to-b from-white/[0.03] to-transparent"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-label={isOpen ? `Collapse: ${faq.q}` : `Expand: ${faq.q}`}
              className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-4 text-left"
            >
              <span className="text-white/80 text-sm pr-4 leading-relaxed">
                {faq.q}
              </span>
              <span
                className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? "border-[#EAEFFF]/20 bg-[#EAEFFF]/10 text-[#EAEFFF] rotate-45"
                    : "border-white/10 text-white/30 group-hover:border-white/20"
                }`}
              >
                <Plus size={12} />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="text-white/50 text-sm leading-relaxed px-5 md:px-6 pb-5 pt-1 max-w-2xl">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
