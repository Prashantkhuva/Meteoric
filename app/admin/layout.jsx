import { Suspense } from "react";
import { AdminShell } from "./admin-shell";

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
