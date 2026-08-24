import { createServiceClient } from "@/lib/supabase/service";

/**
 * Insert an admin notification. Never throws — notifications must not
 * break the primary flow that triggered them.
 *
 * dedupeKey makes an event idempotent, e.g. "invoice_overdue:42" ensures
 * a single overdue notification per invoice even if the cron repeats.
 */
export async function createNotification({
  type,
  title,
  body = null,
  entityType = null,
  entityId = null,
  dedupeKey = null,
}) {
  try {
    const supabase = createServiceClient();
    if (!supabase) return;

    const { error } = await supabase.from("notifications").insert({
      type,
      title,
      body,
      entity_type: entityType,
      entity_id: entityId ? Number(entityId) : null,
      dedupe_key: dedupeKey,
    });

    // unique-violation on dedupe_key means we already notified — fine.
    if (error && error.code !== "23505") {
      console.error("[notifications] insert failed:", error.message);
    }
  } catch (err) {
    console.error("[notifications] unexpected error:", err?.message);
  }
}

export const NOTIFICATION_TYPES = {
  NEW_LEAD: "new_lead",
  NEW_BOOKING: "new_booking",
  PAYMENT_RECEIVED: "payment_received",
  INVOICE_OVERDUE: "invoice_overdue",
};

/**
 * Called whenever the admin bookings list is fetched from Cal.com.
 * Any booking we have never notified about (and created within the last
 * 7 days) produces one "new_booking" notification. Idempotent via
 * dedupe_key = booking:{uid}.
 */
export async function detectNewBookings(bookings) {
  try {
    const supabase = createServiceClient();
    if (!supabase || !Array.isArray(bookings) || bookings.length === 0) return;

    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = bookings
      .map((b) => ({
        uid: b?.uid || (b?.id != null ? String(b.id) : null),
        createdAt: b?.createdAt ? new Date(b.createdAt).getTime() : null,
        attendee:
          Array.isArray(b?.attendees) && b.attendees[0]
            ? b.attendees[0].name
            : null,
        title: b?.title || null,
      }))
      .filter((b) => b.uid && b.createdAt && b.createdAt >= cutoff);

    if (recent.length === 0) return;

    const { data: existing } = await supabase
      .from("notifications")
      .select("dedupe_key")
      .in("dedupe_key", recent.map((b) => `booking:${b.uid}`));

    const seen = new Set((existing || []).map((r) => r.dedupe_key));
    const fresh = recent.filter((b) => !seen.has(`booking:${b.uid}`));
    if (fresh.length === 0) return;

    const { error } = await supabase.from("notifications").insert(
      fresh.map((b) => ({
        type: NOTIFICATION_TYPES.NEW_BOOKING,
        title: b.attendee || "New booking",
        body: b.title,
        entity_type: "booking",
        dedupe_key: `booking:${b.uid}`,
      })),
    );
    if (error) console.error("[notifications] booking insert:", error.message);
  } catch (err) {
    console.error("[notifications] booking sync failed:", err?.message);
  }
}
