"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
