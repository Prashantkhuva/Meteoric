"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
      <p className="text-xs text-white/40 tabular-nums">
        {start}&ndash;{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
          className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 disabled:opacity-20 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={cn(
              "min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium tabular-nums transition-colors",
              page === current
                ? "bg-[#EAEFFF]/10 text-[#EAEFFF]"
                : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages}
          className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 disabled:opacity-20 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
