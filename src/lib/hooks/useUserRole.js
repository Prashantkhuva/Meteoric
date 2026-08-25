"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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

      const { data: { user} } = await supabase.auth.getUser();
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
      setRole(user.user_metadata?.role ?? null);

      // Fetch from user_roles table for detailed permissions
      try {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (roleData) {
          setCanManageUsers(roleData.can_manage_users);
          setCanViewAllData(roleData.can_view_all_data);
          setCanSendEmails(roleData.can_send_emails);
          setOnboardingCompleted(roleData.onboarding_completed);
        } else if (user.email === "work.prashantkhuva@gmail.com") {
          setCanManageUsers(true);
          setCanSendEmails(true);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
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