import { motion } from "framer-motion";
import { Calendar, FileText } from "lucide-react";
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
        <p className="text-white text-2xl ml-0 mt-0 mb-10 ">
          How would you like to get started?
        </p>

        <button
          type="button"
          onClick={openCal}
          className="w-full mb-3 bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-white/90 transition-colors"
        >
          <Calendar size={18} />
          Book a Free Strategy Call
        </button>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
        >
          <FileText size={18} />
          Request Services
        </button>
      </div>
    </motion.div>
  );
}

export default Step0;
