import type { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token) {
    return new Response("Not found", { status: 404 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("id")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    return new Response("Not found", { status: 404 });
  }

  return Response.redirect(
    new URL(`/preview/invoice/${data.id}?token=${token}`, request.url),
    302,
  );
}
