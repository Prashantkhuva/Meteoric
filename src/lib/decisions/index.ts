import { createHash } from "node:crypto";
import { selectProvider, type DecisionResult } from "./provider";
import { buildState } from "./questions";
import { storeDecision, getLatestDecisionForLead } from "./store";
import { looksLikeSpam } from "./spam-rules";
import { explainFactors } from "./factors";

export function decisionsEnabled() {
  return process.env.AI_DECISIONS_ENABLED === "true";
}

function computeInputHash(lead: Record<string, any>) {
  return createHash("sha256").update(JSON.stringify(buildState(lead))).digest("hex");
}

export async function runDecisionForLead(lead: Record<string, any>) {
  if (!decisionsEnabled() || !lead?.id) return null;
  try {
    const hash = computeInputHash(lead);
    const latest = await getLatestDecisionForLead(lead.id).catch(() => null);
    if (latest?.input_hash === hash) return null;

    const spamCheck = looksLikeSpam(lead);
    let result: DecisionResult;
    let source: "jev" | "rules";

    if (spamCheck.spam) {
      result = {
        quality: "spam" as const,
        suggested_next_status: "lost",
        service_category: "other" as const,
        per_field_confidence: { quality: 1, suggested_next_status: 1, service_category: 1 },
        probabilities: {
          quality: { spam: 1, hot: 0, warm: 0, cold: 0 },
          suggested_next_status: null,
          service_category: null,
        },
        runner_up: { quality: null, suggested_next_status: null, service_category: null },
        confidence: 1,
        usage_cost: 0,
        model: "rules",
        model_version: null,
      };
      source = "rules";
      result.factors = spamCheck.reasons.slice(0, 3);
    } else {
      const provider = selectProvider(process.env.DECISIONS_PROVIDER || "jev");
      result = await provider(lead);
      result.factors = explainFactors(lead, result);
      source = "jev";
    }

    await storeDecision({
      entityType: "lead",
      entityId: lead.id,
      decisionType: "lead_triage",
      result: { ...result, source },
      inputHash: hash,
      source,
    });
    return result;
  } catch (err) {
    console.warn("[decisions] skipped:", (err as Error)?.message || err);
    return null;
  }
}

const DECISIONS_CONCURRENCY = 5;

async function pool<T>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<void>,
) {
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const index = next++;
      await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
}

export async function runDecisionsForLeads(leads: unknown) {
  if (!decisionsEnabled() || !Array.isArray(leads) || !leads.length) return 0;
  let stored = 0;
  await pool(leads, DECISIONS_CONCURRENCY, async (lead) => {
    const result = await runDecisionForLead(lead);
    if (result) stored++;
  });
  return stored;
}
