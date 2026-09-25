import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { headers } from "next/headers";

const SUPERADMIN_EMAIL = "work.prashantkhuva@gmail.com";

const ROLE_DEFAULTS = {
  superadmin: { view: true, write: true, send_email: true, manage_users: true },
  admin: { view: true, write: true, send_email: true, manage_users: false },
  speaker: { view: true, write: false, send_email: false, manage_users: false },
};

function resolvePermissions(user, roleRow) {
  if (!user) return null;

  const email = (user.email || "").toLowerCase();
  if (email === SUPERADMIN_EMAIL) {
    return {
      userId: user.id,
      role: "superadmin",
      perms: { view: true, write: true, send_email: true, manage_users: true, report: true, self_ops: true },
    };
  }

  const role = roleRow?.role || user.user_metadata?.role || "speaker";
  const base = ROLE_DEFAULTS[role] || ROLE_DEFAULTS.speaker;

  if (role === "superadmin") {
    return {
      userId: user.id,
      role,
      perms: { view: true, write: true, send_email: true, manage_users: true, report: true, self_ops: true },
    };
  }

  return {
    userId: user.id,
    role,
    perms: {
      view: roleRow ? roleRow.can_view_all_data !== false : base.view,
      write: base.write,
      send_email: roleRow ? roleRow.can_send_emails === true : base.send_email,
      manage_users: roleRow ? roleRow.can_manage_users === true : base.manage_users,
      report: true,
      self_ops: true,
    },
  };
}

async function loadRoleRow(supabase, userId) {
  const { data } = await supabase
    .from("user_roles")
    .select("role, can_manage_users, can_view_all_data, can_send_emails")
    .eq("user_id", userId)
    .maybeSingle();
  return data || null;
}

// For server actions (cookie-based session).
export async function getCallerPermissions() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) return null;
  return resolvePermissions(user, await loadRoleRow(supabase, user.id));
}

// For API routes (Bearer-token session from authGuard).
export async function getPermissionsForAuth(auth) {
  if (!auth?.user) return null;
  if (!auth.supabase) return resolvePermissions(auth.user, null);
  return resolvePermissions(auth.user, await loadRoleRow(auth.supabase, auth.user.id));
}

// For API-route context: actions re-exported into routes run without cookies,
// but request carries Bearer token (mobile + curl). Fall back to it.
async function getBearerPermissions() {
  try {
    const h = await headers();
    const auth = h.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) return null;
    const token = auth.slice(7).trim();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!token || !url || !key) return null;
    const supabase = createServerClient(url, key, {
      cookies: { getAll: () => [], setAll: () => {} },
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return resolvePermissions(data.user, await loadRoleRow(supabase, data.user.id));
  } catch {
    return null;
  }
}

// Returns null when allowed, { error, status } when denied. Fails closed.
export async function assertCan(permission) {
  let ctx;
  try {
    ctx = await getCallerPermissions();
  } catch {
    ctx = null;
  }
  if (!ctx) ctx = await getBearerPermissions();
  if (!ctx) return { error: "Not authenticated", status: 401 };
  if (!ctx.perms[permission]) return { error: "You don't have permission to do this", status: 403 };
  return null;
}
