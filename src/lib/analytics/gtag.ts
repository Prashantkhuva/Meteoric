import { GA_MEASUREMENT_ID } from "./measurementId";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

const OUTBOUND_TRACKED_DOMAINS = ["contra.com", "linkedin.com", "github.com", "x.com", "cal.com"];

let clickTrackingBound = false;
let calBookingSuccessRegistered = false;

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Element | null;
  const anchor = target?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const bookingCta = anchor.getAttribute("data-booking-cta");
  if (bookingCta) {
    trackEvent("booking_click", { button_location: bookingCta });
  }

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.hostname === window.location.hostname) return;

  const domain = url.hostname.replace(/^www\./, "");
  const tracked = OUTBOUND_TRACKED_DOMAINS.some(
    (d) => domain === d || domain.endsWith(`.${d}`),
  );
  if (!tracked) return;

  trackEvent("outbound_click", {
    link_domain: domain,
    page_location: window.location.href,
  });
}

function bindClickTracking() {
  if (clickTrackingBound) return;
  clickTrackingBound = true;
  document.addEventListener("click", onDocumentClick);
}

/**
 * Registers the Cal booking-success listener exactly once per session.
 * Call from both CalBooking and CalModal — same namespace, one listener.
 */
export function registerCalBookingSuccess(register: () => void) {
  if (calBookingSuccessRegistered) return;
  calBookingSuccessRegistered = true;
  register();
}

/**
 * Loads gtag.js and configures GA4. Call once at app startup in production only.
 */
export function initGtag() {
  if (initialized || typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;
  initialized = true;
  bindClickTracking();

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

  // Off the critical path: wait for full page load, then an idle slot.
  // Keeps gtag's 78KB parse/execute away from hydration + first scroll.
  const start = () => {
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(load, { timeout: 5000 });
    } else {
      setTimeout(load, 2000);
    }
  };
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}

/**
 * Safely fires a GA4 event, checking if gtag exists before calling.
 * Wraps window.gtag('event', ...) to avoid errors if analytics hasn't loaded
 * or ad blockers are active. Also handles SSR (window may be undefined).
 */
export function trackEvent(eventName: string, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/**
 * Sends a page_view for SPA navigations (and initial route after mount).
 * Uses the recommended GA4 event so we don't re-run full config on each route.
 * Also handles SSR (window may be undefined).
 */
export function trackPageView(pagePath: string) {
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}
