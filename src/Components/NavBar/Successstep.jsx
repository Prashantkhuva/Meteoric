import { motion } from "framer-motion";
import { Check } from "lucide-react";

function SuccessStep({ handleClose }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={24} className="text-black" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
      <p className="text-white/50 text-sm mb-6">
        I'll get back to you within 24 hours.
      </p>
      <button
        onClick={handleClose}
        className="px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
      >
        Done
      </button>
    </motion.div>
  );
}

export default SuccessStep;
