import { createHash } from "node:crypto";
import { selectProvider } from "./provider.js";
import { buildState } from "./questions.js";
import { storeDecision } from "./store.js";

export function decisionsEnabled() {
  return process.env.AI_DECISIONS_ENABLED === "true";
}

function computeInputHash(lead) {
  return createHash("sha256").update(JSON.stringify(buildState(lead))).digest("hex");
}

export async function runDecisionForLead(lead) {
  if (!decisionsEnabled() || !lead?.id) return null;
  try {
    const provider = selectProvider(process.env.DECISIONS_PROVIDER || "jev");
    const result = await provider(lead);
    await storeDecision({
      entityType: "lead",
      entityId: lead.id,
      decisionType: "lead_triage",
      result,
      inputHash: computeInputHash(lead),
    });
    return result;
  } catch (err) {
    console.warn("[decisions] skipped:", err?.message || err);
    return null;
  }
}

const DECISIONS_CONCURRENCY = 5;

async function pool(items, limit, worker) {
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const index = next++;
      await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
}

export async function runDecisionsForLeads(leads) {
  if (!decisionsEnabled() || !Array.isArray(leads) || !leads.length) return 0;
  let stored = 0;
  await pool(leads, DECISIONS_CONCURRENCY, async (lead) => {
    const result = await runDecisionForLead(lead);
    if (result) stored++;
  });
  return stored;
}
