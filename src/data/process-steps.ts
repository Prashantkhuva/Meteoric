import type { ProcessStep } from "./types";

/**
 * Single source of truth for the homepage process steps.
 * Consumed by the visible ProcessSection and the homepage HowTo JSON-LD
 * so the rendered steps and structured data can never drift apart.
 */
export const processSteps: ProcessStep[] = [
  {
    id: "01",
    title: "Kickoff",
    description:
      "We align on your vision, target users, requirements, and goals. You get a clear scope and project timeline before a single line of code is written.",
    tags: ["Discovery call", "Scope doc", "Timeline", "Tech stack"],
  },
  {
    id: "02",
    title: "Design",
    description:
      "Interfaces and user flows designed around clarity, usability, and modern interaction patterns. You review and approve before development begins.",
    tags: ["UX", "UI Systems", "Motion", "Prototyping"],
  },
  {
    id: "03",
    title: "Development",
    description:
      "Frontend and backend systems engineered for performance, scalability, and maintainability. Built with modern tools, tested at every step.",
    tags: ["Frontend", "Backend", "APIs", "CI/CD"],
  },
  {
    id: "04",
    title: "Launch",
    description:
      "Deployment, performance optimization, and final polish. We stay with you through launch and beyond — zero handoffs.",
    tags: ["Testing", "Deployment", "Support", "Monitoring"],
  },
];
