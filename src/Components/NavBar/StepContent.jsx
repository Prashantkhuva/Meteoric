import { AnimatePresence } from "framer-motion";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import SuccessStep from "./SuccessStep";

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
  sending,
  error,
  handleClose,
}) {
  return (
    <AnimatePresence mode="wait">
      <div className="w">
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
              sending={sending}
              error={error}
              currencyOpen={currencyOpen}
              setCurrencyOpen={setCurrencyOpen}
            />
          )}

          {submitted && <SuccessStep handleClose={handleClose} />}
      </div>
    </AnimatePresence>
  );
}

export default StepContent;
