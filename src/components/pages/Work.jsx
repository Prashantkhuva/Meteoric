"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import StaggerText from "@/components/layout/StaggerText";
import { projects } from "@/data/projects";
import { trackEvent } from "@/lib/analytics/gtag";

const categories = ["All", ...new Set(projects.map((p) => p.category))];

function ProjectCard({ project, index }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden ring-1 ring-[var(--border-color)] hover:ring-[var(--border-hover)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--accent-glow)] gsap-work-card"
      style={{ background: "var(--card-bg)" }}
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.tagline} — Meteoric`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] gsap-work-img"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
            {project.category}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-display text-[var(--text-primary)] mb-2 tracking-tight leading-snug">
          {project.name}
        </h2>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-2">
          {project.tagline}
        </p>

        <div className="mt-auto flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <StaggerText>View Case Study</StaggerText>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

export default function WorkPage() {
  trackEvent("case_study_view", {
    case_study_name: "Portfolio — SaaS & Web Development Projects",
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        headingRef.current?.querySelectorAll(".split-line").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        return;
      }

      const split = new SplitText(headingRef.current, {
        type: "lines",
        linesClass: "split-line",
      });
      gsap.fromTo(
        split.lines,
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
        cardsRef.current?.querySelectorAll(".gsap-work-card"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        },
      );

      const imgs = cardsRef.current?.querySelectorAll(".gsap-work-img");
      imgs?.forEach((img) => {
        gsap.set(img, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(img, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none reverse none",
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <div
      className="min-h-screen text-[var(--text-primary)] overflow-x-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <section
        ref={sectionRef}
        className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24"
      >
        {/* Header */}
        <div ref={headingRef} className="mb-12">
          <p className="text-[var(--text-secondary)] uppercase tracking-[0.2em] text-xs mb-5">
            <span className="font-display text-[var(--text-muted)] not-italic mr-2">
              01
            </span>
            Portfolio
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.05] tracking-tight max-w-4xl">
            Our Work — SaaS & Web Development Projects
          </h1>
          <p className="text-[var(--text-muted)] text-base md:text-lg max-w-2xl mt-6">
            Every project here went from concept to production — on time, on
            budget, and built to convert.{" "}
            <Link
              href="/services"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-color)] hover:decoration-[var(--text-secondary)] transition-all duration-200"
            >
              Explore our services
            </Link>
            .
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ring-1 ${
                activeCategory === cat
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] ring-transparent"
                  : "text-[var(--text-secondary)] ring-[var(--border-color)] hover:ring-[var(--border-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
