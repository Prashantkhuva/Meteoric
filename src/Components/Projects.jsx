import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Habit Flow",
    tagline: "Build habits. Track streaks. Stay consistent.",
    description:
      "A full-stack SaaS habit tracking application built for people who want to build better daily routines. Features include streak tracking, weekly analytics, reminder notifications, and a clean dashboard to visualize progress over time.",
    link: "https://habit-flow-ten-beta.vercel.app/",
    image: "/habit-flow.png",
    gradient: "from-violet-950 to-indigo-900",
    accent: "#7c6aff",
    tags: ["React", "Node.js", "MongoDB", "Express", "JWT Auth"],
    features: [
      "Streak tracking with daily check-ins",
      "Weekly analytics and progress charts",
      "Reminder notifications system",
      "Full authentication with JWT",
      "Mobile-responsive dashboard",
    ],
  },
  {
    id: 2,
    name: "MegaBlog",
    tagline: "A dark editorial blogging platform.",
    description:
      "A premium blog platform built with React 19 and Appwrite backend. Features a rich TinyMCE editor, full CRUD for posts, Redux Toolkit state management, and a dark editorial aesthetic with Framer Motion animations throughout.",
    link: "https://mega-blog-prashantkhuvas-projects.vercel.app/",
    image: "/megablog.png",
    gradient: "from-amber-950 to-stone-900",
    accent: "#c8a97e",
    tags: ["React", "Appwrite", "Redux Toolkit", "TinyMCE", "Framer Motion"],
    features: [
      "Rich text editor with TinyMCE",
      "Full CRUD — create, edit, delete posts",
      "Appwrite backend with file storage",
      "Redux Toolkit global state management",
      "Dark editorial UI with smooth animations",
    ],
  },
  {
  id: 3,
  name: "Mobile Preview Simulator",
  tagline: "Preview responsive mobile screens directly inside VS Code.",
  description:
    "A VS Code extension that helps developers preview responsive mobile layouts without leaving the editor. Built for frontend developers who want faster UI testing workflows with a clean in-editor mobile simulation experience.",
  link: "https://marketplace.visualstudio.com/items?itemName=Prashantkhuva.mobile-preview-simulator",
  image: "/mobile-simulator.png",
  gradient: "from-sky-950 to-cyan-900",
  accent: "#38bdf8",
  tags: [
    "VS Code Extension",
    "JavaScript",
    "Webview API",
    "Frontend Tools",
    "Responsive Design",
  ],
  features: [
    "Preview mobile layouts directly in VS Code",
    "Responsive testing without browser switching",
    "Clean embedded mobile simulator UI",
    "Fast workflow for frontend developers",
    "Lightweight and developer-focused experience",
  ],
},
];

// Desktop card — full height with image inside gradient bg
function ProjectCardDesktop({ project, isActive }) {
  return (
    <div
      onClick={() => window.open(project.link, "_blank")}
      className={`block rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group ${
        isActive ? "ring-1 ring-white/20" : ""
      }`}
    >
      <div
        className={`bg-gradient-to-b ${project.gradient} flex flex-col w-full min-h-[500px] relative`}
      >
        {/* Top overlay — title + arrow button */}
        <div className="absolute top-0 left-0 right-0 z-10 p-8">
          <div className="text-white flex flex-row items-start justify-between text-xl font-bold">
            <span className="max-w-[70%] leading-snug">{project.tagline}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.link, "_blank");
              }}
              className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-5 py-2.5 hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100 duration-300"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1 overflow-hidden rounded-2xl flex items-center justify-center mt-20 mx-4 mb-4">
          <motion.img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-contain p-4"
            style={{ position: "absolute", inset: 0 }}
            whileHover={{ rotate: -3, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Mobile card — image on top, info below
function ProjectCardMobile({ project }) {
  const [showAll, setShowAll] = useState(false);
  const visibleTags = showAll ? project.tags : project.tags.slice(0, 4);
  const extraCount = project.tags.length - 4;

  return (
    <div
      className={`bg-gradient-to-b ${project.gradient} rounded-xl overflow-hidden`}
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
        <p className="text-sm text-white/60 mb-3">{project.tagline}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {visibleTags.map((tag) => (
            <div
              key={tag}
              className="rounded-full py-1 px-2 flex items-center gap-1 border border-white/20 bg-black/30"
            >
              <span className="text-xs font-medium text-white">{tag}</span>
            </div>
          ))}
          {!showAll && extraCount > 0 && (
            <div className="rounded-full py-1 px-2 flex items-center border border-white/20 bg-black/30">
              <span className="text-xs font-medium text-white">
                +{extraCount}
              </span>
            </div>
          )}
        </div>

        {/* Show more */}
        {extraCount > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center text-xs text-white/50 font-medium mt-2 mb-4"
          >
            {showAll ? "Show less" : "Show more"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`ml-1 transition-transform ${showAll ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}

        {/* View project button */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex justify-center items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm w-full py-2.5 text-sm font-medium text-white transition-colors"
        >
          View Project <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}

function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observers = projects.map((_, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { threshold: 0.5 },
      );
      if (sectionRefs.current[i]) observer.observe(sectionRefs.current[i]);
      return observer;
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const active = projects[activeIndex];

  return (
    <section id="work" className="bg-[#0c0c0c] py-24 px-6 md:px-16">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <p className="text-white/30 uppercase tracking-widest text-xs mb-3">
          Selected Work
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Projects that <span className="text-white/30">actually shipped.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* LEFT — scrollable cards */}
        <div className="w-full md:w-1/2 space-y-8">
          {projects.map((project, i) => (
            <div key={project.id} ref={(el) => (sectionRefs.current[i] = el)}>
              {/* Mobile */}
              <div className="md:hidden">
                <ProjectCardMobile project={project} />
              </div>

              {/* Desktop */}
              <div className="hidden md:flex items-start py-12 h-180">
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

        {/* RIGHT — sticky detail panel (desktop only) */}
        <div className="hidden md:block md:w-1/2">
          <div className="sticky top-32 py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-8 rounded-2xl  bg-black"
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
                <p className="text-white/50 text-sm leading-relaxed mb-8">
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
                        className="mt-1 text-sm font-bold"
                        style={{ color: active.accent }}
                      >
                        +
                      </span>
                      <p className="text-white/50 text-sm">{f}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {active.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => window.open(active.link, "_blank")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  View Live Project <ArrowUpRight size={16} />
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
