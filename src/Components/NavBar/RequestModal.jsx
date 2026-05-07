import React, { useState } from "react";
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

  const handleSubmit = async () => {
    try {
      await emailjs.send(
        "service_4nznchu",
        "template_xx2t3io",
        {
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          services: formData.services.join(", "),
          details: formData.details,
          budget: `${formData.currency} ${formData.budget}`,
        },
        "pBe3c_Uz8ZEjGLsoJ",
      );

      await emailjs.send(
        "service_4nznchu",
        "template_42sm3qm",
        {
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          services: formData.services.join(", "),
          details: formData.details,
          budget: `${formData.currency} ${formData.budget}`,
        },
        "pBe3c_Uz8ZEjGLsoJ",
      );

      setSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={handleClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        <div
          className={`relative bg-black rounded-2xl w-full overflow-hidden text-white border border-[#EAEFFF]/10 z-10 transition-all duration-300 shadow-[0_0_80px_rgba(234,239,255,0.06)]
  ${step === 0 ? "max-w-md" : "max-w-2xl"}`}
        >
          <div className="flex justify-between items-center p-6 border-b border-[#EAEFFF]/8">
            <h3 className="text-xl font-bold">
              {step === 0 ? "Get Started" : "Request Services"}
            </h3>
            <button onClick={handleClose}>
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
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
