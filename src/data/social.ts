import type { SocialProfile } from "./types";

/**
 * Social profiles — single source for Organization sameAs, footer icons,
 * and any future social markup. URLs verified from live footer links.
 */
export const socialProfiles: SocialProfile[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/Meteoric-Agency",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/withmeteoric",
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
];

/** All social URL strings in order. */
export const socialUrls: string[] = socialProfiles.map((p) => p.url);
