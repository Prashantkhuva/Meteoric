import { authGuard, denyUnless, jsonToFormData, fail } from "../_lib/helpers";
import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
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
    create: "write",
    update: "write",
    delete: "write",
  };
  const denied = await denyUnless(auth, ACTION_PERMS[action] || "write");
  if (denied) return denied;

  try {
    switch (action) {
      case "list":
        return Response.json(await getBankAccounts());
      case "create":
        return Response.json(await createBankAccount(jsonToFormData(payload)));
      case "update":
        return Response.json(await updateBankAccount(jsonToFormData(payload)));
      case "delete":
        return Response.json(await deleteBankAccount(payload.id));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process bank account action", 500);
  }
}