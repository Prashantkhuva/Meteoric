import { createClient } from "@/lib/supabase/server";

export async function GET(request, { params }) {
  const { token } = await params;

  if (!token) {
    return new Response("Not found", { status: 404 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return new Response("Service unavailable", { status: 500 });
  }

  const { data, error } = await supabase
    .from("proposals")
    .select("id")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    return new Response("Not found", { status: 404 });
  }

  return Response.redirect(
    new URL(`/preview/proposal/${data.id}?token=${token}`, request.url),
    302,
  );
}
