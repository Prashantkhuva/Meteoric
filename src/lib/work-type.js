/**
 * Work-classification labels + disclosure copy shared by the Work index
 * and the case-study template. A disclosure renders only for non-client
 * work (internal, concept, open-source) — client work needs none.
 */

/** @type {Record<string, string>} */
export const WORK_TYPE_LABELS = {
  client: "Client work",
  internal: "Internal product",
  concept: "Concept project",
  "open-source": "Open-source project",
};

/** Prominent disclosure shown on the case-study page for non-client work. */
/** @type {Record<string, string>} */
export const WORK_TYPE_DISCLOSURES = {
  internal:
    "Disclosure: this is an internal product built and owned by Meteoric — not a client engagement. Metrics describe this build only.",
  concept:
    "Disclosure: this is a concept project designed and built by Meteoric to explore an idea — not a client engagement. Metrics describe this build only.",
  "open-source":
    "Disclosure: this is an open-source project with publicly available source code — not a client engagement. Metrics describe this build only.",
};

/**
 * @param {string | undefined} workType
 * @returns {string | null} label for cards/badges, null when unclassified.
 */
export function workTypeLabel(workType) {
  if (!workType) return null;
  return WORK_TYPE_LABELS[workType] ?? null;
}

/**
 * @param {string | undefined} workType
 * @returns {string | null} disclosure text, null for client work / unclassified.
 */
export function workTypeDisclosure(workType) {
  if (!workType || workType === "client") return null;
  return WORK_TYPE_DISCLOSURES[workType] ?? null;
}
