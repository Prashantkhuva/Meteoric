"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StaggerText from "@/components/layout/StaggerText";
import { projects as allProjects } from "@/data/projects";

const projects = allProjects.slice(0, 2);

function ProjectCard({ project, index }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block gsap-proj-card ${index % 2 === 1 ? "md:mt-12" : ""}`}
    >
      <div className="relative rounded-4xl overflow-hidden mb-5 bg-white/[0.03]">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.tagline}`}
          width={800}
          height={500}
          className="w-full h-auto block max-w-[85%] mx-auto rounded-2xl transition-all duration-500 ease-out group-hover:scale-[1.03] gsap-proj-img"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight size={14} className="text-white" />
        </div>
      </div>
      <h3 className="text-lg md:text-xl font-display text-white mb-1 group-hover:text-white/80 transition-colors duration-300">
        {project.name}
      </h3>
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
        {project.tagline}
      </p>
    </a>
  );
}

export const ProjectCardMobile = function ProjectCardMobile({ project }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
      <div className="relative h-48 w-full overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
        <Image
          src={project.image}
          alt={`${project.name} — ${project.tagline}`}
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
            data-no-magnetic
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
      headingRef.current?.querySelectorAll(".split-line").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const split = new SplitText(headingRef.current, { type: "lines", linesClass: "split-line" });
    gsap.fromTo(split.lines,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top bottom",
          toggleActions: "play reset play reset",
        },
      },
    );

    gsap.fromTo(
      sectionRef.current?.querySelectorAll(".gsap-proj-card"),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current?.querySelector(".gsap-proj-card"),
          start: "top 88%",
          toggleActions: "play none none none",
        },
      },
    );

    const imgs = sectionRef.current?.querySelectorAll(".gsap-proj-img");
    imgs?.forEach((img) => {
      gsap.set(img, { clipPath: "inset(100% 0 0 0)", objectPosition: "0px 80%", scale: 1.15 });
      gsap.to(img,
        {
          clipPath: "inset(0% 0 0 0)",
          objectPosition: "0px 30%",
          scale: 1,
          filter: "grayscale(0%) brightness(1)",
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
      gsap.to(img,
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".gsap-proj-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );
    });
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
            <p className="text-white/60 uppercase tracking-[0.2em] text-xs mb-5">
              <span className="font-display text-white/40 not-italic mr-2">03</span>
              Curated Portfolio
            </p>
            <h2 className="text-4xl md:text-6xl leading-[1.05] font-display tracking-tight text-white">
              Selected Works
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 mb-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
