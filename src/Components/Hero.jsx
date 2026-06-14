import { useEffect } from "react";
import { motion } from "framer-motion";
import MeteorBackground from "./MeteorBackground";
function Hero() {
  useEffect(() => {
    let cancelled = false;
    (async function () {
      try {
        const { getCalApi } = await import("@calcom/embed-react");
        if (cancelled) return;
        const cal = await getCalApi({ namespace: "let-s-build" });
        cal("ui", { theme: "dark", layout: "month_view" });
      } catch {
        /* embed optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-black flex items-center px-6 md:px-16"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <MeteorBackground showBrand={false} />
      </div>

      {/* Content */}
      <div className="relative pt-10 z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center gap-8">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative font-semibold text-4xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight text-white"
        >
          We design and ship high-performance websites
          <span className="text-white/40"> — in weeks, not months.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-2xl text-base md:text-lg text-white/60 leading-relaxed"
        >
          We partner with founders to design, develop, and launch modern
          websites and SaaS products that actually convert — not just look good.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          {/* Primary CTA */}
          <a
            data-cal-namespace="let-s-build"
            data-cal-link="prashantkhuva/let-s-build"
            data-cal-config='{"layout":"month_view"}'
            className="relative overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-black">
              Book a Free Strategy Call
            </span>
          </a>

          {/* Secondary CTA */}
          <a
            href="#process"
            className="group relative inline-flex items-center gap-2 text-base font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            See How We Build
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-white/60 transition-all duration-300 group-hover:w-full" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
