import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import StepContent from "./StepContent";

export default function RequestModal({ isOpen, setIsOpen }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const [formData, setFormData] = useState({
    services: [],
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    details: "",
    currency: "USD",
    budget: "",
  });

  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          services: formData.services.join(", "),
          details: formData.details,
          budget: `${formData.currency} ${formData.budget}`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        "template_42sm3qm",
        {
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          services: formData.services.join(", "),
          details: formData.details,
          budget: `${formData.currency} ${formData.budget}`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
    }, 300);
  }, [setIsOpen]);

  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
    function handleKeyDown(e) {
      if (e.key === "Escape") handleClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          onClick={handleClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        <div
          className={`relative bg-black rounded-2xl w-full overflow-hidden text-white border border-[#EAEFFF]/10 z-10 transition-all duration-300 shadow-[0_0_80px_rgba(234,239,255,0.06)]
  ${step === 0 ? "max-w-md" : "max-w-2xl"}`}
        >
          <div className="flex justify-between items-center p-6 border-b border-[#EAEFFF]/8">
            <h3 id="modal-title" className="text-xl font-bold">
              {step === 0 ? "Get Started" : "Request Services"}
            </h3>
            <button ref={closeBtnRef} onClick={handleClose} aria-label="Close dialog">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 ">
            <StepContent
              step={step}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              submitted={submitted}
              countryOpen={countryOpen}
              setCountryOpen={setCountryOpen}
              currencyOpen={currencyOpen}
              setCurrencyOpen={setCurrencyOpen}
              sending={sending}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
