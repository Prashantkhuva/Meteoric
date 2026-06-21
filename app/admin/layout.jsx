import { createClient } from "@/lib/server";
import { AdminShell } from "./admin-shell";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  let user = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  }

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Admin";

  return <AdminShell userName={userName} userEmail={user?.email}>{children}</AdminShell>;
}
