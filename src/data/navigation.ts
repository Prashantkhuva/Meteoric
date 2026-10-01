import type { FooterLinkColumn, NavLink } from "./types";

/**
 * Navigation link data — header nav + footer link columns.
 * Labels/URLs are exact copies of the previously inline values; each surface
 * renders from here so link text never drifts between navbar and footer.
 */

export const headerNavLinks: NavLink[] = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact", to: "/contact" },
];

export const footerColumns: FooterLinkColumn[] = [
  {
    heading: "Services",
    links: [
      { label: "Landing Pages", to: "/services/landing-pages" },
      { label: "SaaS Development", to: "/services/saas-development" },
      { label: "Web Apps", to: "/services/web-applications" },
      { label: "Full-Stack", to: "/services/nextjs-development" },
    ],
  },
  {
    heading: "Popular Services",
    links: [
      { label: "SaaS MVP Development", to: "/saas-mvp-development" },
      { label: "Next.js Development Agency", to: "/nextjs-development-agency" },
      { label: "Startup Landing Page Design", to: "/startup-landing-page-design" },
      { label: "Web App Development", to: "/web-app-development" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Work", to: "/work" },
      { label: "Case Studies", to: "/case-studies" },
      { label: "About", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];
