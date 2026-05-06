import { motion } from "framer-motion";
import { Check } from "lucide-react";
import StepIndicator from "./StepIndicator";

const SERVICES = ["Landing Page", "SaaS App", "Full Website"];

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
      <p className="text-[#EAEFFF]/60 text-sm mb-6">
        Select the services you're interested in. You can choose multiple.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {SERVICES.map((s) => {
          const selected = formData.services.includes(s);
          return (
            <div
              key={s}
              onClick={() => toggleService(s)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selected
                  ? "bg-white/10 border-white text-white"
                  : "border-[#252525] text-white/70 hover:border-[#EAEFFF]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    selected ? "bg-white border-white" : "border-[#454545]"
                  }`}
                >
                  {selected && <Check size={10} className="text-black" />}
                </div>
                <span className="text-sm font-medium">{s}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(0)}
          className="px-6 py-2 border border-[#252525] rounded-full hover:border-white/40 transition-colors text-sm"
        >
          Back
        </button>
        <button
          onClick={() => step1Valid && setStep(2)}
          disabled={!step1Valid}
          className={`px-6 py-2 rounded-full transition-colors text-sm ${
            step1Valid
              ? "bg-white text-black hover:bg-white/90"
              : "bg-[#252525] text-[#EAEFFF]/40 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

export default Step1;
