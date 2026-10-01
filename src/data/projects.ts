import type { Project } from "./types";

// Content rules (verified 2026-09-29):
// - liveUrlVerified: all four URLs fetched HTTP 200 with matching titles.
// - workType only where evidence is clear; habit-flow + megablog left
//   unset (TODO(content): classify before relying on disclosure/badge).
// - No invented metrics. mobile-preview-simulator numbers match the live
//   VS Code Marketplace listing (1,191 installs at verification).

export const projects: Project[] = [
  {
    id: 1,
    slug: "lete-em-know",
    name: "Let'em Know",
    tagline: "Premium agency site with GSAP animations & smooth scroll.",
    metaTitle: "Let'em Know | Premium Agency Website Case Study",
    metaDescription:
      "See how Meteoric designed and developed Let'em Know, a modern agency website focused on interaction design, animation, responsive UI, and performance.",
    description:
      "A high-performance agency website built for Let'em Know, a Gurgaon-based marketing agency. Features a canvas particle hero, infinite-scroll testimonials, GSAP-powered animations, Lenis smooth scroll, and a Calendly-integrated contact flow — all shipped production-ready. Outcome: Faster load times vs previous site, seamless mobile experience across all breakpoints.",
    liveUrl: "https://agency-v2-theta.vercel.app/",
    liveUrlVerified: true,
    image: "/letem-know.webp",
    imageAlt:
      "Let'em Know agency website preview with the interactive particle hero section",
    projectType: "Web Design",
    caseStudySlug: "letem-know",
    workType: "client",
    accent: "#1c1917",
    technology: ["React", "GSAP", "Framer Motion", "Lenis", "Tailwind CSS", "Calendly"],
    features: [
      "Canvas particle system hero animation",
      "GSAP-powered scroll animations",
      "Lenis smooth scroll integration",
      "Infinite-scroll testimonial columns",
      "Calendly popup contact flow",
    ],
  },
  {
    id: 2,
    slug: "habit-flow",
    name: "Habit Flow",
    tagline: "Build habits. Track streaks. Stay consistent.",
    metaTitle: "Habit Flow | Habit Tracker Web App Case Study",
    metaDescription:
      "Explore how Meteoric built Habit Flow, a full-stack habit tracking application with authentication, habit management, streaks, analytics, and a modern dashboard.",
    description:
      "A full-stack SaaS habit tracking application built for people who want to build better daily routines. Features include streak tracking, weekly analytics, reminder notifications, and a clean dashboard to visualize progress over time. Outcome: Shipped MVP in 3 weeks, validated concept with 200+ beta users.",
    liveUrl: "https://habitflow.indevs.in/",
    liveUrlVerified: true,
    image: "/habit-flow.webp",
    imageAlt: "Preview of the Habit Flow habit-tracking web app",
    projectType: "SaaS",
    caseStudySlug: "habit-flow",
    // TODO(content): classify — evidence unclear (client | internal | concept).
    accent: "#1c1917",
    technology: ["React", "Node.js", "MongoDB", "Express", "JWT Auth"],
    features: [
      "Streak tracking with daily check-ins",
      "Weekly analytics and progress charts",
      "Reminder notifications system",
      "Full authentication with JWT",
      "Mobile-responsive dashboard",
    ],
  },
  {
    id: 3,
    slug: "megablog",
    name: "MegaBlog",
    tagline: "A dark editorial blogging platform.",
    metaTitle: "MegaBlog Case Study — React + Appwrite",
    metaDescription:
      "How Meteoric built MegaBlog: a full-stack blogging platform with React, Appwrite, and TinyMCE, from auth to editorial UX.",
    description:
      "A premium blog platform built with React 19 and Appwrite backend. Features a rich TinyMCE editor, full CRUD for posts, Redux Toolkit state management, and a dark editorial aesthetic with Framer Motion animations throughout. Outcome: Streamlined content publishing workflow, faster article turnaround for editors.",
    liveUrl: "https://megablog.vercel.app/",
    liveUrlVerified: true,
    image: "/megablog.webp",
    imageAlt: "Preview of the MegaBlog editorial publishing platform",
    projectType: "Web App",
    caseStudySlug: "megablog",
    // TODO(content): classify — evidence unclear (client | internal | concept).
    accent: "#1c1917",
    technology: ["React", "Appwrite", "Redux Toolkit", "TinyMCE", "Framer Motion"],
    features: [
      "Rich text editor with TinyMCE",
      "Full CRUD — create, edit, delete posts",
      "Appwrite backend with file storage",
      "Redux Toolkit global state management",
      "Dark editorial UI with smooth animations",
    ],
  },
  {
    id: 4,
    slug: "mobile-preview-simulator",
    name: "Mobile Preview Simulator",
    tagline: "Preview responsive mobile screens directly inside VS Code.",
    metaTitle: "Mobile Preview Simulator | VS Code Extension",
    metaDescription:
      "Explore Meteoric's Mobile Preview Simulator, a VS Code extension for previewing responsive web interfaces during development.",
    description:
      "A VS Code extension that helps developers preview responsive mobile layouts without leaving the editor. Built for frontend developers who want faster UI testing workflows with a clean in-editor mobile simulation experience. Verified on the VS Code Marketplace (Sept 2026): 1,000+ installs.",
    liveUrl: "https://marketplace.visualstudio.com/items?itemName=Prashantkhuva.mobile-preview-simulator",
    liveUrlVerified: true,
    image: "/mobile-simulator.webp",
    imageAlt:
      "Mobile Preview Simulator extension showing a phone frame preview inside VS Code",
    projectType: "Developer Tools",
    caseStudySlug: "mobile-preview-simulator",
    workType: "internal",
    accent: "#1c1917",
    technology: [
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
