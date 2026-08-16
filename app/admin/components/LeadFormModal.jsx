"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FormField } from "./FormField";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const sourceList = [
  { value: "website", label: "Website" },
  { value: "cal.com", label: "Cal.com" },
  { value: "manual", label: "Manual" },
  { value: "csv_import", label: "CSV Import" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Other" },
];

export function LeadFormModal({ open, lead, onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const trapRef = useFocusTrap(open);
  const isEdit = !!lead;

  useEffect(() => {
    if (open) {
      const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(new FormData(e.target));
    setSubmitting(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-lead-title"
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
            <h2 id="add-lead-title" className="text-lg font-semibold tracking-tight text-white/90 mb-6">{isEdit ? "Edit Lead" : "Add Lead"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isEdit && <input type="hidden" name="id" value={lead.id} />}
              <FormField label="Name" name="name" placeholder="John Doe" defaultValue={lead?.name || ""} />
              <FormField label="Email" name="email" type="email" placeholder="john@example.com" defaultValue={lead?.email || ""} />
              <FormField label="Phone" name="phone" placeholder="+1 234 567 890" defaultValue={lead?.phone || ""} />
              <FormField label="Company" name="company" placeholder="Acme Inc." defaultValue={lead?.company || ""} />
              <FormField label="Services" name="services" placeholder="Web Development, SEO, Design" defaultValue={lead?.services || ""} />
              <FormField label="Budget" name="budget" placeholder="$5,000 - $10,000" defaultValue={lead?.budget || ""} />
              <FormField label="Details" name="details" type="textarea" rows={3} placeholder="Project details, requirements, notes..." defaultValue={lead?.details || ""} />
              <div>
                <label htmlFor="field-source" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Source
                </label>
                <select
                  id="field-source"
                  name="source"
                  defaultValue={lead?.source || "manual"}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                >
                  {sourceList.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/45 transition-all hover:bg-white/[0.04] hover:text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Lead"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}