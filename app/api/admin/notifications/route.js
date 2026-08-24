import { authGuard, fail } from "../_lib/helpers";
import { createServiceClient } from "@/lib/supabase/service";
import { detectNewBookings } from "@/lib/notifications";

const CAL_API = "https://api.cal.com/v2";

export async function POST(request) {
  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  const supabase = createServiceClient();
  if (!supabase) return fail("Supabase not configured", 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const { action, ...payload } = body || {};

  try {
    switch (action) {
      case "list": {
        const limit = Math.min(Number(payload.limit) || 50, 100);

        // Piggyback booking detection so the bell stays fresh even if the
        // user hasn't opened the bookings screen recently.
        try {
          const key = process.env.CALCOM_API_KEY;
          if (key) {
            const res = await fetch(`${CAL_API}/bookings`, {
              headers: {
                Authorization: `Bearer ${key}`,
                "cal-api-version": "2024-08-13",
              },
              signal: AbortSignal.timeout(8000),
            });
            if (res.ok) {
              const json = await res.json();
              await detectNewBookings(json.data || []);
            }
          }
        } catch {
          // non-fatal — list still returns from the table
        }

        const [{ data: items, error }, { count }] = await Promise.all([
          supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit),
          supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false),
        ]);

        if (error) return fail(error.message, 500);
        return Response.json({ data: items || [], unreadCount: count || 0 });
      }
      case "mark_read": {
        const ids = (payload.ids || []).map(Number).filter(Boolean);
        if (ids.length === 0) return Response.json({ success: true });
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .in("id", ids);
        if (error) return fail(error.message, 500);
        return Response.json({ success: true });
      }
      case "mark_all_read": {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("is_read", false);
        if (error) return fail(error.message, 500);
        return Response.json({ success: true });
      }
      default:
        return fail(`Unknown action: ${action}`);
    }
  } catch (err) {
    return fail(err.message || "Failed to process notification action", 500);
  }
}
