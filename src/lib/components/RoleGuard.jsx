"use client";

import { useEffect } from "react";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useRouter } from "next/navigation";

export function RoleGuard({ allowedRoles }) {
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!allowedRoles.includes(role)) {
      router.replace("/login");
    }
  }, [role, loading, allowedRoles, router]);

  if (loading) {
    return null;
  }

  return true;
}