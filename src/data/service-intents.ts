import type { ServiceIntentPage } from "./types";

/**
 * Intent-targeted service landing pages (top-level routes).
 *
 * Copy rules: no invented client results, prices, or rankings; only facts
 * already published in services.ts / faqs.ts / projects.ts / blog-posts.ts.
 * Each page keeps its own wording — no shared filler copy.
 */

export const serviceIntentPages: ServiceIntentPage[] = [
  {
    path: "/saas-mvp-development",
    metadataTitle: "SaaS MVP Development for Founders & Startups",
    metadataDescription:
      "Founder-led SaaS MVP development: scope the core product, build auth, billing, and dashboards, and ship a launch-ready MVP with one dedicated builder.",
    h1: "SaaS MVP development for founders with a product to prove",
    directAnswer:
      "Meteoric is a founder-led SaaS MVP development studio. One engineer scopes your core features, designs the product, builds auth, billing, dashboards, and APIs, and ships a production-ready MVP — most focused MVPs run on a 3–6 week timeline.",
    whoFor: [
      "Pre-seed and seed founders turning an idea into a first working product",
      "Technical founders who want a design and build partner for version one",
      "Non-technical founders who need ideas translated into buildable scope",
      "Teams with a validated concept that now needs to reach real users",
    ],
    deliverables: [
      "Scoped MVP plan — core features agreed before any code is written",
      "User authentication and account management",
      "Subscription billing setup with Stripe when the product needs it",
      "Product dashboard and the core user flows around it",
      "Responsive frontend built with Next.js and Tailwind CSS",
      "Deployment, monitoring setup, and handoff documentation",
    ],
    processSteps: [
      {
        title: "Scope the proof",
        desc: "Free strategy call, then define the smallest feature set that proves your idea. Data model and user flows mapped before development begins.",
      },
      {
        title: "Design the flows",
        desc: "Screens designed around signup, the core action, and the dashboard — reviewed and locked with you before the build.",
      },
      {
        title: "Build in sprints",
        desc: "10-day sprint cycles with weekly demos, so you are clicking through working software the whole way.",
      },
      {
        title: "Launch and iterate",
        desc: "Deploy, monitor, and plan what real-user feedback should change next. Post-launch support is part of the engagement.",
      },
    ],
    technologies: [
      { name: "Next.js", use: "Frontend and API routes" },
      { name: "Supabase", use: "Auth, database, storage" },
      { name: "PostgreSQL", use: "Relational product data" },
      { name: "Stripe", use: "Subscription billing" },
      { name: "Tailwind CSS", use: "UI styling" },
      { name: "Vercel", use: "Hosting and deploys" },
    ],
    fits: [
      "You need one clear first version to put in front of users or investors",
      "The initial scope can be decided in days, not months",
      "You want to work directly with the engineer building the product",
      "A fixed-scope project with a defined starting point works for you",
    ],
    notFits: [
      "You need a large multi-team programme with formal procurement",
      "The first version has to be a native iOS or Android app",
      "You are looking for staff augmentation or hourly contractors",
      "No decision-maker will be available during the build",
    ],
    projectSlugs: ["habit-flow"],
    faqs: [
      {
        question: "What does a SaaS MVP engagement include?",
        answer:
          "A scoped plan for the first version, design of the core screens, authentication, the main user flows, billing if your model needs it, a dashboard, and deployment. Exact scope is confirmed on the free strategy call before anything is built.",
      },
      {
        question: "How do you decide which features go into the first version?",
        answer:
          "We scope around the smallest set of features that proves the product's core value. Everything that does not serve that goal is deferred to post-launch iterations, where real user feedback can prioritize it.",
      },
      {
        question: "Can you start from a design, prototype, or pitch deck?",
        answer:
          "Yes. Bring the artifact to the free strategy call — existing designs, Figma files, or rough prototypes are reviewed during scoping and factored into the MVP plan.",
      },
      {
        question: "What happens after the MVP launches?",
        answer:
          "Post-launch support covers monitoring, fixes, and the next round of features. We treat the first version as the start of a feedback loop, not the end of the project.",
      },
      {
        question: "How do I get a timeline and price for my MVP?",
        answer:
          "Book the free strategy call. Scope is confirmed together, then you receive a fixed project fee and a start date before any work begins — no hourly billing surprises.",
      },
    ],
    insightSlugs: [
      "how-to-build-a-saas-mvp-step-by-step-guide",
      "mongodb-vs-postgresql-for-saas",
      "how-to-implement-aeo-answer-engine-optimization-for-saas",
    ],
    relatedServiceSlug: "saas-development",
    ctaLine:
      "Have an MVP deadline? Book a free strategy call and leave with a scoped plan — no commitment.",
  },

  {
    path: "/nextjs-development-agency",
    metadataTitle: "Next.js Development Agency for Startups & SaaS",
    metadataDescription:
      "Meteoric is a founder-led Next.js development agency: marketing sites, SaaS frontends, and web apps with server rendering and SEO built in from day one.",
    h1: "A Next.js development agency for startups and SaaS products",
    directAnswer:
      "Meteoric is a founder-led Next.js development agency. We design and build marketing sites, SaaS frontends, and full web applications on Next.js — server rendering, routing, and SEO handled as part of the build, not bolted on afterwards.",
    whoFor: [
      "Startups standardizing on Next.js for their marketing site and product",
      "SaaS teams whose current site loads slowly or ranks poorly",
      "Founders who want one team for design, frontend, and backend",
      "Companies planning to migrate an existing React or legacy site",
    ],
    deliverables: [
      "Next.js application built on the App Router",
      "Server-rendered pages with metadata and structured data for SEO",
      "Component system styled with Tailwind CSS",
      "Deliberate motion with GSAP or Framer Motion where it earns its place",
      "API routes or backend integration for forms, auth, and data",
      "Deployment plus a performance pass before launch",
    ],
    processSteps: [
      {
        title: "Architecture first",
        desc: "Routing, data flow, and rendering strategy decided up front: what is static, what is dynamic, what sits behind auth.",
      },
      {
        title: "UI system",
        desc: "Design direction turned into reusable components and pages, with responsive behavior defined at every breakpoint.",
      },
      {
        title: "Build in sprints",
        desc: "10-day sprints with weekly demos — you review real URLs in the browser throughout the project.",
      },
      {
        title: "Launch and hardening",
        desc: "Redirects, metadata, sitemap, and performance tuning finished before go-live, then monitoring from day one.",
      },
    ],
    technologies: [
      { name: "Next.js", use: "Framework, routing, rendering" },
      { name: "React", use: "Component UI" },
      { name: "Tailwind CSS", use: "Styling system" },
      { name: "GSAP", use: "Scroll and hero animation" },
      { name: "Vercel", use: "Hosting and deploys" },
    ],
    fits: [
      "You want one team owning frontend, backend, and deployment",
      "Organic search matters, so SSR and metadata need to be built in",
      "You have an existing React site that should run on Next.js",
      "Design and development have to happen together, not in sequence",
    ],
    notFits: [
      "The primary deliverable is a native mobile app",
      "You only need a design handoff with no implementation",
      "You want a large agency with account managers and workstream layers",
      "The project requires formal enterprise support contracts",
    ],
    projectSlugs: ["megablog", "lete-em-know"],
    faqs: [
      {
        question: "What does Meteoric build with Next.js?",
        answer:
          "Marketing sites, product frontends, and full web applications — pages, API routes, authentication, and database access in one framework. The same build covers content pages that need SEO and app screens that need auth.",
      },
      {
        question: "What does a Next.js migration involve?",
        answer:
          "We map your current routes and content, rebuild the pages on the App Router, carry over titles and metadata, and plan redirects so existing URLs keep working after the switch.",
      },
      {
        question: "How is Next.js different from a plain React app?",
        answer:
          "Next.js adds file-based routing, server rendering, and SEO primitives on top of React. Server-rendered HTML arrives ready for search engines and faster first paint, while React handles the interactive parts in the browser.",
      },
      {
        question: "Do you handle design as well as development?",
        answer:
          "Yes. Design direction is a standard stage of every engagement — wireframes and visual design are reviewed and locked before development starts.",
      },
      {
        question: "Can you take over an existing Next.js codebase?",
        answer:
          "Possibly — walk us through the repository on the free strategy call. We scope review, fixes, and new features around what already exists, and tell you plainly if a rewrite makes more sense.",
      },
    ],
    insightSlugs: [
      "what-is-a-web-development-agency",
      "gsap-vs-framer-motion-production-guide",
      "the-meteoric-guide-to-choosing-your-tech-stack",
    ],
    relatedServiceSlug: "nextjs-development",
    ctaLine:
      "Planning a Next.js build or migration? Book a free strategy call — you leave with an approach, not a pitch deck.",
  },

  {
    path: "/startup-landing-page-design",
    metadataTitle: "Startup Landing Page Design & Development",
    metadataDescription:
      "Founder-led landing page design for startups: one focused, fast page that explains your product, earns trust, and gives visitors a single clear action.",
    h1: "Landing page design for startups preparing to launch",
    directAnswer:
      "Meteoric designs and builds startup landing pages: one focused page that explains the product, shows proof, and gives visitors a single clear action. Designed and coded by the founder of the studio, so what you approve is what ships.",
    whoFor: [
      "Pre-launch startups that need one page before the product is ready",
      "Funded teams running paid traffic that needs somewhere to send it",
      "SaaS founders launching a feature, report, or waitlist",
      "Teams whose current page is a template that never says what the product does",
    ],
    deliverables: [
      "Page structure: message hierarchy, section order, and one primary action",
      "Responsive design in your brand's visual language",
      "Production build in Next.js with clean, accessible markup",
      "Forms wired to your email tool or scheduling link",
      "Analytics installed so conversions can be measured",
      "Launch review for load speed and mobile polish",
    ],
    processSteps: [
      {
        title: "Message first",
        desc: "Goals, audience, and the one action the page must earn — agreed before any design work starts.",
      },
      {
        title: "Design direction",
        desc: "Wireframe to visual design, reviewed with you and locked before code — so the build has no open questions.",
      },
      {
        title: "Build",
        desc: "Responsive implementation with motion kept deliberate: GSAP or Framer Motion only where it serves the story.",
      },
      {
        title: "Launch and measure",
        desc: "Deploy, test on real devices, connect analytics. After go-live you iterate from what visitors actually do.",
      },
    ],
    technologies: [
      { name: "Next.js", use: "Fast, server-rendered page" },
      { name: "Tailwind CSS", use: "Styling and responsive layout" },
      { name: "GSAP", use: "Scroll-driven hero motion" },
      { name: "Framer Motion", use: "UI transitions" },
    ],
    fits: [
      "One product, one audience, one action — a focused page fits",
      "You need it live for a launch, campaign, or fundraising moment",
      "Your brand direction and offer are decided (or ready to be)",
      "You want the same person to design and build the page",
    ],
    notFits: [
      "You need a multi-page marketing site with many templates",
      "The real job is a dashboard or full web application",
      "The product and offer are still undefined — nothing to anchor copy yet",
      "You need ongoing content production rather than a page build",
    ],
    projectSlugs: ["lete-em-know"],
    faqs: [
      {
        question: "How is a landing page different from my main website?",
        answer:
          "A website offers many paths — nav, blog, multiple products. A landing page removes those paths: one message, one audience, one action. That focus is what makes it work for campaigns and launches.",
      },
      {
        question: "What do you need from me to start?",
        answer:
          "What the product is, who it is for, the action the page should drive, and any brand assets you already have. Those inputs are settled on the free strategy call before design begins.",
      },
      {
        question: "Is copywriting included?",
        answer:
          "Page structure and message hierarchy are part of the design work. Full copy can be written by your team or scoped into the project — either way we review it against the page structure before build.",
      },
      {
        question: "Can the page connect to my existing tools?",
        answer:
          "Yes. Forms, email tools, analytics, and scheduling links like Cal.com are wired in during the build, so the page feeds the systems you already use.",
      },
      {
        question: "What happens after the page goes live?",
        answer:
          "Post-launch support covers fixes and refinements, and with analytics in place you can see where visitors drop off and decide what to change first.",
      },
    ],
    insightSlugs: [
      "high-converting-landing-page-structure-for-saas",
      "why-visitors-leave-your-website-issues-and-solutions",
      "startup-seo-on-a-budget-what-to-do-first",
    ],
    relatedServiceSlug: "landing-pages",
    ctaLine:
      "Launching soon? Book a free strategy call and get a page plan — sections, message, and timeline.",
  },

  {
    path: "/web-app-development",
    metadataTitle: "Custom Web App Development for Startups & SaaS",
    metadataDescription:
      "Meteoric builds custom web apps — dashboards, portals, and full-stack products — with Next.js, Node.js, and Postgres. Founder-led from data model to deploy.",
    h1: "Web app development for dashboards, portals, and SaaS products",
    directAnswer:
      "Meteoric builds custom web applications end to end: data model, API, frontend, and deployment. Common builds include SaaS dashboards, internal tools, and client portals — engineered by the founder of the studio, not handed down a chain of teams.",
    whoFor: [
      "SaaS teams whose product has outgrown no-code tools and spreadsheets",
      "Startups building the first production version of a web product",
      "Businesses replacing an internal process with a purpose-built tool",
      "Founders who need frontend and backend delivered as one piece",
    ],
    deliverables: [
      "Data model and API design agreed before UI work begins",
      "Authentication, roles, and account management",
      "Dashboards, tables, and workflows built around real user tasks",
      "Integrations for payments, email, and analytics where needed",
      "Responsive, accessible interface with consistent states",
      "Staged deployment with monitoring in place",
    ],
    processSteps: [
      {
        title: "Model the domain",
        desc: "Data model, permissions, and integration map agreed before UI work — so the app does not fight its own foundations later.",
      },
      {
        title: "Prototype the core",
        desc: "Core screens wired to the real data shape, reviewed as a click-through flow before full build-out.",
      },
      {
        title: "Build in sprints",
        desc: "10-day sprints with weekly demos; features land behind tested APIs so the UI stays stable as scope grows.",
      },
      {
        title: "Ship and support",
        desc: "Launch with monitoring in place. Post-launch support covers fixes, performance, and the next features.",
      },
    ],
    technologies: [
      { name: "Next.js", use: "Frontend and API layer" },
      { name: "React", use: "Interactive UI" },
      { name: "Node.js", use: "Server-side logic" },
      { name: "PostgreSQL", use: "Primary database" },
      { name: "Supabase", use: "Auth and realtime data" },
      { name: "Stripe", use: "Payments and billing" },
    ],
    fits: [
      "The core value of your product lives in an app, not a brochure site",
      "There is a clear first workflow to build and put in users' hands",
      "You want one owner for architecture, UI, and deployment",
      "A fixed first release followed by iteration suits your timeline",
    ],
    notFits: [
      "The primary product needs to be a native mobile app",
      "The work is a simple brochure site with a few pages",
      "You want to hire and manage developers directly",
      "There is no defined first release — scope has no edge",
    ],
    projectSlugs: ["habit-flow", "megablog"],
    faqs: [
      {
        question: "What is the difference between a website and a web app?",
        answer:
          "A website is mostly read; a web app is used — accounts, data that changes per user, and workflows like dashboards or editors. If users log in and act on their own data, it is an app.",
      },
      {
        question: "Can you build internal tools and admin dashboards?",
        answer:
          "Yes. Admin panels, approval flows, data tables, and reporting dashboards are a normal part of the work — often replacing a patchwork of spreadsheets and manual steps.",
      },
      {
        question: "How do integrations with existing systems work?",
        answer:
          "Integration points are identified during architecture — payments, email providers, analytics, and third-party APIs are mapped before build, then implemented and tested as part of sprints.",
      },
      {
        question: "Do you work with an existing backend or database?",
        answer:
          "Often, yes. The codebase and schema are reviewed during scoping, and the build plans around what exists. The tech stack can be adapted rather than replaced when keeping it is the right call.",
      },
      {
        question: "What happens after launch?",
        answer:
          "Monitoring, fixes, and feature iteration are covered by post-launch support. The first release establishes the foundation; subsequent work is prioritized from real usage.",
      },
    ],
    insightSlugs: [
      "supabase-vs-firebase-2026-comparison",
      "mongodb-schema-design-for-saas-billing",
      "the-meteoric-guide-to-choosing-your-tech-stack",
    ],
    relatedServiceSlug: "web-applications",
    ctaLine:
      "Have a workflow to turn into a product? Book a free strategy call and map the first release.",
  },
];

export function getIntentPage(path: string): ServiceIntentPage | undefined {
  return serviceIntentPages.find((p) => p.path === path);
}
