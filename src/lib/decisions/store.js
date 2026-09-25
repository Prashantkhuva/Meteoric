import { createServiceClient } from "@/lib/supabase/service";

function getClient() {
  const supabase = createServiceClient();
  if (!supabase) throw new Error("Supabase service client not configured");
  return supabase;
}

export async function storeDecision({ entityType, entityId, decisionType, result, inputHash }) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("decisions")
    .insert({
      entity_type: entityType,
      entity_id: entityId,
      decision_type: decisionType,
      result,
      confidence: result.confidence,
      model: result.model,
      model_version: result.model_version,
      input_hash: inputHash,
      status: "shadow",
    })
    .select("id")
    .single();
  if (error) throw new Error(`decisions insert failed: ${error.message}`);
  return data;
}

export async function getLatestDecisionForLead(leadId) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("decisions")
    .select("id, result, confidence, model_version, verdict, created_at")
    .eq("entity_type", "lead")
    .eq("entity_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`decisions read failed: ${error.message}`);
  return data;
}

export async function getLatestDecisionsForLeadIds(leadIds) {
  if (!leadIds?.length) return {};
  const supabase = getClient();
  const { data, error } = await supabase
    .from("decisions")
    .select("entity_id, result, confidence, verdict")
    .eq("entity_type", "lead")
    .in("entity_id", leadIds)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`decisions read failed: ${error.message}`);
  const latest = {};
  for (const row of data || []) {
    if (latest[row.entity_id] == null) latest[row.entity_id] = row;
  }
  return latest;
}

export async function recordDecisionReview({ decisionId, verdict, reviewerId }) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("decisions")
    .update({
      verdict,
      reviewed_by: reviewerId || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", decisionId)
    .select("id")
    .single();
  if (error) throw new Error(`decisions review failed: ${error.message}`);
  return data;
}

export async function getDecisionAccuracy() {
  const supabase = getClient();
  const { data, error } = await supabase.rpc("decision_accuracy");
  if (error) throw new Error(`decisions accuracy failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return {
    total: Number(row?.total || 0),
    reviewed: Number(row?.reviewed || 0),
    agree: Number(row?.agree || 0),
    disagree: Number(row?.disagree || 0),
    avgConfidence: row?.avg_confidence == null ? null : Number(row.avg_confidence),
  };
}

export async function getRecentDecisions(limit = 50) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("decisions")
    .select("id, entity_id, result, confidence, model_version, status, verdict, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`decisions read failed: ${error.message}`);
  return data || [];
}
