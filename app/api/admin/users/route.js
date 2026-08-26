import { authGuard, fail } from "../_lib/helpers";
import {
  addUserInvite,
  resendInvitation,
  updateUserRole,
  deleteUser,
  getUsersWithRoles,
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
      case "list-with-roles": {
        const result = await getUsersWithRoles();
        return Response.json(result);
      }
      case "invite": {
        const fd = new FormData();
        fd.set("name", payload.name || "");
        fd.set("email", payload.email || "");
        fd.set("role", payload.role || "admin");
        const result = await addUserInvite(fd);
        return Response.json(result);
      }
      case "update-role": {
        const result = await updateUserRole(payload.userId, payload.role);
        return Response.json(result);
      }
      case "resend-invite": {
        const result = await resendInvitation(payload.userId);
        return Response.json(result);
      }
      case "delete": {
        const result = await deleteUser(payload.userId);
        return Response.json(result);
      }
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process user action", 500);
  }
}
