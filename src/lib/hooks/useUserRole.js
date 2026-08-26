"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const SUPERADMIN_EMAIL = "work.prashantkhuva@gmail.com";

const ROLE_PERMISSIONS = {
  superadmin: {
    canManageUsers: true,
    canViewAllData: true,
    canSendEmails: true,
  },
  admin: {
    canManageUsers: false,
    canViewAllData: true,
    canSendEmails: true,
  },
  speaker: {
    canManageUsers: false,
    canViewAllData: true,
    canSendEmails: false,
  },
};

export function useUserRole() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canViewAllData, setCanViewAllData] = useState(true);
  const [canSendEmails, setCanSendEmails] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUser(null);
        setRole(null);
        setCanManageUsers(false);
        setCanViewAllData(true);
        setCanSendEmails(false);
        setOnboardingCompleted(false);
        setLoading(false);
        return;
      }

      setUser(user);

      const metadataRole = user.user_metadata?.role ?? null;
      const superadmin = metadataRole === "superadmin" || user.email === SUPERADMIN_EMAIL;
      setRole(metadataRole);
      setOnboardingCompleted(
        user.user_metadata?.onboarding_completed ?? false
      );
      setIsSuperadmin(superadmin);

      const perms = ROLE_PERMISSIONS[metadataRole] || ROLE_PERMISSIONS.speaker;
      setCanManageUsers(superadmin || perms.canManageUsers);
      setCanViewAllData(perms.canViewAllData);
      setCanSendEmails(superadmin || perms.canSendEmails);

      setLoading(false);
    };

    fetchUser();
  }, []);

  return {
    user,
    role,
    isSuperadmin,
    canManageUsers,
    canViewAllData,
    canSendEmails,
    onboardingCompleted,
    loading,
  };
}
