"use client";

import type { ComponentType, MouseEventHandler } from "react";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon: ComponentType<{ size?: number | string }>;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function IconButton({ onClick, icon: Icon, label, className, disabled }: IconButtonProps) {
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
