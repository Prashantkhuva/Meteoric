import { authGuard, fail } from "../_lib/helpers";
import {
  getReviewsPaginated,
  updateReviewStatus,
  toggleReviewVerified,
  deleteReview,
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
        return Response.json(
          await getReviewsPaginated({
            page: payload.page,
            pageSize: payload.pageSize,
            status: payload.status,
            search: payload.search,
            col: payload.col,
            dir: payload.dir,
          })
        );
      case "status":
        return Response.json(await updateReviewStatus(payload.id, payload.status));
      case "verified":
        return Response.json(await toggleReviewVerified(payload.id, payload.is_verified));
      case "delete":
        return Response.json(await deleteReview(payload.id));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process review action", 500);
  }
}