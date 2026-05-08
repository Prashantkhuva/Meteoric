import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./gtag.js";

/**
 * Listens to React Router location changes and reports virtual page views to GA4.
 */
export function AnalyticsRouteListener() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(
      `${location.pathname}${location.search}${location.hash}`,
    );
  }, [location]);

  return null;
}
