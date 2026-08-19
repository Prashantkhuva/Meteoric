import { authGuard, fail } from "../_lib/helpers";
import { updateBookingStatus, createLeadFromBooking } from "../../../admin/actions";
import { jsonToFormData } from "../_lib/helpers";

const CAL_API = "https://api.cal.com/v2";

export async function GET(request) {
  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  const key = process.env.CALCOM_API_KEY;
  if (!key) return fail("CALCOM_API_KEY not set", 500);

  try {
    const res = await fetch(`${CAL_API}/bookings`, {
      headers: {
        Authorization: `Bearer ${key}`,
        "cal-api-version": "2024-08-13",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return fail(`Cal.com API error: ${res.status}`, res.status);
    }

    const json = await res.json();
    return Response.json({ bookings: json.data || [] });
  } catch (err) {
    return fail(err.message, 500);
  }
}

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
      case "status":
        return Response.json(await updateBookingStatus(payload.bookingId, payload.status));
      case "create-lead":
        return Response.json(await createLeadFromBooking(jsonToFormData(payload)));
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process booking action", 500);
  }
}