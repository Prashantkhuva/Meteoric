import { authGuard, denyUnless, jsonToFormData, fail } from "../_lib/helpers";
import {
  getClientsPaginated,
  getClients,
  addClient,
  updateClient,
  updateClientStatus,
  deleteClient,
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
    simple: "view",
    add: "write",
    update: "write",
    status: "write",
    delete: "write",
  };
  const denied = await denyUnless(auth, ACTION_PERMS[action] || "write");
  if (denied) return denied;

  try {
    switch (action) {
      case "list":
        return Response.json(await getClientsPaginated(payload));
      case "simple":
        return Response.json({ data: await getClients() });
      case "add":
        return Response.json(await addClient(jsonToFormData(payload)));
      case "update":
        return Response.json(await updateClient(jsonToFormData(payload)));
      case "status":
        return Response.json(await updateClientStatus(payload.id, payload.status));
      case "delete":
        return Response.json(await deleteClient(payload.id));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process client action", 500);
  }
}