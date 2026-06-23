import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action") || "test";

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      error: "Supabase not configured",
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    });
  }

  if (action === "test") {
    const { data, error } = await supabase.from("clients").select("id, name").limit(3);
    return NextResponse.json({
      message: "select test",
      data,
      error: error?.message || null,
    });
  }

  if (action === "delete-raw" && id) {
    // Direct REST API call with anon key
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const headers = {
      "apikey": key,
      "Authorization": `Bearer ${token || key}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    };
    const res = await fetch(`${url}/rest/v1/clients?id=eq.${id}`, { method: "DELETE", headers });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      body,
      hasSession: !!session,
    });
  }

  if (action === "delete" && id) {
    // Check if it exists first
    const { data: before } = await supabase.from("clients").select("id").eq("id", Number(id)).maybeSingle();
    // Delete with select
    const { data, error, count } = await supabase.from("clients").delete().eq("id", Number(id)).select();
    // Check if still exists
    const { data: after } = await supabase.from("clients").select("id").eq("id", Number(id)).maybeSingle();
    return NextResponse.json({
      table: "clients",
      existedBefore: !!before,
      existsAfter: !!after,
      deletedData: data,
      deleteError: error?.message || null,
      deleteErrorObj: error,
    });
  }

  if (action === "delete-lead" && id) {
    // Same test but for leads
    const { data: before } = await supabase.from("leads").select("id").eq("id", Number(id)).maybeSingle();
    const { data, error } = await supabase.from("leads").delete().eq("id", Number(id)).select();
    const { data: after } = await supabase.from("leads").select("id").eq("id", Number(id)).maybeSingle();
    return NextResponse.json({
      table: "leads",
      existedBefore: !!before,
      existsAfter: !!after,
      deletedData: data,
      deleteError: error?.message || null,
    });
  }

  return NextResponse.json({ error: "invalid action" });
}
