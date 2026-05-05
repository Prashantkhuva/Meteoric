import React from "react";
import { Check } from "lucide-react";

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3].map((s, i) => {
        const isActive = step === s;
        const isCompleted = step > s;

        return (
          <div key={s} className="flex items-center">
            {/* STEP */}
            <div
              className={`relative w-11 h-11 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300
              ${
                isActive
                  ? "bg-white text-black scale-110 shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                  : isCompleted
                    ? "bg-white text-black"
                    : "bg-[#141414] text-white/40 border border-[#252525]"
              }`}
            >
              {/* GLOW RING (only active) */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse" />
              )}

              {isCompleted ? <Check size={16} /> : s}
            </div>

            {/* LINE */}
            {i !== 2 && (
              <div className="relative mx-4">
                {/* base line */}
                <div className="w-16 h-[2px] bg-[#252525]" />

                {/* progress line */}
                <div
                  className={`absolute top-0 left-0 h-[2px] bg-white transition-all duration-500
                  ${step > s ? "w-full" : "w-0"}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;