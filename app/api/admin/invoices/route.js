import { authGuard, jsonToFormData, fail } from "../_lib/helpers";
import {
  getInvoicesPaginated,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  markInvoiceAsPaid,
  sendPaymentConfirmationAction,
  markInvoiceAsOverdue,
  cancelInvoice,
  updateInvoiceStatus,
  ensureShareToken,
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
        return Response.json(await getInvoicesPaginated(payload));
      case "get":
        return Response.json({ data: await getInvoiceById(payload.id) });
      case "create":
        return Response.json(await createInvoice(jsonToFormData(payload)));
      case "update":
        return Response.json(await updateInvoice(jsonToFormData(payload)));
      case "delete":
        return Response.json(await deleteInvoice(payload.id));
      case "send":
        return Response.json(await sendInvoice(payload.id));
      case "paid":
        return Response.json(await markInvoiceAsPaid(payload.id, payload.paidAt));
      case "confirmation":
        return Response.json(await sendPaymentConfirmationAction(payload.id));
      case "overdue":
        return Response.json(await markInvoiceAsOverdue(payload.ids));
      case "cancel":
        return Response.json(await cancelInvoice(payload.id));
      case "status":
        return Response.json(await updateInvoiceStatus(payload.id, payload.status));
      case "share-token":
        return Response.json(await ensureShareToken("invoice", payload.id));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process invoice action", 500);
  }
}