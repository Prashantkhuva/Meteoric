import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../Components/Navbar";
import SEO from "../Components/SEO";
import { ProjectCardMobile } from "../Components/Projects";
import { projects } from "../data/projects";

const workSeo = {
  title: "Our Work — Meteoric Portfolio | Web Development Projects",
  description:
    "Browse Meteoric's portfolio of shipped projects — landing pages, SaaS platforms, VS Code extensions, and more. Built for founders who ship.",
  keywords: [
    "Meteoric portfolio",
    "web development projects",
    "React portfolio",
    "SaaS projects",
    "landing page examples",
    "full-stack projects",
  ],
  path: "/work",
};

export default function WorkPage() {
  return (
    <>
      <SEO {...workSeo} />
      <header className="contents">
        <Navbar />
      </header>

      <main className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EAEFFF]/[0.02] blur-[160px] rounded-full" />
        </div>

        <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white/25 uppercase tracking-[0.3em] text-xs mb-10"
          >
            Our Work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight max-w-4xl mb-6"
          >
            Projects that{" "}
            <span className="text-white/30">actually shipped.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/40 text-base md:text-lg max-w-2xl mb-16"
          >
            Every project here went from concept to production — on time, on
            budget, and built to convert.
          </motion.p>

          {/* Project Cards */}
          <div className="space-y-8 md:space-y-16">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Mobile */}
                <div className="md:hidden">
                  <ProjectCardMobile project={project} />
                </div>

                {/* Desktop */}
                <div className="hidden md:block">
                  <DesktopProjectCard project={project} index={i} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function DesktopProjectCard({ project, index }) {
  return (
    <div className="group relative grid grid-cols-12 gap-0 rounded-3xl overflow-hidden ring-1 ring-white/[0.06] hover:ring-white/[0.15] transition-all duration-700 bg-gradient-to-br from-white/[0.02] to-transparent">
      {/* Decorative index number */}
      <div
        className="absolute -top-6 -left-4 text-[12rem] font-bold leading-none pointer-events-none select-none opacity-[0.04]"
        style={{ color: project.accent }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Image — spans 6 cols */}
      <div className="relative col-span-12 lg:col-span-6 min-h-[28rem] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
        />
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <motion.img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-contain max-h-[24rem]"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        {/* Subtle overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
      </div>

      {/* Content — spans 6 cols */}
      <div className="relative col-span-12 lg:col-span-6 flex flex-col justify-center px-8 py-10 lg:px-10 lg:py-14">
        {/* Number badge */}
        <div
          className="inline-flex items-center gap-2 text-xs font-mono mb-6"
          style={{ color: project.accent }}
        >
          <span className="w-6 h-px" style={{ backgroundColor: project.accent }} />
          Project {String(index + 1).padStart(2, "0")}
        </div>

        {/* Name */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
          {project.name}
        </h2>

        {/* Tagline */}
        <p className="text-base" style={{ color: project.accent }}>
          {project.tagline}
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06] my-6" />

        {/* Description */}
        <p className="text-sm text-white/45 leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {project.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-[10px] mt-1 shrink-0 font-mono"
                style={{ color: project.accent }}
              >
                &#x25B8;
              </span>
              <span className="text-xs text-white/40 leading-relaxed">{f}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-7">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-white/40 font-medium tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn relative inline-flex items-center gap-2 overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5 w-fit"
        >
          <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
          <span className="relative z-10 group-hover/btn:text-black flex items-center gap-2">
            View Live Project <ArrowUpRight size={16} />
          </span>
        </a>
      </div>
    </div>
  );
}

