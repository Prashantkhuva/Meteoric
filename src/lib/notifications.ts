import { createServiceClient } from "@/lib/supabase/service";
import { createSign } from "node:crypto";

// ── FCM push (HTTP v1) ──────────────────────────────────────────────────
// Requires FCM_PROJECT_ID + FCM_SERVICE_ACCOUNT_KEY (service account JSON
// as a single-line string) in env. When absent, push silently no-ops —
// in-app notifications and externalNotify still work.

type FcmCreds = { client_email: string; private_key: string; project_id?: string };

let fcmCreds: FcmCreds | null | undefined;
let fcmToken: { value: string; expiresAt: number } | null = null;

function getFcmCreds(): FcmCreds | null {
  if (fcmCreds !== undefined) return fcmCreds;
  let value: FcmCreds | null = null;
  try {
    const raw = process.env.FCM_SERVICE_ACCOUNT_KEY;
    value = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("[notifications] FCM_SERVICE_ACCOUNT_KEY parse failed:", (err as Error).message);
  }
  fcmCreds = value;
  return value;
}

function getFcmProjectId(): string | null {
  const creds = getFcmCreds();
  return process.env.FCM_PROJECT_ID || creds?.project_id || null;
}

async function getFcmAccessToken(): Promise<string | null> {
  if (fcmToken && fcmToken.expiresAt > Date.now() + 60_000) return fcmToken.value;
  const creds = getFcmCreds();
  if (!creds) return null;

  try {
    const now = Math.floor(Date.now() / 1000);
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })}`;
    const signer = createSign("RSA-SHA256");
    signer.update(unsigned);
    const jwt = `${unsigned}.${signer.sign(creds.private_key).toString("base64url")}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(jwt)}`,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[notifications] FCM token exchange failed:", res.status);
      return null;
    }
    const data = (await res.json()) as { access_token: string; expires_in?: number };
    fcmToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
    return fcmToken.value;
  } catch (err) {
    console.error("[notifications] FCM token exchange error:", (err as Error).message);
    return null;
  }
}

async function pushToTokens(
  tokens: string[],
  payload: { title: string; body?: string | null; data?: Record<string, string> },
): Promise<void> {
  const projectId = getFcmProjectId();
  if (!projectId || tokens.length === 0) return;
  const accessToken = await getFcmAccessToken();
  if (!accessToken) return;

  const stale: string[] = [];
  await Promise.all(
    tokens.map(async (token) => {
      try {
        const res = await fetch(
          `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: {
                token,
                notification: { title: payload.title, body: payload.body || undefined },
                data: payload.data,
                android: { priority: "high" },
              },
            }),
            signal: AbortSignal.timeout(5000),
          },
        );
        if (res.status === 404 || res.status === 400) {
          const text = await res.text();
          // UNREGISTERED / invalid token — prune so we stop targeting it.
          if (text.includes("UNREGISTERED") || text.includes("NOT_FOUND") || text.includes("INVALID_ARGUMENT")) {
            stale.push(token);
          }
        } else if (!res.ok) {
          console.error("[notifications] FCM send failed:", res.status, await res.text());
        }
      } catch {
        // Network blip — keep the token; next event retries.
      }
    }),
  );

  if (stale.length > 0) {
    try {
      const supabase = createServiceClient();
      if (supabase) await supabase.from("fcm_tokens").delete().in("token", stale);
    } catch {
      // Prune failure is non-fatal.
    }
  }
}

/**
 * Fan a notification out to every registered device token. Never throws.
 * No-ops when FCM env vars are missing or no tokens exist.
 */
export async function pushToAllDevices(payload: {
  title: string;
  body?: string | null;
  data?: Record<string, string>;
}): Promise<void> {
  try {
    const supabase = createServiceClient();
    if (!supabase || !getFcmCreds()) return;
    const { data: rows, error } = await supabase.from("fcm_tokens").select("token");
    if (error || !rows || rows.length === 0) return;
    await pushToTokens(
      rows.map((r) => r.token),
      payload,
    );
  } catch (err) {
    console.error("[notifications] push failed:", (err as Error).message);
  }
}

/**
 * Mirror a notification to an external channel (Slack/Discord incoming
 * webhook, or Telegram sendMessage URL). Never throws — external channels
 * must not break the primary flow.
 *
 * Requires NOTIFY_WEBHOOK_URL. Telegram URLs (api.telegram.org) also need
 * NOTIFY_CHAT_ID. Slack/Discord both accept our dual text/content body.
 */
export async function externalNotify(text: string | null | undefined) {
  try {
    const url = process.env.NOTIFY_WEBHOOK_URL;
    if (!url || !text) return;
    const isTelegram = url.includes("api.telegram.org");
    const body = isTelegram
      ? { chat_id: process.env.NOTIFY_CHAT_ID, text }
      : { text, content: text };
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    console.error("[notifications] external notify failed:", (err as Error)?.message);
  }
}

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
}: {
  type: string;
  title: string;
  body?: string | null;
  entityType?: string | null;
  entityId?: string | number | null;
  dedupeKey?: string | null;
}): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    if (!supabase) return false;

    const { error } = await supabase.from("notifications").insert({
      type,
      title,
      body,
      entity_type: entityType,
      entity_id: entityId ? Number(entityId) : null,
      dedupe_key: dedupeKey,
    });

    // unique-violation on dedupe_key means we already notified — fine.
    if (error) {
      if (error.code !== "23505") {
        console.error("[notifications] insert failed:", error.message);
      }
      return false;
    }

    await externalNotify(`[Meteoric] ${title}${body ? `\n${body}` : ""}`);
    await pushToAllDevices({
      title,
      body,
      data: {
        type,
        ...(entityType ? { entityType } : {}),
        ...(entityId != null ? { entityId: String(entityId) } : {}),
      },
    });
    return true;
  } catch (err) {
    console.error("[notifications] unexpected error:", (err as Error)?.message);
    return false;
  }
}

export const NOTIFICATION_TYPES = {
  NEW_LEAD: "new_lead",
  NEW_BOOKING: "new_booking",
  PAYMENT_RECEIVED: "payment_received",
  INVOICE_OVERDUE: "invoice_overdue",
  LEAD_FOLLOW_UP: "lead_follow_up",
};

/**
 * Called whenever the admin bookings list is fetched from Cal.com.
 * Any booking we have never notified about (and created within the last
 * 7 days) produces one "new_booking" notification. Idempotent via
 * dedupe_key = booking:{uid}.
 */
export async function detectNewBookings(
  bookings:
    | Array<{
        uid?: string | null;
        id?: string | number | null;
        createdAt?: string | null;
        title?: string | null;
        attendees?: Array<{ name?: string | null }> | null;
      }>
    | null
    | undefined,
) {
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
    if (error) {
      console.error("[notifications] booking insert:", error.message);
      return;
    }

    await Promise.all(
      fresh.map((b) =>
        externalNotify(
          `[Meteoric] New booking — ${b.attendee || "New booking"}${b.title ? `\n${b.title}` : ""}`,
        ),
      ),
    );
    for (const b of fresh) {
      await pushToAllDevices({
        title: b.attendee || "New booking",
        body: b.title,
        data: { type: NOTIFICATION_TYPES.NEW_BOOKING, entityType: "booking" },
      });
    }
  } catch (err) {
    console.error("[notifications] booking sync failed:", (err as Error)?.message);
  }
}
