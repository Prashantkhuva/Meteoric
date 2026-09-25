import { authGuard, denyUnless, fail } from "../_lib/helpers";
import {
  getLatestDecisionForLead,
  getLatestDecisionsForLeadIds,
  recordDecisionReview,
  getDecisionAccuracy,
  getRecentDecisions,
} from "@/lib/decisions/store";

export async function POST(request) {
  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const { action, ...payload } = body || {};

  const ACTION_PERMS = {
    latest_for_lead: "view",
    latest_for_leads: "view",
    review: "write",
    accuracy: "view",
    recent: "view",
  };
  const denied = await denyUnless(auth, ACTION_PERMS[action] || "write");
  if (denied) return denied;

  try {
    switch (action) {
      case "latest_for_lead": {
        const id = Number(payload.id);
        if (!Number.isInteger(id) || id <= 0) return fail("Invalid lead id");
        return Response.json({ success: true, data: await getLatestDecisionForLead(id) });
      }
      case "latest_for_leads": {
        const ids = Array.isArray(payload.ids)
          ? payload.ids.map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 200)
          : [];
        return Response.json({ success: true, data: await getLatestDecisionsForLeadIds(ids) });
      }
      case "review": {
        const id = Number(payload.id);
        if (!Number.isInteger(id) || id <= 0) return fail("Invalid decision id");
        if (payload.verdict !== "agree" && payload.verdict !== "disagree") {
          return fail("verdict must be agree or disagree");
        }
        await recordDecisionReview({
          decisionId: id,
          verdict: payload.verdict,
          reviewerId: auth.user.id,
        });
        return Response.json({ success: true });
      }
      case "accuracy":
        return Response.json({ success: true, data: await getDecisionAccuracy() });
      case "recent": {
        const limit = Math.min(Math.max(Number(payload.limit) || 50, 1), 200);
        return Response.json({ success: true, data: await getRecentDecisions(limit) });
      }
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process decision action", 500);
  }
}
