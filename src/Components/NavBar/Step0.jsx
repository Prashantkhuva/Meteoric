import { motion } from "framer-motion";
import { Calendar, FileText } from "lucide-react";

function Step0({ setStep }) {
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
        <p className="text-white/50 text-sm mb-6 text-center">
          How would you like to get started?
        </p>

        <button
          data-cal-namespace="let-s-build"
          data-cal-link="prashantkhuva/let-s-build"
          data-cal-config='{"layout":"month_view"}'
          className="w-full mb-3 bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-white/90 transition-colors"
        >
          <Calendar size={18} />
          Book a Free Strategy Call
        </button>

        <button
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