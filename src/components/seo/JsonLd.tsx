import { serializeJsonLd } from "@/lib/seo/jsonLd";

/** Mirrors the `JsonLd` JSDoc typedef in `src/lib/seo/jsonLd.ts`. */
type JsonLd = Record<string, unknown>;

/**
 * Server component that renders a JSON-LD script tag with XSS-safe
 * serialization (see serializeJsonLd). Use this instead of raw
 * `dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }}`.
 *
 * @param {{ data: import("@/lib/seo/jsonLd").JsonLd }} props
 */
export default function JsonLd({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
