export const caseStudies = [
  {
    slug: "letem-know",
    name: "Let'em Know",
    tagline: "Premium agency site with GSAP animations & smooth scroll.",
    client: "Let'em Know — Gurgaon-based marketing agency",
    timeline: "4 weeks",
    role: "Full-stack development, animation engineering",
    metaTitle: "Let'em Know — Premium Agency Website Case Study | Meteoric",
    metaDescription:
      "How Meteoric built a high-performance marketing agency website with canvas particle hero, GSAP scroll animations, Lenis smooth scroll, and Calendly booking flow.",
    problem:
      "The project focused on building a modern, responsive marketing website with richer visual interactions and a clearer path from browsing to booking a call.",
    approach:
      "Built a modern agency site with a focus on motion, scroll-driven storytelling, and a booking flow integrated directly into the page.",
    whatWasBuilt:
      "A single-page agency website with a canvas particle system hero animation, GSAP-powered scroll sequences, Lenis smooth scroll integration, infinite-scroll testimonial columns, and a Calendly popup contact flow. The entire site is built with React and Tailwind CSS.",
    productDecisions: [
      "The hero uses a canvas particle system — particles respond to scroll position and mouse movement, creating an interactive first impression",
      "Lenis provides smooth scroll interpolation across the entire page",
      "GSAP ScrollTrigger powers scroll-linked animations — elements reveal and transform as the user scrolls",
      "Infinite-scroll testimonials display social proof without requiring pagination or a separate page",
      "Calendly integration uses their embed API for an in-page modal — no redirect to an external booking page",
    ],
    technicalImplementation:
      "Built with React and styled with Tailwind CSS. The hero uses an HTML5 Canvas element with a custom particle system. GSAP with ScrollTrigger handles scroll-linked animations. Lenis provides smooth scroll interpolation. Framer Motion handles component-level transitions. Calendly integration uses their embed API.",
    features: [
      "Canvas particle system hero with scroll and mouse interaction",
      "GSAP-powered scroll animations with ScrollTrigger",
      "Lenis smooth scroll for cinematic page feel",
      "Infinite-scroll testimonial columns",
      "Calendly popup contact flow — no redirect",
      "Fully responsive across all breakpoints",
    ],
    results: [
      {
        metric: "Load Time",
        value: "Faster",
        description: "vs previous site",
      },
      {
        metric: "Mobile",
        value: "Responsive",
        description: "across all breakpoints",
      },
      {
        metric: "Animation",
        value: "Smooth",
        description: "GSAP-powered scroll",
      },
    ],
    link: "https://agency-v2-theta.vercel.app/",
    image: "/letem-know.png",
    gradient: "from-white/[0.04] to-white/[0.01]",
    accent: "#1c1917",
    tags: ["React", "GSAP", "Framer Motion", "Lenis", "Tailwind CSS", "Calendly"],
    serviceLink: { label: "Landing Page Design", href: "/services/landing-pages" },
    relatedProjects: ["habit-flow", "megablog"],
  },
  {
    slug: "habit-flow",
    name: "Habit Flow",
    tagline: "Build habits. Track streaks. Stay consistent.",
    client: "SaaS habit-tracking application",
    timeline: "3 weeks (MVP)",
    role: "Full-stack development, product strategy",
    metaTitle: "Habit Flow — Full-Stack SaaS MVP Case Study | Meteoric",
    metaDescription:
      "How Meteoric shipped a full-stack habit tracking SaaS MVP in 3 weeks with streak tracking, analytics, reminders, and 200+ beta users.",
    problem:
      "The project required a production-ready MVP with authentication, persistent data, analytics, and a clean dashboard — shipped quickly enough to test with real users and validate the concept.",
    approach:
      "Shipped the core loop first — create habit, check in, track streak — then layered analytics, reminders, and polish on top.",
    whatWasBuilt:
      "A full-stack SaaS application with user authentication, habit CRUD, daily check-in flow, streak tracking engine, weekly analytics dashboard, and reminder notifications. The backend is a Node.js/Express API with MongoDB persistence. The frontend is a React single-page application with a responsive dashboard.",
    productDecisions: [
      "Authentication uses JWT tokens — stateless, works across devices without server-side session storage",
      "MongoDB stores application data — document-based persistence for the habit and user data layer",
      "Streak tracking and check-in validation run server-side in the API",
      "Weekly analytics are computed on read from stored habit data",
      "Reminder notifications implemented as a lightweight notification layer",
      "Responsive dashboard designed for mobile use — habit tracking is a daily-use product",
    ],
    technicalImplementation:
      "Backend: Node.js with Express REST API. MongoDB for data persistence. JWT for authentication. Frontend: React single-page application. The API follows RESTful conventions with protected routes requiring valid JWT tokens.",
    features: [
      "Full authentication with JWT — signup, login, token refresh",
      "Habit CRUD — create, edit, delete habits with custom categories",
      "Daily check-in flow with streak tracking",
      "Weekly analytics dashboard with progress charts",
      "Reminder notifications system",
      "Mobile-responsive dashboard — designed for daily mobile use",
    ],
    results: [
      {
        metric: "Timeline",
        value: "3 weeks",
        description: "concept to MVP launch",
      },
      {
        metric: "Beta Users",
        value: "200+",
        description: "validated with real users",
      },
    ],
    link: "https://habitflow.indevs.in/",
    image: "/habit-flow.png",
    gradient: "from-white/[0.04] to-white/[0.01]",
    accent: "#1c1917",
    tags: ["React", "Node.js", "MongoDB", "Express", "JWT Auth"],
    serviceLink: {
      label: "SaaS Development",
      href: "/services/saas-development",
    },
    relatedProjects: ["megablog", "mobile-preview-simulator"],
  },
  {
    slug: "megablog",
    name: "MegaBlog",
    tagline: "A dark editorial blogging platform.",
    client: "Blog / editorial platform",
    timeline: "5 weeks",
    role: "Full-stack development, UI/UX design",
    metaTitle: "MegaBlog — Editorial Blog Platform Case Study | Meteoric",
    metaDescription:
      "How Meteoric built MegaBlog: a React 19 + Appwrite editorial platform with TinyMCE rich text editing, full CRUD, and dark editorial design.",
    problem:
      "The project required a fast, minimal editorial platform where writers could publish posts quickly — with a rich text editor, image support, and a clean writing environment.",
    approach:
      "Built a purpose-fit editorial platform: rich text editing with TinyMCE, Appwrite backend for auth and storage, Redux Toolkit for state management. The focus was on making the publish flow as fast as possible.",
    whatWasBuilt:
      "A full-stack blog platform with a dark editorial aesthetic. Writers get a rich TinyMCE editor with formatting controls, image upload, and draft management. Posts are stored in Appwrite with file storage for images. The platform supports full CRUD operations — create, edit, delete, and publish posts. A Redux Toolkit store manages global state across the editorial workflow.",
    productDecisions: [
      "TinyMCE provides the rich text editing interface — formatting controls, image embedding, and draft management",
      "Appwrite handles authentication, database, and file storage — posts stored as Appwrite documents, images in Appwrite Storage",
      "Redux Toolkit manages global state — editorial workflows involve cross-component state for drafts, published posts, and editing mode",
      "Framer Motion handles page and component transitions — keeps the reading experience fluid",
      "Dark editorial aesthetic throughout the UI",
    ],
    technicalImplementation:
      "Frontend: React 19. TinyMCE for rich text editing. Redux Toolkit for state management. Framer Motion for page and component transitions. Backend: Appwrite for authentication, database, and file storage. Posts stored as Appwrite documents. Images uploaded to Appwrite Storage buckets.",
    features: [
      "Rich text editor with TinyMCE — formatting, images, drafts",
      "Full CRUD — create, edit, delete, publish posts",
      "Appwrite backend with file storage for images",
      "Redux Toolkit global state management",
      "Dark editorial UI with smooth Framer Motion transitions",
      "Responsive design — readable on all screen sizes",
    ],
    results: [
      {
        metric: "Publishing",
        value: "Hours to minutes",
        description: "workflow improvement",
      },
      {
        metric: "Turnaround",
        value: "Faster",
        description: "article editing cycle",
      },
      {
        metric: "Tech Stack",
        value: "React 19",
        description: "modern, maintainable codebase",
      },
    ],
    link: "https://megablog.vercel.app/",
    image: "/megablog.png",
    gradient: "from-white/[0.04] to-white/[0.01]",
    accent: "#1c1917",
    tags: ["React", "Appwrite", "Redux Toolkit", "TinyMCE", "Framer Motion"],
    serviceLink: {
      label: "Web Application Development",
      href: "/services/web-applications",
    },
    relatedProjects: ["habit-flow", "lete-em-know"],
  },
  {
    slug: "mobile-preview-simulator",
    name: "Mobile Preview Simulator",
    tagline: "Preview responsive mobile screens directly inside VS Code.",
    client: "Developer tool — VS Code Marketplace",
    timeline: "1 week",
    role: "VS Code extension development",
    metaTitle:
      "Mobile Preview Simulator — VS Code Extension Case Study | Meteoric",
    metaDescription:
      "How Meteoric built a VS Code extension for previewing responsive mobile layouts directly in the editor — 500+ installs, 4.5-star rating.",
    problem:
      "Frontend developers switch between editor and browser to test responsive layouts. This project aimed to bring mobile preview directly into the editor to reduce that context switching.",
    approach:
      "Built a VS Code extension using the Webview API — embed a mobile-sized viewport directly in the editor sidebar. Keep it lightweight and require no configuration.",
    whatWasBuilt:
      "A VS Code extension that renders a mobile device frame inside the editor sidebar. Developers configure viewport dimensions, and the extension displays a live preview of their web content at mobile sizes. The extension uses VS Code's Webview API to create an isolated browser context within the editor.",
    productDecisions: [
      "The extension uses the VS Code Webview API to render the mobile preview inside the editor sidebar",
      "No configuration required — extension works with sensible mobile defaults out of the box",
      "Lightweight architecture with no heavy dependencies",
      "Viewport controls live in the sidebar — developers resize without leaving their code",
      "Published on the VS Code Marketplace for discoverable, one-click installation",
    ],
    technicalImplementation:
      "VS Code Extension API for extension lifecycle and contribution points. Webview API for rendering the mobile preview iframe. JavaScript for extension logic. Package manifest (package.json) defines activation events, commands, and contribution points. Published via vsce to the VS Code Marketplace.",
    features: [
      "Preview mobile layouts directly in VS Code sidebar",
      "Responsive testing without browser switching",
      "Configurable viewport dimensions",
      "Clean embedded mobile simulator UI",
      "Lightweight — no heavy dependencies",
      "One-click install from VS Code Marketplace",
    ],
    results: [
      { metric: "Installs", value: "500+", description: "VS Code Marketplace" },
      {
        metric: "Rating",
        value: "4.5 stars",
        description: "user satisfaction",
      },
      {
        metric: "Community",
        value: "Active",
        description: "feature requests & contributions",
      },
    ],
    link: "https://marketplace.visualstudio.com/items?itemName=Prashantkhuva.mobile-preview-simulator",
    image: "/mobile-simulator.png",
    gradient: "from-white/[0.04] to-white/[0.01]",
    accent: "#1c1917",
    tags: [
      "VS Code Extension",
      "JavaScript",
      "Webview API",
      "Frontend Tools",
      "Responsive Design",
    ],
    serviceLink: {
      label: "Custom Software Development",
      href: "/services/startup-web-development",
    },
    relatedProjects: ["lete-em-know", "megablog"],
  },
];
