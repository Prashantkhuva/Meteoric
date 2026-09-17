import { useState, useEffect } from "react";
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

const BASE_USD = 499;
const OVERRIDES = { USD: 499, INR: 29999 };
const FALLBACK = { USD: 499, INR: 29999, EUR: 400, GBP: 350, AUD: 750 };

function formatNum(n) {
  return Number(n).toLocaleString("en-IN");
}

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
  const [rates, setRates] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.rates) setRates(data.rates);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  function getMinPrice(currency) {
    if (OVERRIDES[currency]) return OVERRIDES[currency];
    if (rates && rates[currency]) {
      return Math.round(BASE_USD * rates[currency]);
    }
    return FALLBACK[currency] || 0;
  }

  const minPrice = getMinPrice(formData.currency);
  const budgetNum = Number(String(formData.budget).replace(/[^0-9]/g, ""));
  const belowMin = formData.budget && budgetNum < minPrice;
  const step3Valid = formData.budget && !belowMin && !sending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
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
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Currency
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--accent)]/10 rounded-xl text-[var(--text-primary)] text-left flex items-center justify-between hover:border-[var(--accent)]/25 transition-colors text-sm"
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
              <span className="text-[var(--text-muted)] text-xs">▾</span>
            </button>
            {currencyOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[var(--bg-elevated)] border border-[var(--accent)]/10 rounded-xl overflow-hidden z-20">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, currency: c.label }));
                      setCurrencyOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-[var(--text-primary)]/5 text-[var(--text-primary)] text-sm"
                  >
                    <span>{c.symbol}</span>
                    <span>{c.label}</span>
                    <span className="ml-auto text-[var(--text-muted)]/40 text-xs">
                      Min {c.symbol}{formatNum(getMinPrice(c.label))}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Budget <span className="text-red-400">*</span>
          </label>
          <input
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder={`Min ${CURRENCIES.find((c) => c.label === formData.currency)?.symbol || "$"}${formatNum(minPrice)}`}
            className={`w-full px-4 py-3 bg-[var(--bg-primary)] border rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none transition-colors text-sm ${
              belowMin
                ? "border-red-500/40 focus:border-red-500/60"
                : "border-[var(--accent)]/10 focus:border-[var(--accent)]/30"
            }`}
          />
          {belowMin && (
            <p className="text-red-400/70 text-xs mt-1.5">
              Minimum budget is{" "}
              {CURRENCIES.find((c) => c.label === formData.currency)?.symbol}
              {formatNum(minPrice)} {formData.currency}
            </p>
          )}
        </div>
      </div>
      <div className="bg-[var(--bg-primary)] p-4 rounded-xl mb-6 border border-[var(--accent)]/10">
        <h4 className="font-medium text-[var(--text-primary)] mb-3 text-sm">
          Review Your Information
        </h4>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-[var(--text-muted)]">Name: </span>
            <span className="text-[var(--text-primary)]">{formData.name}</span>
          </p>
          <p>
            <span className="text-[var(--text-muted)]">Email: </span>
            <span className="text-[var(--text-primary)]">{formData.email}</span>
          </p>
          <p>
            <span className="text-[var(--text-muted)]">Phone: </span>
            <span className="text-[var(--text-primary)]">
              {formData.countryCode} {formData.phone}
            </span>
          </p>
          <p>
            <span className="text-[var(--text-muted)]">Services: </span>
            <span className="text-[var(--text-primary)]">{formData.services.join(", ")}</span>
          </p>
          {formData.budget && (
            <p>
              <span className="text-[var(--text-muted)]">Budget: </span>
              <span className="text-[var(--text-primary)]">
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
          className="px-6 py-2 border border-[var(--accent)]/10 rounded-full hover:border-[var(--accent)]/30 transition-colors text-sm disabled:opacity-40"
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
              ? "bg-[var(--text-primary)] text-[var(--accent-text)] hover:bg-[var(--text-primary)]/90"
              : "bg-[var(--accent)]/10 text-[var(--accent)]/40 cursor-not-allowed"
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
