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
              role="progressbar"
              aria-valuenow={isCompleted ? 100 : isActive ? 50 : 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Step ${s}: ${isCompleted ? "completed" : isActive ? "in progress" : "not started"}`}
              className={`relative w-11 h-11 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300
              ${
                isActive
                  ? "bg-white text-black scale-[1.06] shadow-[0_0_20px_rgba(234,239,255,0.22)]"
                  : isCompleted
                    ? "bg-white text-black"
                    : "bg-[#141414] text-white/40 border border-[#EAEFFF]/10"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse motion-reduce:animate-none" />
              )}

              {isCompleted ? <Check size={16} /> : s}
            </div>

            {/* LINE */}
            {i !== 2 && (
              <div className="relative mx-4">
                {/* base line */}
                <div className="w-10 sm:w-16 h-0.5 bg-[#EAEFFF]/10" />

                {/* progress line */}
                <div
                  className={`absolute top-0 left-0 h-0.5 bg-white transition-all duration-500
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
