import { decideJev } from "./jev.js";

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

const PROVIDERS = {
  jev: decideJev,
};

export function selectProvider(name) {
  const provider = PROVIDERS[name || "jev"];
  if (!provider) throw new Error(`Unknown decision provider: ${name}`);
  return provider;
}
