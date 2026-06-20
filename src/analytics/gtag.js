import { GA_MEASUREMENT_ID } from "./measurementId.js";

let initialized = false;

/**
 * Loads gtag.js and configures GA4. Call once at app startup in production only.
 */
export function initGtag() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

/**
 * Sends a page_view for SPA navigations (and initial route after mount).
 * Uses the recommended GA4 event so we don't re-run full config on each route.
 */
export function trackPageView(pagePath) {
  if (process.env.NODE_ENV !== "production" || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}
