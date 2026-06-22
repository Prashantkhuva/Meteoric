"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";

export function BulkActionBar({ selectedCount, onClear, onDelete, onStatusChange, statusOptions }) {
  const [status, setStatus] = useState("");

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#0a0a0a] px-4 py-3 md:px-6 flex items-center justify-between shadow-2xl">
      <span className="text-sm text-white/50">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          <X size={12} className="inline mr-1" />
          Clear
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={12} className="inline mr-1" />
            Delete
          </button>
        )}
        {onStatusChange && statusOptions && (
          <select
            value={status}
            onChange={(e) => { onStatusChange(e.target.value); setStatus(""); }}
            className="rounded-lg border border-white/[0.08] bg-black/60 px-3 py-1.5 text-xs text-white/60 outline-none"
            style={{ colorScheme: "dark" }}
          >
            <option value="">Change status...</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
