import { decideJev } from "./jev";

/**
 * @typedef {Object} DecisionResult
 * @property {"hot"|"warm"|"cold"|"spam"} quality
 * @property {string} suggested_next_status one of VALID_LEAD_STATUSES
 * @property {"web"|"saas"|"mobile"|"other"} service_category
 * @property {{quality: number, suggested_next_status: number, service_category: number}} per_field_confidence
 * @property {number} confidence headline confidence (quality field)
 * @property {string} model pinned model id that was requested
 * @property {string|null} model_version dated snapshot that actually served the request
 */

/**
 * @callback DecisionProvider
 * @param {Record<string, any>} lead raw lead row/fields
 * @returns {Promise<DecisionResult>}
 */

export type DecisionResult = {
  quality: "hot" | "warm" | "cold" | "spam";
  suggested_next_status: string;
  service_category: "web" | "saas" | "mobile" | "other";
  per_field_confidence: {
    quality: number;
    suggested_next_status: number;
    service_category: number;
  };
  confidence: number;
  model: string;
  model_version: string | null;
};

export type DecisionProvider = (
  lead: Record<string, any>,
) => Promise<DecisionResult>;

const PROVIDERS: Record<string, DecisionProvider> = {
  jev: decideJev,
};

export function selectProvider(name: string) {
  const provider = PROVIDERS[name || "jev"];
  if (!provider) throw new Error(`Unknown decision provider: ${name}`);
  return provider;
}
