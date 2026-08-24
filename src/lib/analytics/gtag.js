import { GA_MEASUREMENT_ID } from "./measurementId.js";

let initialized = false;

/**
 * Loads gtag.js and configures GA4. Call once at app startup in production only.
 */
export function initGtag() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const load = () => {
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
  };

  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(load, { timeout: 5000 });
  } else {
    setTimeout(load, 3500);
  }
}

/**
 * Safely fires a GA4 event, checking if gtag exists before calling.
 * Wraps window.gtag('event', ...) to avoid errors if analytics hasn't loaded
 * or ad blockers are active.
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
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
