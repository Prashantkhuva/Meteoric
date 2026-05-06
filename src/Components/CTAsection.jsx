import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import RequestModal from "./NavBar/RequestModal";

export default function CTASection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative py-40 overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* SMALL LABEL */}
        <p className="text-white/40 uppercase tracking-[0.25em] text-sm mb-8">
          Start a Project
        </p>

        {/* BIG HEADING */}
        <h2 className="text-5xl md:text-7xl leading-[0.95] font-semibold tracking-tight text-white max-w-5xl mx-auto">
          Have an idea in mind?
          <span className="block text-white/40 mt-3">
            Let’s build something exceptional.
          </span>
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-10 text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Open for freelance projects, startup collaborations, and premium
          digital experiences focused on design and performance.
        </p>

        {/* BUTTON */}
        <div className="mt-14">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative inline-flex items-center gap-2 overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
          >
            {/* hover bg */}
            <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            {/* content */}
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
              Start a Project
            </span>

            <ArrowUpRight
              size={18}
              className="relative z-10 transition-all duration-300 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </button>
        </div>
      </div>

      <RequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  );
}
