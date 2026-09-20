import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { getCalApi } from "@calcom/embed-react";
import { useEffect, useCallback } from "react";

function Step0({ setStep }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "let-s-build" });
      cal("ui", { hideEventTypeDetails: true, layout: "month_view" });
    })();
  }, []);

  const openCal = useCallback(async () => {
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex justify-center"
    >
      <div className="w-full max-w-sm">
        <p className="text-[var(--text-primary)] text-2xl ml-0 mt-0 mb-10 ">
          How would you like to get started?
        </p>

        <button
          type="button"
          onClick={openCal}
          className="w-full mb-3 inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group hover:opacity-85"
          style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
        >
          Book a call
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" className="size-2 -rotate-90 transition-transform duration-150 group-hover:translate-x-px">
            <path fill="currentColor" d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full border border-[var(--border-color)] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--text-primary)]/5 transition-colors"
        >
          <FileText size={18} />
          Request Services
        </button>
      </div>
    </motion.div>
  );
}

export default Step0;
