import { TRIAGE_QUESTIONS, buildState, isValidStatusChoice } from "./questions.js";

const DECISIONS_URL = "https://openrouter.ai/api/alpha/decisions";
export const JEV_MODEL_ID = "typesafe/jev-1.13";
const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 500;

const QUALITIES = ["hot", "warm", "cold", "spam"];
const SERVICE_CATEGORIES = ["web", "saas", "mobile", "other"];

function getApiKey() {
  const key = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API;
  if (!key) throw new Error("OPENROUTER_API_KEY not configured");
  return key;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestDecisions(body) {
  const key = getApiKey();
  let lastError;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(RETRY_BASE_MS * 2 ** (attempt - 1));
    let status;
    let text;
    try {
      const res = await fetch(DECISIONS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      status = res.status;
      text = await res.text();
    } catch (err) {
      lastError = err;
      continue;
    }
    if (status >= 200 && status < 300) {
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Decisions API returned invalid JSON");
      }
    }
    lastError = new Error(`Decisions API ${status}: ${text.slice(0, 200)}`);
    if (status !== 429 && status < 500) throw lastError;
  }
  throw lastError || new Error("Decisions API: no response");
}

function pickChoice(answers, field) {
  const answer = answers[field];
  if (!answer || answer.type !== "choice" || typeof answer.choice !== "string") {
    throw new Error(`Decisions API: malformed answer for "${field}"`);
  }
  if (typeof answer.confidence !== "number") {
    throw new Error(`Decisions API: missing confidence for "${field}"`);
  }
  return { choice: answer.choice, confidence: answer.confidence };
}

export async function decideJev(lead) {
  const parsed = await requestDecisions({
    model: JEV_MODEL_ID,
    state: buildState(lead),
    questions: TRIAGE_QUESTIONS,
  });

  const answers = parsed?.answers;
  if (!answers || typeof answers !== "object") {
    throw new Error("Decisions API: missing answers");
  }

  const quality = pickChoice(answers, "quality");
  if (!QUALITIES.includes(quality.choice)) {
    throw new Error(`Decisions API: unexpected quality "${quality.choice}"`);
  }

  const status = pickChoice(answers, "suggested_next_status");
  if (!isValidStatusChoice(status.choice)) {
    throw new Error(`Decisions API: unexpected status "${status.choice}"`);
  }

  const category = pickChoice(answers, "service_category");
  if (!SERVICE_CATEGORIES.includes(category.choice)) {
    throw new Error(`Decisions API: unexpected service_category "${category.choice}"`);
  }

  return {
    quality: quality.choice,
    suggested_next_status: status.choice,
    service_category: category.choice,
    per_field_confidence: {
      quality: quality.confidence,
      suggested_next_status: status.confidence,
      service_category: category.confidence,
    },
    confidence: quality.confidence,
    model: JEV_MODEL_ID,
    model_version: typeof parsed.model === "string" ? parsed.model : null,
  };
}
