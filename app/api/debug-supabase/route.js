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

  if (action === "delete" && id) {
    // Check if it exists first
    const { data: before } = await supabase.from("clients").select("id").eq("id", Number(id)).maybeSingle();
    // Delete with select
    const { data, error, count } = await supabase.from("clients").delete().eq("id", Number(id)).select();
    // Check if still exists
    const { data: after } = await supabase.from("clients").select("id").eq("id", Number(id)).maybeSingle();
    return NextResponse.json({
      existedBefore: !!before,
      existsAfter: !!after,
      deletedData: data,
      deleteError: error?.message || null,
      deleteErrorObj: error,
    });
  }

  return NextResponse.json({ error: "invalid action" });
}
