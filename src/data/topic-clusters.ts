/**
 * Topic clusters — hub-and-spoke internal linking for the blog.
 * Each post in a cluster renders a series box linking the hub, its siblings,
 * and the matching service page. A slug must belong to at most one cluster.
 */
export interface TopicCluster {
  id: string;
  name: string;
  /** Pillar post every member links back to. */
  hub: string;
  members: string[];
  service: { href: string; label: string };
}

export const topicClusters: TopicCluster[] = [
  {
    id: "saas-mvp",
    name: "Building a SaaS MVP",
    hub: "how-to-build-a-saas-mvp-step-by-step-guide",
    members: [
      "saas-mvp-development-cost",
      "how-to-scope-a-saas-prototype-to-ship-in-weeks",
      "what-is-a-saas-development-agency",
      "the-meteoric-guide-to-choosing-your-tech-stack",
      "mongodb-vs-postgresql-for-saas",
      "supabase-vs-firebase-2026-comparison",
      "mongodb-schema-design-for-saas-billing",
    ],
    service: { href: "/saas-mvp-development", label: "SaaS MVP development" },
  },
  {
    id: "nextjs-frontend",
    name: "Next.js and frontend for startups",
    hub: "react-vs-nextjs-for-startup-websites",
    members: [
      "nextjs-vs-remix-2026-comparison",
      "nextjs-seo-guide",
      "gsap-vs-framer-motion-production-guide",
      "high-converting-landing-page-structure-for-saas",
      "conversion-focused-web-design-beyond-pretty-ui",
      "why-visitors-leave-your-website-issues-and-solutions",
    ],
    service: {
      href: "/nextjs-development-agency",
      label: "Next.js development",
    },
  },
  {
    id: "cost-hiring",
    name: "Web development cost and hiring",
    hub: "how-much-does-it-cost-to-build-a-web-app",
    members: [
      "how-much-does-a-startup-website-cost",
      "freelance-vs-agency-vs-in-house",
      "how-to-choose-a-web-development-agency",
      "what-is-a-web-development-agency",
      "no-code-vs-custom-development",
    ],
    service: { href: "/web-app-development", label: "Web app development" },
  },
  {
    id: "startup-seo",
    name: "SEO and AI search for startups",
    hub: "startup-seo-on-a-budget-what-to-do-first",
    members: [
      "complete-website-audit-checklist-for-startups",
      "long-tail-seo-strategy-for-funded-startups",
      "how-to-implement-aeo-answer-engine-optimization-for-saas",
      "ai-search-optimization-how-to-get-cited-by-chatgpt",
    ],
    service: {
      href: "/services/startup-web-development",
      label: "Startup web development",
    },
  },
];

export function getClusterForSlug(slug: string): TopicCluster | undefined {
  return topicClusters.find((c) => c.hub === slug || c.members.includes(slug));
}
