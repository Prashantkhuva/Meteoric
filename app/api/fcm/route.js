import { authGuard, fail } from "../_lib/helpers";
import { createClient } from "@/lib/supabase/server";

// POST /api/fcm — register or remove FCM token
export async function POST(request) {
  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const { action, token, platform } = body || {};

  if (action === "register") {
    if (!token) return fail("Missing token");
    const supabase = await createClient();
    if (!supabase) return fail("DB unavailable", 500);

    const { error } = await supabase.from("fcm_tokens").upsert(
      {
        user_id: auth.user.id,
        token,
        platform: platform || "android",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "token" }
    );

    if (error) return fail(error.message);
    return Response.json({ success: true });
  }

  if (action === "remove") {
    if (!token) return fail("Missing token");
    const supabase = await createClient();
    if (!supabase) return fail("DB unavailable", 500);

    const { error } = await supabase
      .from("fcm_tokens")
      .delete()
      .eq("token", token);

    if (error) return fail(error.message);
    return Response.json({ success: true });
  }

  return fail(`Unknown action: ${action}`);
}
