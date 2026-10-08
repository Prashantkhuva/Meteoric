"use client";

import type { ChangeEventHandler } from "react";

type FormFieldInputProps = {
  id: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  defaultValue?: string | number;
};

interface FormFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function FormField({ label, name, type = "text", placeholder, defaultValue, value, onChange, required, disabled, rows }: FormFieldProps) {
  const inputId = `field-${name}`;
  const inputProps: FormFieldInputProps = {
    id: inputId,
    name,
    required,
    disabled,
    placeholder,
    className: "w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none resize-none disabled:opacity-30",
  };
  if (value !== undefined) {
    inputProps.value = value;
    inputProps.onChange = onChange;
  } else {
    inputProps.defaultValue = defaultValue;
  }
  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
        {label}
        {required && <span className="text-red-400/60 ml-0.5">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea {...inputProps} rows={rows || 3} />
      ) : (
        <input {...inputProps} type={type} />
      )}
    </div>
  );
}
