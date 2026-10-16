import { authGuard, denyUnless, fail } from "../_lib/helpers";
import { globalSearch } from "../../../admin/actions";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);
  const denied = await denyUnless(auth, "view");
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const query = typeof body?.query === "string" ? body.query : "";
  try {
    return Response.json(await globalSearch(query));
  } catch (err) {
    return fail((err as Error).message || "Search failed", 500);
  }
}
