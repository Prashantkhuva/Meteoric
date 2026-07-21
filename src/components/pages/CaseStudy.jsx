"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import StaggerText from "@/components/layout/StaggerText";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function CaseStudy({ project }) {
  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs uppercase tracking-[0.2em] transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            All Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span
            className="text-[11px] font-mono tracking-widest uppercase mb-4 block"
            style={{ color: project.accent }}
          >
            Project {String(project.id).padStart(2, "0")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.05] tracking-tight mb-4">
            {project.name}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: project.accent }}>
            {project.tagline}
          </p>
        </motion.div>
      </section>

      {/* Image */}
      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden ring-1 ring-white/[0.06]"
        >
          <Image
            src={project.image}
            alt={`${project.name} — ${project.tagline}`}
            width={1280}
            height={720}
            className="w-full h-auto object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Content */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left — Description */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6">
              Overview
            </h2>
            <p className="text-white/50 text-[15px] leading-[1.8]">
              {project.description}
            </p>
          </motion.div>

          {/* Right — Features + Stack */}
          <div className="space-y-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6">
                Key Features
              </h2>
              <div className="space-y-3">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: project.accent }}
                    />
                    <span className="text-sm text-white/45 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
            >
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-6">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-3 py-1 rounded-full border text-white/40 font-medium tracking-wide uppercase"
                    style={{ borderColor: `${project.accent}33`, backgroundColor: `${project.accent}0a` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="flex flex-wrap gap-4 mt-16 pt-16 border-t border-white/[0.06]"
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] px-7 py-3.5"
            style={{ border: `1.5px solid ${project.accent}`, color: project.accent }}
          >
            <span className="fill-circle" style={{ backgroundColor: project.accent }} />
            <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-black transition-colors duration-300">
              <StaggerText hoverColor="#000">View Live Project</StaggerText>
              <ArrowUpRight size={15} />
            </span>
          </a>

          <button
            onClick={openCal}
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-[#EAEFFF] text-black text-sm font-semibold hover:bg-white transition-all duration-300"
          >
            Start a Similar Project
          </button>
        </motion.div>
      </section>
    </div>
  );
}
