import type { Dispatch, SetStateAction } from "react";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import SuccessStep from "./SuccessStep";

export interface LeadFormData {
  services: string[];
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  details: string;
  currency: string;
  budget: string;
  isCustomCode?: boolean;
}

export interface StepContentProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  formData: LeadFormData;
  setFormData: Dispatch<SetStateAction<LeadFormData>>;
  handleSubmit: () => void | Promise<void>;
  submitted: boolean;
  countryOpen: boolean;
  setCountryOpen: Dispatch<SetStateAction<boolean>>;
  currencyOpen: boolean;
  setCurrencyOpen: Dispatch<SetStateAction<boolean>>;
  sending: boolean;
  error: string | null;
  handleClose: () => void;
}

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
}: StepContentProps) {
  return (
      <div className="w-full">
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
  );
}

export default StepContent;
