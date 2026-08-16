"use client";

import * as Select from "@radix-ui/react-select";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toolbar({ search, onSearchChange, children, resultCount, searchRef }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          ref={searchRef}
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
      <div className="flex items-center gap-2 overflow-x-auto flex-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1">
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
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap select-none outline-none transition-all duration-200",
        "focus-visible:ring-1 focus-visible:ring-[#EAEFFF]/40",
        active
          ? "border-[#EAEFFF]/35 bg-[#EAEFFF]/10 text-[#EAEFFF] shadow-[0_0_20px_-4px_rgba(234,239,255,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "border-white/[0.07] bg-white/[0.02] text-white/45 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white/75 active:scale-[0.97]"
      )}
    >
      {active && (
        <span className="h-1 w-1 shrink-0 rounded-full bg-[#EAEFFF] shadow-[0_0_6px_rgba(234,239,255,0.9)]" />
      )}
      {children}
    </button>
  );
}

export function SortDropdown({ value, onChange, options, label }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap outline-none transition-all duration-200",
          "focus-visible:ring-1 focus-visible:ring-[#EAEFFF]/40 active:scale-[0.97]",
          "data-[state=open]:border-[#EAEFFF]/35 data-[state=open]:bg-[#EAEFFF]/10 data-[state=open]:text-[#EAEFFF] data-[state=open]:shadow-[0_0_20px_-4px_rgba(234,239,255,0.25)]",
          "border-white/[0.07] bg-white/[0.02] text-white/45 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white/75"
        )}
        aria-label={label}
      >
        <Select.Value placeholder={label} className="max-w-[220px] truncate" />
        <Select.Icon>
          <ChevronDown
            size={12}
            className="shrink-0 transition-transform duration-200 text-white/30 data-[state=open]:rotate-180 data-[state=open]:text-[#EAEFFF]"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          align="end"
          className="z-[9999] max-h-[300px] min-w-[170px] overflow-hidden rounded-xl border border-white/[0.09] bg-[#0b0b0b]/95 py-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md"
        >
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-xs whitespace-nowrap transition-colors outline-none",
                  "data-[state=checked]:text-[#EAEFFF] data-[state=checked]:bg-[#EAEFFF]/[0.06]",
                  "text-white/45 data-[highlighted]:bg-white/[0.03] data-[highlighted]:text-white/75"
                )}
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                {opt.value === value && <Check size={12} className="shrink-0 text-[#EAEFFF]" />}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function ClearFiltersButton({ onClick, visible }) {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      className="h-8 shrink-0 rounded-full px-2.5 text-xs text-white/30 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
    >
      Clear filters
    </button>
  );
}
