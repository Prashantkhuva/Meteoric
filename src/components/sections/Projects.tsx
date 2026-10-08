"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useSectionAnimations from "@/hooks/useSectionAnimations";
import {
  revealFrom,
  revealTo,
  clearRevealClip,
} from "@/lib/scroll-reveal";
import { projects as allProjects } from "@/data/projects";
import type { Project } from "@/data/types";

const projects = allProjects.slice(0, 2);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block gsap-proj-card ${index % 2 === 1 ? "md:mt-12" : ""}`}
    >
      <div className="relative rounded-[24px] overflow-hidden mb-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 90vw, 45vw"
          className="w-full h-auto block max-w-[90%] mx-auto mt-6 rounded-[14px] transition-all duration-500 ease-out group-hover:scale-[1.02] gsap-proj-img shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" style={{ background: "var(--accent-dim)", border: "1px solid var(--border-color)" }}>
          <ArrowUpRight size={14} style={{ color: "var(--text-primary)" }} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1 transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
            {project.name}
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {project.tagline}
          </p>
        </div>
        {(project as Project & { stats?: { label: string; value: string }[] }).stats && (
          <div className="flex gap-4 shrink-0">
            {(project as Project & { stats?: { label: string; value: string }[] }).stats!.map((s) => (
              <div key={s.label} className="text-right">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useSectionAnimations(
    sectionRef,
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        headingRef.current?.querySelectorAll<HTMLElement>(".split-line").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        return;
      }

    const heading = headingRef.current?.querySelector("h2");
    if (!heading) return;

    const split = new SplitText(heading, { type: "lines", linesClass: "split-line", aria: "manual" as "auto" });
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
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
      },
    );

    const cards = sectionRef.current?.querySelectorAll(".gsap-proj-card");
    cards?.forEach((card, i) => {
      // Alternate edges: card 0 enters from the left, card 1 from the right.
      const dir = i % 2 === 0 ? "right" : "left";
      gsap.fromTo(
        card,
        revealFrom(dir),
        {
          ...revealTo,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
          immediateRender: true,
          onComplete: () => clearRevealClip(card),
          scrollTrigger: {
            trigger: cards[0],
            start: "top 88%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        },
      );
    });

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
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
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
  },
  [],
);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-24 sm:py-28 lg:py-32 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={headingRef} className="mb-12">
          <p
            className="uppercase tracking-[0.15em] text-caption mb-4 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Our Work
          </p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
            <h2 className="text-heading-1 font-display tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
              Selected Works
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-3 md:gap-x-6 md:gap-y-0 shrink-0">
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 min-h-6 text-xs uppercase tracking-[0.15em] font-medium whitespace-nowrap transition-colors duration-300"
              style={{ color: "var(--text-secondary)" }}
            >
              Explore All Work
              <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-1.5 min-h-6 text-xs uppercase tracking-[0.15em] font-medium whitespace-nowrap transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
            >
              Case Studies
              <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
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
