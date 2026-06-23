"use client";

export function IconButton({ onClick, icon: Icon, label, className, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/50 disabled:opacity-30 disabled:pointer-events-none ${className || ""}`}
      aria-label={label}
      title={label}
    >
      <Icon size={14} />
    </button>
  );
}
