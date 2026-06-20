import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import StepIndicator from "./StepIndicator";

const CURRENCIES = [
  { label: "USD", symbol: "$" },
  { label: "INR", symbol: "₹" },
  { label: "EUR", symbol: "€" },
  { label: "GBP", symbol: "£" },
  { label: "AUD", symbol: "A$" },
];

function Step3({
  step,
  setStep,
  formData,
  setFormData,
  handleSubmit,
  sending,
  error,
  currencyOpen,
  setCurrencyOpen,
}) {
  const step3Valid = formData.budget && !sending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <StepIndicator step={step} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Currency
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="w-full px-4 py-3 bg-black border border-[#EAEFFF]/10 rounded-xl text-white text-left flex items-center justify-between hover:border-[#EAEFFF]/25 transition-colors text-sm"
            >
              <span className="flex items-center gap-2">
                <span>
                  {
                    CURRENCIES.find((c) => c.label === formData.currency)
                      ?.symbol
                  }
                </span>
                <span>{formData.currency}</span>
              </span>
              <span className="text-white/30 text-xs">▾</span>
            </button>
            {currencyOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#151515] border border-[#EAEFFF]/10 rounded-xl overflow-hidden z-20">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, currency: c.label }));
                      setCurrencyOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-white/5 text-white text-sm"
                  >
                    <span>{c.symbol}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Budget <span className="text-red-400">*</span>
          </label>
          <input
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="2,000"
            className="w-full px-4 py-3 bg-black border border-[#EAEFFF]/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#EAEFFF]/30 transition-colors text-sm"
          />
        </div>
      </div>
      <div className="bg-black p-4 rounded-xl mb-6 border border-[#EAEFFF]/10">
        <h4 className="font-medium text-white mb-3 text-sm">
          Review Your Information
        </h4>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-white/40">Name: </span>
            <span className="text-white">{formData.name}</span>
          </p>
          <p>
            <span className="text-white/40">Email: </span>
            <span className="text-white">{formData.email}</span>
          </p>
          <p>
            <span className="text-white/40">Phone: </span>
            <span className="text-white">
              {formData.countryCode} {formData.phone}
            </span>
          </p>
          <p>
            <span className="text-white/40">Services: </span>
            <span className="text-white">{formData.services.join(", ")}</span>
          </p>
          {formData.budget && (
            <p>
              <span className="text-white/40">Budget: </span>
              <span className="text-white">
                {CURRENCIES.find((c) => c.label === formData.currency)?.symbol}
                {formData.budget} {formData.currency}
              </span>
            </p>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-sm text-red-400/80">
          {error}
        </div>
      )}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={sending}
          className="px-6 py-2 border border-[#EAEFFF]/10 rounded-full hover:border-[#EAEFFF]/30 transition-colors text-sm disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (!step3Valid) return;
            handleSubmit();
          }}
          disabled={!step3Valid}
          className={`inline-flex items-center gap-2 px-6 py-2 rounded-full transition-colors text-sm ${
            step3Valid
              ? "bg-white text-black hover:bg-white/90"
              : "bg-[#EAEFFF]/10 text-[#EAEFFF]/40 cursor-not-allowed"
          }`}
        >
          {sending && <Loader2 size={14} className="animate-spin" />}
          {sending ? "Sending..." : "Submit"}
        </button>
      </div>
    </motion.div>
  );
}

export default Step3;
