import { AnimatePresence } from "framer-motion";
import { useRef } from "react";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./step2";
import Step3 from "./Step3";
import SuccessStep from "./Successstep";

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
  const dropdownRef = useRef(null);

  return (
    <AnimatePresence mode="wait">
      <div ref={dropdownRef} className="w">
        <AnimatePresence mode="wait">
          {step === 0 && <Step0 setStep={setStep} />}

          {step === 1 && (
            <Step1
              step={step}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <Step2
              step={step}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
              countryOpen={countryOpen}
              setCountryOpen={setCountryOpen}
            />
          )}

          {step === 3 && !submitted && (
            <Step3
              step={step}
              setStep={setStep}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              currencyOpen={currencyOpen}
              setCurrencyOpen={setCurrencyOpen}
            />
          )}

          {submitted && <SuccessStep handleClose={handleClose} />}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

export default StepContent;
