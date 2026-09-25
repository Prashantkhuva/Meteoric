import { authGuard, denyUnless, jsonToFormData, fail } from "../_lib/helpers";
import {
  getProposalsPaginated,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  generateProposalDraft,
  sendProposal,
  updateProposalStatus,
  ensureShareToken,
  getProposalPricing,
} from "../../../admin/actions";

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
    list: "view",
    get: "view",
    pricing: "view",
    create: "write",
    update: "write",
    delete: "write",
    draft: "write",
    status: "write",
    "share-token": "write",
    send: "send_email",
  };
  const denied = await denyUnless(auth, ACTION_PERMS[action] || "write");
  if (denied) return denied;

  try {
    switch (action) {
      case "list":
        return Response.json(await getProposalsPaginated(payload));
      case "get":
        return Response.json({ data: await getProposalById(payload.id) });
      case "create":
        return Response.json(await createProposal(jsonToFormData(payload)));
      case "update":
        return Response.json(await updateProposal(jsonToFormData(payload)));
      case "delete":
        return Response.json(await deleteProposal(payload.id));
      case "draft":
        return Response.json({ data: await generateProposalDraft(payload.leadId) });
      case "send":
        return Response.json(await sendProposal(payload.id));
      case "status":
        return Response.json(await updateProposalStatus(payload.id, payload.status));
      case "share-token":
        return Response.json(await ensureShareToken("proposal", payload.id));
      case "pricing":
        return Response.json({ data: await getProposalPricing(payload.id) });
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process proposal action", 500);
  }
}