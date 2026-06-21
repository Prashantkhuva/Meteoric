"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toolbar({ search, onSearchChange, children, resultCount }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] pl-9 pr-8 py-2 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#EAEFFF]/30 focus:bg-[#121212]"
          aria-label="Search"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/20 hover:text-white/50 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {children}
      </div>
      {resultCount !== undefined && (
        <p className="text-xs text-white/40 tabular-nums sm:ml-auto">{resultCount} result{resultCount !== 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

export function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-[#EAEFFF]/30 bg-[#EAEFFF]/8 text-[#EAEFFF]"
          : "border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/60"
      )}
    >
      {children}
    </button>
  );
}

export function ClearFiltersButton({ onClick, visible }) {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      className="text-xs text-white/30 hover:text-white/60 transition-colors"
    >
      Clear filters
    </button>
  );
}
