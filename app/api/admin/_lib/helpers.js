import { createServerClient } from "@supabase/ssr";
import { getPermissionsForAuth } from "@/lib/admin-permissions";

export async function authGuard(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return null;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;

  return { user: data.user, token, supabase };
}

// Returns null when allowed, Response 401/403 when denied.
export async function denyUnless(auth, permission) {
  if (!auth) return fail("Unauthorized", 401);
  let perms;
  try {
    perms = await getPermissionsForAuth(auth);
  } catch {
    perms = null;
  }
  if (!perms) return fail("Unauthorized", 401);
  if (!perms[permission]) return fail("You don't have permission to do this", 403);
  return null;
}

export function jsonToFormData(obj) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(obj || {})) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      if (value.length > 0) fd.set(key, JSON.stringify(value));
      continue;
    }
    if (typeof value === "object") {
      fd.set(key, JSON.stringify(value));
      continue;
    }
    fd.set(key, String(value));
  }
  return fd;
}

export function ok(data) {
  return Response.json({ success: true, ...data });
}

export function fail(message, status = 400) {
  return Response.json({ error: message }, { status });
}