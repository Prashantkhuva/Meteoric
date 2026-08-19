import { authGuard, jsonToFormData, fail } from "../_lib/helpers";
import {
  getProjectsPaginated,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
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
        return Response.json(await getProjectsPaginated(payload));
      case "create":
        return Response.json(await createProject(jsonToFormData(payload)));
      case "update":
        return Response.json(await updateProject(jsonToFormData(payload)));
      case "delete":
        return Response.json(await deleteProject(payload.id));
      case "status":
        return Response.json(await updateProjectStatus(payload.id, payload.status));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process project action", 500);
  }
}