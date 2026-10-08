import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: "noindex, nofollow",
};

import NotFoundPage from "@/components/pages/NotFound";

export default function NotFound() {
  return <NotFoundPage />;
}
