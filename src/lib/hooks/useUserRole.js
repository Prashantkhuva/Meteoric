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

      // Determine role: prefer user_roles via server, fall back to metadata
      const metadataRole = user.user_metadata?.role ?? null;
      setRole(metadataRole);
      setOnboardingCompleted(
        user.user_metadata?.onboarding_completed ?? false
      );

      // Apply permissions from role metadata
      const perms = ROLE_PERMISSIONS[metadataRole] || ROLE_PERMISSIONS.speaker;
      setCanManageUsers(perms.canManageUsers);
      setCanViewAllData(perms.canViewAllData);
      setCanSendEmails(perms.canSendEmails);

      // Superadmin override (always full access regardless of metadata)
      if (user.email === SUPERADMIN_EMAIL) {
        setCanManageUsers(true);
        setCanSendEmails(true);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return {
    user,
    role,
    canManageUsers,
    canViewAllData,
    canSendEmails,
    onboardingCompleted,
    loading,
  };
}
