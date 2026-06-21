import { createClient } from "@/lib/server";
import { AdminShell } from "./admin-shell";

export default async function AdminLayout({ children }) {
  let supabase, user;
  let userName = "Admin";
  let userEmail = null;

  try {
    supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
      userName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Admin";
      userEmail = user?.email;
    }
  } catch {
    // Auth unavailable — render with defaults
  }

  return <AdminShell userName={userName} userEmail={userEmail}>{children}</AdminShell>;
}
