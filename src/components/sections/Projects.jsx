"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StaggerText from "@/components/layout/StaggerText";
import { projects as allProjects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const projects = allProjects.slice(0, 2);

const projMainWords = "Selected Works".split(" ");

export const ProjectCardMobile = function ProjectCardMobile({ project }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
      <div className="relative h-48 w-full overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-contain p-4"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/15 bg-black/50 text-white/50 backdrop-blur-sm">
          Featured
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="px-4 pb-5 pt-3.5 space-y-3">
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

        <p className="text-[12px] text-white/55 leading-relaxed">{project.tagline}</p>
        <p className="text-[11px] text-white/55 leading-relaxed">{project.description}</p>

        <div className="space-y-1">
          {project.features.slice(0, 2).map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: project.accent }} />
              <span className="text-[11px] text-white/55 leading-relaxed">{f}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border text-white/55 font-mono" style={{ borderColor: `${project.accent}22`, backgroundColor: `${project.accent}08` }}>
              {tag}
            </span>
          ))}
        </div>

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
};

function Projects() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      headingRef.current?.querySelectorAll(".gsap-proj-word").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.fromTo(
      headingRef.current?.querySelectorAll(".gsap-proj-word"),
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
      },
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-black py-24 sm:py-28 lg:py-32 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5 [&>.gsap-proj-word:not(:last-child)]:mr-[0.25em]">
              <span className="font-display text-white/30 not-italic mr-2">03</span>
              {"Curated Portfolio".split(" ").map((w, i) => (
                <span key={i} className="gsap-proj-word inline-block">{w} </span>
              ))}
            </p>
            <h2 className="text-4xl md:text-6xl leading-[1.05] font-display tracking-tight text-white [&>.gsap-proj-word:not(:last-child)]:mr-[0.25em]">
              {projMainWords.map((w, i) => (
                <span key={i} className="gsap-proj-word inline-block">{w} </span>
              ))}
            </h2>
          </div>

          <Link
            href="/work"
            className="group relative inline-flex items-center gap-2 text-white/60 text-xs uppercase tracking-[0.2em] font-bold transition-colors duration-300 hover:text-white"
          >
            <span className="relative inline-flex items-center gap-2">
              <StaggerText text="Explore All Work" />
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-white/40 group-hover:w-full transition-all duration-500" />
          </Link>
        </div>

        {/* Project Grid — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-16">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block ${i % 2 === 1 ? "md:mt-12" : ""}`}
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-5 bg-white/[0.03]">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-contain p-4 md:p-10 transition-all duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Name + category */}
              <h3 className="text-lg md:text-xl font-display text-white mb-1 group-hover:text-white/80 transition-colors duration-300">
                {project.name}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
                {project.tagline}
              </p>
            </a>
          ))}
        </div>

        {/* Project Index — like flowiee */}
        <div>
          <div className="flex items-end justify-between mb-8">
            <span className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold">Project Index</span>
            <span className="text-white/25 text-[10px] uppercase tracking-[0.3em]">Hover to preview</span>
          </div>

          <div className="space-y-0">
            {allProjects.map((project, i) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-5 border-b border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300"
              >
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-white/20 text-xs font-mono w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg md:text-xl font-display text-white/80 group-hover:text-white transition-colors duration-300">
                    {project.name}
                  </span>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                  <span className="hidden md:block text-xs uppercase tracking-[0.15em] text-white/30">
                    {project.tags[0]}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-white/20 group-hover:text-white/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </a>
            ))}

            {/* "Your project" row */}
            <Link
              href="/#contact"
              className="group flex items-center justify-between py-5 border-b border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300"
            >
              <div className="flex items-center gap-6 md:gap-10">
                <span className="text-white/20 text-xs font-mono w-6">
                  {String(allProjects.length + 1).padStart(2, "0")}
                </span>
                <span className="text-lg md:text-xl text-white/40 font-secondary-italic group-hover:text-white/70 transition-colors duration-300">
                  Your project
                </span>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                <span className="hidden md:block text-xs uppercase tracking-[0.15em] text-white/20">
                  Let&apos;s write it together
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-white/15 group-hover:text-white/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
