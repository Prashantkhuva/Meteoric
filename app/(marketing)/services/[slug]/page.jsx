import { notFound } from "next/navigation";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo/config";
import { buildFaqJsonLd } from "@/lib/seo/jsonLd";
import ServiceLanding from "@/components/pages/ServiceLanding";

const serviceData = {
  "saas-development": {
    title: "SaaS Development Agency — Build & Scale Your SaaS Product | Meteoric",
    desc: "Meteoric is a SaaS development agency that ships MVPs in 3–6 weeks. Full-stack SaaS development with Next.js, Supabase, Stripe. Founder-led, production-ready.",
    h1: ["SaaS", "Development"],
    tagline: "From idea to production SaaS — MVP in weeks, not months.",
    sections: [
      {
        heading: "We build SaaS like a product studio",
        body: "Founder-level involvement, no account managers. We handle the entire lifecycle — from database schema to subscription billing to deployment. You get a production-ready SaaS platform, not a prototype.",
      },
      {
        heading: "What we ship",
        body: "Auth & user management, dashboard interfaces, subscription billing (Stripe), real-time features, API integrations, admin panels, and analytics. Every project includes performance optimization, SEO foundations, and post-launch support.",
      },
      {
        heading: "Our process",
        body: "Week 1: Scope & architect (database, API, auth flows). Weeks 2–4: Build & ship MVP. Week 5–6: Polish, deploy, and handoff. Weekly updates, transparent communication, no surprises.",
      },
    ],
    faqs: [
      { q: "How long does it take to build a SaaS MVP?", a: "Most SaaS MVPs ship in 3–6 weeks. Timeline depends on feature complexity, third-party integrations, and design requirements. We give you a precise timeline after the free strategy call." },
      { q: "What tech stack do you use for SaaS?", a: "Next.js, React, Supabase (PostgreSQL), Stripe, Tailwind CSS, and Framer Motion. We adapt to your existing stack if needed." },
      { q: "Can you add features after the MVP launches?", a: "Yes. Every project includes post-launch support. We treat each product as a long-term partnership and iterate based on real user feedback." },
      { q: "How is Meteoric different from other SaaS agencies?", a: "Direct founder involvement, no account managers, 10-day sprint cycles, and a track record of 12+ production projects with 100% client satisfaction." },
    ],
  },
  "startup-web-development": {
    title: "Startup Web Development Agency — Websites That Convert | Meteoric",
    desc: "Meteoric is a startup web development agency. We build high-performance websites, landing pages, and web apps for early-stage startups. Next.js, modern stack, fast delivery.",
    h1: ["Startup Web", "Development"],
    tagline: "Your startup's website ships in days, not quarters.",
    sections: [
      {
        heading: "Built for startups",
        body: "Speed matters. We build high-performance websites that load fast, convert visitors, and scale with your startup. No bloated CMS, no unnecessary dependencies — just clean, modern code.",
      },
      {
        heading: "What we deliver",
        body: "Marketing websites, landing pages, documentation sites, and web applications. Every project includes SEO foundations, performance optimization, mobile responsiveness, and analytics setup.",
      },
      {
        heading: "Typical timeline",
        body: "Landing pages: 3–7 days. Multi-page websites: 1–3 weeks. Web applications: 2–6 weeks. We work in 10-day sprints with weekly updates so you're never in the dark.",
      },
    ],
    faqs: [
      { q: "How much does a startup website cost?", a: "Landing pages start at a fixed price and deliver in 3–7 days. Multi-page websites and web applications are scoped per project. Contact us for a free quote based on your specific needs." },
      { q: "Do you work with pre-seed startups?", a: "Yes. We specialize in helping early-stage startups launch their first website or MVP. Our process is designed for founders who need to move fast without sacrificing quality." },
      { q: "Can I update the website myself after launch?", a: "Yes. We build on Next.js with a clean, documented codebase. We'll walk you through the basics or set up a simple CMS if needed. Post-launch support is included." },
    ],
  },
  "nextjs-development": {
    title: "Next.js Development Agency — React & Next.js Experts | Meteoric",
    desc: "Meteoric is a Next.js development agency. We build high-performance React and Next.js applications — from landing pages to full-stack SaaS platforms. SEO, speed, and scalability baked in.",
    h1: ["Next.js", "Development"],
    tagline: "React and Next.js. The right stack for modern web products.",
    sections: [
      {
        heading: "Why Next.js",
        body: "Server-side rendering, static generation, API routes, and React Server Components — Next.js gives you the performance of static with the power of dynamic. We've shipped 12+ production Next.js applications.",
      },
      {
        heading: "What we build with Next.js",
        body: "Marketing websites with SSR/SSG, SaaS dashboards with real-time data, e-commerce fronts, API backends, and full-stack applications. Every project gets SEO-optimized metadata, image optimization, and fast Lighthouse scores.",
      },
      {
        heading: "Our expertise",
        body: "App Router, Server Components, Server Actions, middleware, route handlers, and streaming. We stay current with the latest Next.js features and React 19 patterns. Your project ships on the latest stable version.",
      },
    ],
    faqs: [
      { q: "Why choose Next.js for my project?", a: "Next.js combines the best of static sites and dynamic servers. You get fast load times, great SEO, and the ability to add real-time features, auth, and APIs — all in one framework." },
      { q: "Do you migrate existing sites to Next.js?", a: "Yes. We've migrated WordPress, plain React, and other frameworks to Next.js. The result is typically 2–3x faster page loads and significantly better SEO performance." },
      { q: "Can you build the backend with Next.js too?", a: "Yes. Next.js API routes and Server Actions can handle backend logic, database operations, and third-party integrations. For complex backends, we pair Next.js with Supabase or Node.js." },
    ],
  },
  "web-applications": {
    title: "Custom Web Application Development — Dashboards & Tools | Meteoric",
    desc: "Meteoric builds custom web applications — dashboards, internal tools, and customer-facing platforms. React, Next.js, Node.js, Supabase. Built to perform at scale.",
    h1: ["Web", "Applications"],
    tagline: "Custom web apps that are fast, reliable, and a pleasure to use.",
    sections: [
      {
        heading: "Purpose-built applications",
        body: "Dashboards, internal tools, customer portals, admin panels — whatever your business needs. We design and build web applications with clean UI, solid architecture, and real-time capabilities.",
      },
      {
        heading: "What's included",
        body: "User authentication, role-based access, real-time data, file uploads, search, filtering, data export, and API integrations. Every app is built with performance monitoring and error tracking from day one.",
      },
      {
        heading: "Tech stack",
        body: "Frontend: React, Next.js, Tailwind CSS. Backend: Node.js, Supabase, PostgreSQL. Auth: Supabase Auth or custom JWT. Deployment: Vercel with automated CI/CD. Monitoring: error tracking and analytics baked in.",
      },
    ],
    faqs: [
      { q: "What kind of web applications do you build?", a: "Dashboards, internal tools, customer portals, data visualization platforms, booking systems, and more. If it runs in a browser, we can build it." },
      { q: "Can you integrate with existing APIs or services?", a: "Yes. We've integrated Stripe, Resend, Cal.com, Supabase, and custom APIs. We adapt to your existing infrastructure and third-party services." },
      { q: "Do you build mobile-responsive web apps?", a: "Every web app we build is fully responsive across desktop, tablet, and mobile. We design mobile-first and test across real devices before launch." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) return {};
  return {
    title: service.title,
    description: service.desc,
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
    openGraph: {
      title: service.title,
      description: service.desc,
      url: `${SITE_URL}/services/${slug}`,
      images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1635, height: 962, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prashantkhuva_",
      creator: "@prashantkhuva_",
      title: service.title,
      description: service.desc,
      images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) notFound();

  const faqJsonLd = buildFaqJsonLd(service.faqs);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.h1.join(" "), item: `${SITE_URL}/services/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ServiceLanding service={service} />
    </>
  );
}
