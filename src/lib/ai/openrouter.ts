const DECISIONS_KEY = () =>
  process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API || "";

const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

// Free-tier rotation — first healthy model wins; failures fall through.
// Verified live 2026-10-17 (gemma free = upstream 429; skipped).
const FREE_MODELS = [
  process.env.AI_TEXT_MODEL_1 || "poolside/laguna-s-2.1:free",
  process.env.AI_TEXT_MODEL_2 || "nvidia/nemotron-3-super-120b-a12b:free",
  process.env.AI_TEXT_MODEL_3 || "cohere/north-mini-code:free",
  process.env.AI_TEXT_MODEL_4 || "liquid/lfm-2.5-2.6b:free",
];

const TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS_PER_MODEL = 2;
const RETRY_BASE_MS = 800;

export type ORTextResult = {
  text: string;
  model: string;
  usage_cost: number | null;
};

async function callModel(
  model: string,
  systemPrompt: string,
  userContent: string,
): Promise<ORTextResult | null> {
  const key = DECISIONS_KEY();
  if (!key) return null;

  let lastStatus = 0;
  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, RETRY_BASE_MS * attempt));
    }

    let res: Response;
    try {
      res = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://withmeteoric.com",
          "X-Title": "Meteoric Admin",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.4,
          max_tokens: 1200,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      continue;
    }

    lastStatus = res.status;
    if (!res.ok) {
      // retry 429/5xx only; 4xx others are permanent for this model
      if (res.status !== 429 && res.status < 500) return null;
      continue;
    }

    let parsed: any;
    try {
      parsed = await res.json();
    } catch {
      continue;
    }

    const text = parsed?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) continue;

    const usageCost =
      typeof parsed?.usage?.cost === "number" ? parsed.usage.cost : null;

    return { text: text.trim(), model, usage_cost: usageCost };
  }

  if (lastStatus) console.warn(`[openrouter] ${model} failed (last status ${lastStatus})`);
  return null;
}

/**
 * Try free OpenRouter models in order; first non-empty answer wins.
 * Returns null when all fail / unconfigured — caller uses template fallback.
 */
export async function callOpenRouterText(
  systemPrompt: string,
  userContent: string,
): Promise<ORTextResult | null> {
  for (const model of FREE_MODELS) {
    const result = await callModel(model, systemPrompt, userContent);
    if (result) return result;
  }
  return null;
}

export function openRouterConfigured() {
  return Boolean(DECISIONS_KEY());
}

function extractJson(text: string): any | null {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }
  try {
    return JSON.parse(t);
  } catch {
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(t.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

/**
 * Same rotation as callOpenRouterText, but parses the reply as JSON.
 * Returns null when unconfigured / all models fail / no valid JSON.
 */
export async function callOpenRouterJson(
  systemPrompt: string,
  userContent: string,
): Promise<{ data: any; model: string; usage_cost: number | null } | null> {
  for (const model of FREE_MODELS) {
    const result = await callModel(model, systemPrompt, userContent);
    if (!result) continue;
    const data = extractJson(result.text);
    if (data && typeof data === "object") {
      return { data, model: result.model, usage_cost: result.usage_cost };
    }
  }
  return null;
}
