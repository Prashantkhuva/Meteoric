import { authGuard, fail } from "../_lib/helpers";
import {
  getRecipients,
  sendCustomEmailAction,
  getSentEmails,
  deleteSentEmail,
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
      case "recipients":
        return Response.json(await getRecipients());
      case "send":
        return Response.json(
          await sendCustomEmailAction({
            ...payload,
            to: payload.to ? JSON.stringify(payload.to) : undefined,
            files: payload.files ? JSON.stringify(payload.files) : undefined,
          })
        );
      case "sent":
        return Response.json(await getSentEmails(payload.page, payload.pageSize));
      case "delete":
        return Response.json(await deleteSentEmail(payload.id));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process email action", 500);
  }
}