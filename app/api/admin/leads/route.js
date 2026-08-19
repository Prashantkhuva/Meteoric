import { authGuard, jsonToFormData, fail } from "../_lib/helpers";
import {
  getLeadsPaginated,
  getLeads,
  addLead,
  updateLead,
  updateLeadStatus,
  convertLeadToClient,
  deleteLead,
  importLeads,
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

  try {
    switch (action) {
      case "list":
        return Response.json(await getLeadsPaginated(payload));
      case "simple":
        return Response.json({ data: await getLeads() });
      case "add":
        return Response.json(await addLead(jsonToFormData(payload)));
      case "update":
        return Response.json(await updateLead(jsonToFormData(payload)));
      case "status":
        return Response.json(await updateLeadStatus(payload.id, payload.status));
      case "convert":
        return Response.json(await convertLeadToClient(payload.id));
      case "delete":
        return Response.json(await deleteLead(payload.id));
      case "import":
        return Response.json(await importLeads(payload.rows));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process lead action", 500);
  }
}