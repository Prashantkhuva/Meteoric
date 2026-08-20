import { createServerClient } from "@supabase/ssr";

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

  return { user: data.user, token };
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