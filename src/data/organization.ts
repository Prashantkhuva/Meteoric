import { SITE_NAME } from "@/lib/seo/config";
import type { FounderDetails, FounderProfile, OrganizationDetails } from "./types";
import { socialProfiles, socialUrls } from "./social";

/**
 * Organization + founder facts for JSON-LD (Organization in root layout,
 * Person on /about). Values are the exact strings already published —
 * structure of each schema stays with its page, data lives here.
 */

export const organization: OrganizationDetails = {
  name: SITE_NAME,
  logo: "/m.png",
  image: "/og.jpg",
  description:
    "Meteoric is a software development studio that builds high-performance websites, SaaS platforms, and full-stack applications for startups and founders.",
  foundingDate: "2026",
  areaServed: "Worldwide",
  contactEmail: "contact@withmeteoric.com",
  wikidataUrl: "https://www.wikidata.org/wiki/Q140453413",
  knowsAbout: [
    "Web Development",
    "SaaS Development",
    "React Development",
    "Next.js Development",
    "Node.js Development",
    "Full-Stack Development",
    "Landing Page Design",
    "Startup Web Development",
  ],
  sameAs: [...socialUrls, "https://www.wikidata.org/wiki/Q140453413"],
};

export const founder: FounderDetails = {
  name: "Prashant Khuva",
  jobTitle: "Founder & Full-Stack Developer",
  description:
    "Founder of Meteoric, a product development studio. Full-stack developer with expertise in React, Next.js, Node.js, and the MERN stack. Previously built FullStack Craft.",
  githubUrl: "https://github.com/Prashantkhuva",
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "MERN Stack",
    "SaaS Development",
    "Web Development",
    "Full-Stack Development",
    "Product Design",
  ],
};

/** Person sameAs for /about: personal GitHub first, then company socials. */
export const founderSameAs: string[] = [
  founder.githubUrl,
  ...socialProfiles.filter((p) => p.id !== "github").map((p) => p.url),
];

/**
 * Founder profile links shown on /about — hand-maintained, separate from
 * company socials (src/data/social.ts). URLs below verified by Prashant
 * (2026-09-29): founder GitHub + LinkedIn, X, Instagram, Contra all live.
 *
 * PLACEHOLDER (manually verified before display — components skip null):
 * TODO(Prashant): set `url` after verifying the profile exists:
 *   - clutch:   e.g. https://www.clutch.co/profile/<handle> (only if claimed)
 * A `url: null` entry never renders to users.
 */
export const founderProfiles: FounderProfile[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/Prashantkhuva",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/prashantkhuva",
  },
  {
    id: "twitter",
    label: "X",
    url: "https://x.com/prashantkhuva_",
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/officialmeteoric/",
  },
  {
    id: "contra",
    label: "Contra",
    url: "https://contra.com/prashant_khuva_nbilfy3b",
  },
];
