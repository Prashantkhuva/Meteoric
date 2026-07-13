"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects as allProjects } from "@/data/projects";

const projects = allProjects.slice(0, 3);

export const ProjectCardDesktop = memo(function ProjectCardDesktop({ project, isActive }) {
  return (
    <div
      onClick={() => window.open(project.link, "_blank")}
      className={`block rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 group relative ${
        isActive
          ? "ring-1 ring-white/20 shadow-[0_0_60px_rgba(234,239,255,0.06)]"
          : "ring-1 ring-transparent"
      }`}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 h-0.5 opacity-60"
        style={{ backgroundColor: project.accent }}
      />

      <div
        className={`bg-gradient-to-b ${project.gradient} flex flex-col w-full min-h-125 relative`}
      >
        {/* Top overlay — badge + arrow */}
        <div className="absolute top-0 left-0 right-0 z-10 p-8">
          <div className="flex items-start justify-between">
            <div>
              {/* Number */}
              <span
                className="text-[11px] font-mono tracking-wider"
                style={{ color: project.accent }}
              >
                {String(project.id).padStart(2, "0")}
              </span>
              {/* Tagline */}
              <p className="text-white font-semibold text-lg leading-snug max-w-[75%] mt-1">
                {project.tagline}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.link, "_blank");
              }}
              aria-label={`View ${project.name} project`}
              className="group/btn relative overflow-hidden rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] shrink-0 opacity-0 group-hover:opacity-100"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                <ArrowUpRight size={16} className="text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Image */}
        <motion.div
          className="relative flex-1 overflow-hidden rounded-2xl flex items-center justify-center mt-20 mx-4 mb-4"
          whileHover={{ rotate: -3, scale: 1.04 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </motion.div>

        {/* Bottom gradient fade for name badge */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10" />

        {/* Name badge at bottom */}
        <div className="absolute bottom-4 left-4 z-20">
          <p className="text-white font-bold text-lg drop-shadow-lg">
            {project.name}
          </p>
        </div>
      </div>
    </div>
  );
});

export const ProjectCardMobile = memo(function ProjectCardMobile({ project }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
      {/* Image area */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-contain p-4"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => {}}
        />
        {/* Status pill */}
        <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/15 bg-black/50 text-white/50 backdrop-blur-sm">
          Featured
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 pb-5 pt-3.5 space-y-3">
        {/* Name + arrow */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: project.accent }} />
            <h3 className="text-base font-semibold text-white leading-tight">
              {project.name}
            </h3>
          </div>
          <a href={project.link} target="_blank" rel="noopener noreferrer"
            className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:border-white/30 transition-all shrink-0"
            aria-hidden="true" tabIndex={-1}
          >
            <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Tagline */}
        <p className="text-[12px] text-white/55 leading-relaxed">{project.tagline}</p>

        {/* Description */}
        <p className="text-[11px] text-white/55 leading-relaxed">{project.description}</p>

        {/* Features */}
        <div className="space-y-1">
          {project.features.slice(0, 2).map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: project.accent }} />
              <span className="text-[11px] text-white/55 leading-relaxed">{f}</span>
            </div>
          ))}
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border text-white/55 font-mono" style={{ borderColor: `${project.accent}22`, backgroundColor: `${project.accent}08` }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          className="group/btn flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-200 active:scale-[0.98]"
          style={{ backgroundColor: project.accent, color: "#000" }}
        >
          View Project
          <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
});


function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { threshold: 0.5 },
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const active = projects[activeIndex];

  return (
    <section id="work" className="bg-black py-24 sm:py-28 lg:py-32 px-6 md:px-12">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5">
          <span className="font-display text-white/30 not-italic mr-2">04</span>
          Selected Work
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
          Projects that <span className="text-white/50 font-secondary-italic">actually shipped.</span>
        </h2>
        <Link
          href="/work"
          className="group relative overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] mt-6 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <span className="relative z-10 group-hover:text-black flex items-center gap-2">
            View All Projects <ArrowUpRight size={16} />
          </span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* LEFT — scrollable cards */}
        <div className="w-full lg:w-1/2 space-y-8">
          {projects.map((project, i) => (
            <div key={project.id} ref={(el) => (sectionRefs.current[i] = el)} data-index={i}>
              {/* Mobile (up to lg — includes tablet) */}
              <div className="lg:hidden">
                <ProjectCardMobile project={project} />
              </div>

              {/* Desktop (lg+) */}
              <div className="hidden lg:flex items-start py-12 h-180">
                <div className="w-full">
                  <ProjectCardDesktop
                    project={project}
                    isActive={activeIndex === i}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — sticky detail panel (large screens only) */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="sticky top-32 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-8 rounded-2xl border border-[#EAEFFF]/8 bg-gradient-to-b from-white/[0.02] to-transparent shadow-[0_0_44px_rgba(234,239,255,0.035)]"
              >
                {/* Accent line + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="h-0.5 w-10 rounded-full"
                    style={{ backgroundColor: active.accent }}
                  />
                  <h3 className="text-2xl font-bold text-white">
                    {active.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-white/55 text-sm leading-relaxed mb-8">
                  {active.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {active.features.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-0.5 text-[10px] font-mono shrink-0"
                        style={{ color: active.accent }}
                      >
                        &#x25B8;
                      </span>
                      <p className="text-white/55 text-sm">{f}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {active.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[11px] px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.03] text-white/55 font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => window.open(active.link, "_blank")}
                  className="group/btn relative overflow-hidden border-2 border-[#EAEFFF] text-[#EAEFFF] px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-[#EAEFFF] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 group-hover/btn:text-black flex items-center gap-2">
                    View Live Project <ArrowUpRight size={16} />
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
