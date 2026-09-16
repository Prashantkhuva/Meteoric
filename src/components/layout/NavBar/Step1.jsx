import { motion } from "framer-motion";
import { Check } from "lucide-react";
import StepIndicator from "./StepIndicator";

const SERVICES = ["Landing Page", "SaaS Development", "Web Apps", "Full-Stack Development"];

function Step1({ step, setStep, formData, setFormData }) {
  const step1Valid = formData.services.length > 0;

  const toggleService = (s) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <StepIndicator step={step} />
      <p className="text-[var(--accent)]/60 text-sm mb-6">
        Select the services you're interested in. You can choose multiple.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {SERVICES.map((s) => {
          const selected = formData.services.includes(s);
          return (
            <div
              key={s}
              onClick={() => toggleService(s)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleService(s); } }}
              tabIndex={0}
              role="checkbox"
              aria-checked={formData.services.includes(s)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selected
                  ? "bg-[var(--text-primary)]/10 border-[var(--text-primary)] text-[var(--text-primary)]"
                  : "border-[var(--accent)]/10 text-[var(--text-secondary)] hover:border-[var(--accent)]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    selected ? "bg-[var(--text-primary)] border-[var(--text-primary)]" : "border-[var(--accent)]/20"
                  }`}
                >
                  {selected && <Check size={10} className="text-[var(--accent-text)]" />}
                </div>
                <span className="text-sm font-medium">{s}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="px-6 py-2 border border-[var(--accent)]/10 rounded-full hover:border-[var(--accent)]/30 transition-colors text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => step1Valid && setStep(2)}
          disabled={!step1Valid}
          className={`px-6 py-2 rounded-full transition-colors text-sm ${
            step1Valid
              ? "bg-[var(--text-primary)] text-[var(--accent-text)] hover:bg-[var(--text-primary)]/90"
              : "bg-[var(--accent)]/10 text-[var(--accent)]/40 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

export default Step1;
