import { AnimatePresence, motion } from "framer-motion";
import { Calendar, FileText, Check, ChevronDown } from "lucide-react";
import StepIndicator from "./StepIndicator";
import { useState, useEffect, useRef } from "react";
import { Plus, ArrowLeft } from "lucide-react";

function StepContent({
  step,
  setStep,
  formData,
  setFormData,
  handleSubmit,
  submitted,
  countryOpen,
  setCountryOpen,
  currencyOpen,
  setCurrencyOpen,
  handleClose,
}) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const COUNTRY_CODES = [
    { code: "+91", label: "India", flag: "🇮🇳" },
    { code: "+1", label: "United States", flag: "🇺🇸" },
    { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
    { code: "+61", label: "Australia", flag: "🇦🇺" },
    { code: "+971", label: "UAE", flag: "🇦🇪" },
    { code: "+49", label: "Germany", flag: "🇩🇪" },
  ];

  const CURRENCIES = [
    { label: "USD", symbol: "$" },
    { label: "INR", symbol: "₹" },
    { label: "EUR", symbol: "€" },
    { label: "GBP", symbol: "£" },
    { label: "AUD", symbol: "A$" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const step1Valid = formData.services.length > 0;

  const step2Valid =
    formData.name && formData.email && formData.phone && formData.details;

  const step3Valid = formData.budget;
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const toggleService = (s) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  };

  const filteredCountries = COUNTRY_CODES.filter((c) =>
    `${c.label} ${c.code}`.toLowerCase().includes(search.toLowerCase()),
  );

  const SERVICES = ["Landing Page", "SaaS App", "Full Website"];

  const selectedCountry = COUNTRY_CODES.find(
    (c) => c.code === formData.countryCode,
  );

  return (
    <AnimatePresence mode="wait">
      <div ref={dropdownRef} className="w">
        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              {/* 👇 only step 0 width control */}
              <div className="w-full max-w-sm">
                <p className="text-white/50 text-sm mb-6 text-center">
                  How would you like to get started?
                </p>

                <button
                  data-cal-namespace="let-s-build"
                  data-cal-link="prashantkhuva/let-s-build"
                  data-cal-config='{"layout":"month_view"}'
                  className="w-full mb-3 bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-white/90 transition-colors"
                >
                  <Calendar size={18} />
                  Book a Free Strategy Call
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <FileText size={18} />
                  Request Services
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Services */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StepIndicator step={step} />
              <p className="text-[#EAEFFF]/60 text-sm mb-6">
                Select the services you're interested in. You can choose
                multiple.
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
                            selected
                              ? "bg-white border-white"
                              : "border-[#454545]"
                          }`}
                        >
                          {selected && (
                            <Check size={10} className="text-black" />
                          )}
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
          )}

          {/* STEP 2 — Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StepIndicator step={step} />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Country Code
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryOpen(!countryOpen)}
                        className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white text-left flex items-center justify-between hover:border-white/20 transition-colors text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span>{selectedCountry?.flag || ""}</span>
                          <span>{formData.countryCode || "+91"}</span>
                        </span>
                        <ChevronDown size={16} className="text-white/40" />
                      </button>
                      {countryOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1a1a] border border-[#252525] rounded-xl z-20 overflow-hidden shadow-xl">
                          {/* 🔁 NORMAL MODE */}
                          {!formData.isCustomCode ? (
                            <>
                              {/* 🔍 SEARCH */}
                              <div className="p-2 border-b border-[#252525]">
                                <input
                                  placeholder="Search country or code..."
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  className="w-full px-3 py-2 bg-[#101010] border border-[#252525] rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none"
                                />
                              </div>

                              {/* ➕ CUSTOM BUTTON */}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    isCustomCode: true,
                                    countryCode: "",
                                  }))
                                }
                                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/5 text-white text-sm border-b border-[#252525]"
                              >
                                <Plus size={16} className="text-white/60" />
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">
                                    Custom Country Code
                                  </span>
                                  <span className="text-xs text-white/40">
                                    Enter your own code
                                  </span>
                                </div>
                              </button>

                              {/* 🌍 COUNTRY LIST */}
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCountries.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setFormData((p) => ({
                                        ...p,
                                        countryCode: c.code,
                                        isCustomCode: false,
                                      }));
                                      setCountryOpen(false);
                                      setSearch("");
                                    }}
                                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-white/5 text-white text-sm"
                                  >
                                    <span>{c.flag}</span>
                                    <span className="font-medium">
                                      {c.code}
                                    </span>
                                    <span className="text-white/40 text-xs">
                                      {c.label}
                                    </span>
                                  </button>
                                ))}

                                {filteredCountries.length === 0 && (
                                  <div className="px-4 py-3 text-white/40 text-sm">
                                    No results found
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              {/* 🔙 BACK */}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    isCustomCode: false,
                                  }))
                                }
                                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/5 text-white text-sm border-b border-[#252525]"
                              >
                                <ArrowLeft
                                  size={16}
                                  className="text-white/60"
                                />
                                Back to countries
                              </button>

                              {/* ✏️ INPUT */}
                              <div className="p-3">
                                <input
                                  autoFocus
                                  placeholder="+123"
                                  value={formData.countryCode}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(
                                      /[^\d]/g,
                                      "",
                                    ); // sirf numbers allow
                                    setFormData((p) => ({
                                      ...p,
                                      countryCode: value ? `+${value}` : "",
                                    }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault(); // 🔥 IMPORTANT FIX
                                      setCountryOpen(false);
                                    }
                                  }}
                                  className="w-full px-3 py-3 bg-[#101010] border border-[#EAEFFF]/20 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#EAEFFF]/40"
                                />
                                <p className="text-xs text-white/40 mt-2">
                                  Press Enter to confirm
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="1122334455"
                      className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Project Details <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-[#252525] rounded-full hover:border-white/40 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => step2Valid && setStep(3)}
                  disabled={!step2Valid}
                  className={`px-6 py-2 rounded-full transition-colors text-sm ${
                    step2Valid
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-[#252525] text-[#EAEFFF]/40 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Review + Budget */}
          {step === 3 && !submitted && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StepIndicator step={step} />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCurrencyOpen(!currencyOpen)}
                      className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white text-left flex items-center justify-between hover:border-white/20 transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span>
                          {
                            CURRENCIES.find(
                              (c) => c.label === formData.currency,
                            )?.symbol
                          }
                        </span>
                        <span>{formData.currency}</span>
                      </span>
                      <span className="text-white/30 text-xs">▾</span>
                    </button>
                    {currencyOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1a1a] border border-[#252525] rounded-xl overflow-hidden z-20">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.label}
                            type="button"
                            onClick={() => {
                              setFormData((p) => ({
                                ...p,
                                currency: c.label,
                              }));
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
                    className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="bg-[#101010] p-4 rounded-xl mb-6 border border-[#252525]">
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
                    <span className="text-white">
                      {formData.services.join(", ")}
                    </span>
                  </p>
                  {formData.budget && (
                    <p>
                      <span className="text-white/40">Budget: </span>
                      <span className="text-white">
                        {
                          CURRENCIES.find((c) => c.label === formData.currency)
                            ?.symbol
                        }
                        {formData.budget} {formData.currency}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-[#252525] rounded-full hover:border-white/40 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!step3Valid) return;
                    handleSubmit();
                  }}
                  disabled={!step3Valid}
                  className={`px-6 py-2 rounded-full transition-colors text-sm ${
                    step3Valid
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-[#252525] text-[#EAEFFF]/40 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}

          {/* SUCCESS */}
          {submitted && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Request Received!
              </h3>
              <p className="text-white/50 text-sm mb-6">
                I'll get back to you within 24 hours.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

export default StepContent;
