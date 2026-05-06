import { motion } from "framer-motion";
import { ChevronDown, Plus, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import StepIndicator from "./StepIndicator";

const COUNTRY_CODES = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "United States", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+971", label: "UAE", flag: "🇦🇪" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
];

function Step2({
  step,
  setStep,
  formData,
  setFormData,
  countryOpen,
  setCountryOpen,
}) {
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const step2Valid =
    formData.name && formData.email && formData.phone && formData.details;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCountries = COUNTRY_CODES.filter((c) =>
    `${c.label} ${c.code}`.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedCountry = COUNTRY_CODES.find(
    (c) => c.code === formData.countryCode,
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCountryOpen(!countryOpen)}
                className="w-full px-4 py-3 bg-[#101010] border border-[#252525] rounded-xl text-white text-left flex items-center justify-between hover:border-white/20 transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <span>{selectedCountry?.flag || ""}</span>
                  <span>{formData.countryCode || "+91"}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-white/40 transition-transform duration-200 ${countryOpen ? "rotate-180" : ""}`}
                />{" "}
              </button>
              {countryOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1a1a] border border-[#252525] rounded-xl z-20 overflow-hidden shadow-xl">
                  {!formData.isCustomCode ? (
                    <>
                      <div className="p-2 border-b border-[#252525]">
                        <input
                          placeholder="Search country or code..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full px-3 py-2 bg-[#101010] border border-[#252525] rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none"
                        />
                      </div>
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
                            <span className="font-medium">{c.code}</span>
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
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, isCustomCode: false }))
                        }
                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/5 text-white text-sm border-b border-[#252525]"
                      >
                        <ArrowLeft size={16} className="text-white/60" />
                        Back to countries
                      </button>
                      <div className="p-3">
                        <input
                          autoFocus
                          placeholder="+123"
                          value={formData.countryCode}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d]/g, "");
                            setFormData((p) => ({
                              ...p,
                              countryCode: value ? `+${value}` : "",
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
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
  );
}

export default Step2;
