"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { createClient } from "@/lib/supabase/client";
import { onboardUserComplete } from "../actions";
import { ShieldCheck, Lock, ChevronDown, Pencil, X } from "lucide-react";
import { useToast } from "../components/ToastContext";

export default function PageContent() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "1";
  const { user, role, onboardingCompleted } = useUserRole();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const goToDashboard = useCallback(() => {
    router.replace("/admin");
  }, [router]);

  useEffect(() => {
    if (isOnboarding && onboardingCompleted === true) {
      goToDashboard();
    }
  }, [isOnboarding, onboardingCompleted, goToDashboard]);

  async function handleProfileSave(e) {
    e.preventDefault();
    const supabase = createClient();
    try {
      const updates = { data: { full_name: fullName } };
      if (email !== user.email) {
        updates.email = email;
      }
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      setEditingProfile(false);
      toast("Profile updated successfully", "success");
    } catch (err) {
      toast(err.message || "Failed to update profile", "error");
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      if (onboardingCompleted !== true) {
        await onboardUserComplete(user.id);
      }
      setNewPassword("");
      setConfirmPassword("");
      setEditingPassword(false);
      toast("Password updated successfully!", "success");
      if (isOnboarding) {
        goToDashboard();
      }
    } catch (err) {
      toast(err.message || "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  }

  const roleColor = role === "superadmin" ? "#EAEFFF" : role === "admin" ? "#34D399" : "rgba(255,255,255,0.4)";
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const initial = displayName[0]?.toUpperCase() || "?";

  /* ── Onboarding mode: forced password change, no sidebar/nav ── */
  if (isOnboarding && onboardingCompleted === false) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#EAEFFF]/20 bg-[#EAEFFF]/5">
              <ShieldCheck size={24} className="text-[#EAEFFF]" />
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight text-white">Welcome to Meteoric</h1>
            <p className="text-sm text-white/40 leading-relaxed">
              This is your first login. Please set a new password to secure your account before continuing.
            </p>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
            <div className="flex items-center gap-2 text-white/70">
              <Lock size={15} />
              <h2 className="text-sm font-medium">Set New Password</h2>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label htmlFor="onb-new-pw" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="onb-new-pw"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 pr-16 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                    placeholder="Min. 6 characters"
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/30 hover:text-white/60 px-2 py-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="onb-confirm-pw" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="onb-confirm-pw"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  placeholder="Repeat new password"
                  minLength={6}
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400/70">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!newPassword || !confirmPassword || saving}
                className="w-full flex items-center justify-center gap-2 bg-[#EAEFFF] px-4 py-3 text-sm font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#121212] border-t-transparent" />
                ) : (
                  "Set Password & Continue"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-white/25">
            You&apos;ll be redirected to the dashboard after setting your password.
          </p>
        </div>
      </div>
    );
  }

  /* ── Normal settings view ── */
  return (
    <div className="p-5 lg:p-8 max-w-2xl space-y-6">
      {/* ── Identity card ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] p-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center border text-lg font-bold"
          style={{
            color: roleColor,
            backgroundColor: `${roleColor}10`,
            borderColor: `${roleColor}40`,
          }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-white truncate">{displayName}</p>
          <p className="text-xs text-white/30 truncate">{user?.email}</p>
        </div>
        {role && (
          <span
            className="shrink-0 border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase"
            style={{
              color: roleColor,
              backgroundColor: `${roleColor}10`,
              borderColor: `${roleColor}30`,
            }}
          >
            {role}
          </span>
        )}
      </div>

      {/* ── Account ───────────────────────────────────────────── */}
      <SectionHeader label="ACCOUNT" />
      <div className="border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.06]">
        <InfoRow label="Name" value={displayName} />
        <InfoRow label="Email" value={user?.email || ""} />
        <InfoRow label="Role" value={role?.toUpperCase() || "—"} valueColor={roleColor} />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingProfile(!editingProfile);
            if (!editingProfile) setEditingPassword(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#EAEFFF] hover:text-white transition-colors"
        >
          {editingProfile ? <X size={13} /> : <Pencil size={13} />}
          {editingProfile ? "CANCEL" : "EDIT PROFILE"}
        </button>
      </div>

      {/* ── Edit profile (expandable) ─────────────────────────── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: editingProfile ? "400px" : "0px", opacity: editingProfile ? 1 : 0 }}
      >
        <div className="border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label htmlFor="field-fullname" className="block text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-1.5">
                Full Name
              </label>
              <input
                id="field-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="field-email" className="block text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-1.5">
                Email
              </label>
              <input
                id="field-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                placeholder="you@example.com"
                required
              />
              {email !== user?.email && (
                <p className="mt-1.5 text-xs text-amber-400/70">A confirmation link will be sent to the new email address.</p>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>

      {/* ── Security ──────────────────────────────────────────── */}
      <SectionHeader label="SECURITY" />
      <div className="border border-white/[0.06] bg-white/[0.02]">
        <button
          onClick={() => {
            setEditingPassword(!editingPassword);
            if (!editingPassword) setEditingProfile(false);
          }}
          className="flex w-full items-center gap-3.5 p-4 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.08] bg-white/[0.03]">
            <Lock size={15} className="text-white/40" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Password</p>
            <p className="text-[11px] text-white/25">Update your password</p>
          </div>
          <ChevronDown
            size={18}
            className={`shrink-0 text-white/20 transition-transform duration-200 ${editingPassword ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: editingPassword ? "400px" : "0px", opacity: editingPassword ? 1 : 0 }}
        >
          <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label htmlFor="field-new-password" className="block text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="field-new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 pr-16 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                    placeholder="Min. 6 characters"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/30 hover:text-white/60 px-2 py-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="field-confirm-password" className="block text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="field-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 transition-all focus:border-[#EAEFFF]/20 outline-none"
                  placeholder="Repeat new password"
                  minLength={6}
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400/70">Passwords do not match</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!newPassword || !confirmPassword || saving}
                className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
              >
                {saving ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#121212] border-t-transparent" />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── App info ──────────────────────────────────────────── */}
      <SectionHeader label="APP" />
      <div className="border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.06]">
        <InfoRow label="Platform" value="Web Admin" />
        <InfoRow label="Stack" value="Next.js + Supabase" />
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionHeader({ label }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase">
      {label}
    </p>
  );
}

function InfoRow({ label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-[13px] text-white/40">{label}</span>
      <span
        className="text-[13px] font-medium"
        style={{ color: valueColor || "rgba(255,255,255,0.85)" }}
      >
        {value}
      </span>
    </div>
  );
}
