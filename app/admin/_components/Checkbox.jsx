"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Checkbox({ checked, onChange, label, id, className = "" }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      onClick={onChange}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange?.(); } }}
      className={`group relative flex items-center justify-center w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-[5px] border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#EAEFFF]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-black ${checked ? "border-[#EAEFFF] bg-[#EAEFFF]" : "border-white/15 bg-transparent hover:border-white/30"} ${className}`}
      aria-label={label || "Select"}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 rounded-[5px] transition-opacity duration-300 ${checked ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`} style={{ boxShadow: "inset 0 0 12px rgba(234,239,255,0.06)" }} />

      {checked && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22, mass: 0.4 }}
        >
          <Check size={12} className="text-[#121212]" strokeWidth={2.5} />
        </motion.span>
      )}
    </button>
  );
}
