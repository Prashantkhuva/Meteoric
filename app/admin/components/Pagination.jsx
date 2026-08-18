"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ current, total, pageSize, onChange, loading = false }) {
  const totalPages = Math.ceil(total / pageSize);

  const pages = useMemo(() => {
    const items = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
        items.push(i);
      } else if (items[items.length - 1] !== "...") {
        items.push("...");
      }
    }
    return items;
  }, [totalPages, current]);

  if (totalPages <= 1) return null;

  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
      <p className="flex items-center gap-2 text-xs text-white/40 tabular-nums">
        {start}&ndash;{end} of {total}
        {loading && (
          <Loader2 size={12} className="animate-spin text-[#EAEFFF]/60" aria-hidden="true" />
        )}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current <= 1 || loading}
          className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 disabled:opacity-20 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="min-w-[32px] px-2 py-1 text-xs text-white/20 text-center">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page)}
              disabled={loading}
              aria-current={page === current ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={cn(
                "min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium tabular-nums transition-colors",
                page === current
                  ? "bg-[#EAEFFF]/10 text-[#EAEFFF]"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]",
                loading && "opacity-30 pointer-events-none"
              )}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages || loading}
          className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 disabled:opacity-20 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}