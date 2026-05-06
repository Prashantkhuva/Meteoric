import React from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#EAEFFF]/10 py-14">
      {/* subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(234,239,255,0.04),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          {/* LEFT */}
          <div className="max-w-xl">
            <p className="text-[#EAEFFF] text-2xl md:text-3xl font-semibold tracking-tight">
              Meteoric
            </p>

            <p className="mt-5 text-[#EAEFFF]/45 leading-relaxed text-base md:text-lg">
              Building premium full-stack products, modern interfaces, and
              scalable digital experiences for startups and founders.
            </p>

            {/* availability */}
            <div className="mt-8 flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />

                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
              </div>

              <span className="text-sm text-[#EAEFFF]/55">
                Available for freelance projects
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">
            {/* github */}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-10 border border-[#EAEFFF]/10 bg-[#0f0f0f] hover:bg-[#141414] px-5 py-4 rounded-2xl transition-all duration-300 hover:border-[#EAEFFF]/15"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 flex items-center justify-center text-[#EAEFFF]/60">
                  <FaGithub />
                </div>

                <div>
                  <p className="text-[#EAEFFF] text-sm font-medium">GitHub</p>

                  <p className="text-[#EAEFFF]/40 text-xs">
                    View projects & code
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="text-[#EAEFFF]/30 group-hover:text-[#EAEFFF]/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
              />
            </a>

            {/* linkedin */}
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-10 border border-[#EAEFFF]/10 bg-[#0f0f0f] hover:bg-[#141414] px-5 py-4 rounded-2xl transition-all duration-300 hover:border-[#EAEFFF]/15"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 flex items-center justify-center text-[#EAEFFF]/60">
                  <FaLinkedin size={18} />
                </div>

                <div>
                  <p className="text-[#EAEFFF] text-sm font-medium">LinkedIn</p>

                  <p className="text-[#EAEFFF]/40 text-xs">
                    Professional profile
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="text-[#EAEFFF]/30 group-hover:text-[#EAEFFF]/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
              />
            </a>

            {/* email */}
            <a
              href="mailto:your@email.com"
              className="group flex items-center justify-between gap-10 border border-[#EAEFFF]/10 bg-[#0f0f0f] hover:bg-[#141414] px-5 py-4 rounded-2xl transition-all duration-300 hover:border-[#EAEFFF]/15"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#EAEFFF]/10 bg-[#EAEFFF]/5 flex items-center justify-center text-[#EAEFFF]/60">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-[#EAEFFF] text-sm font-medium">Email</p>

                  <p className="text-[#EAEFFF]/40 text-xs">
                    Let’s build something
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="text-[#EAEFFF]/30 group-hover:text-[#EAEFFF]/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
              />
            </a>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-6 border-t border-[#EAEFFF]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#EAEFFF]/35 text-sm">
            © 2026 Meteoric. Crafted with precision.
          </p>

          <div className="flex items-center gap-6 text-sm text-[#EAEFFF]/35">
            <span>Ahmedabad, India</span>

            <div className="w-1 h-1 rounded-full bg-[#EAEFFF]/20" />

            <span>MERN Stack Developer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
