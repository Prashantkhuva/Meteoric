"use client";

import { useState, useEffect, useContext } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Lock, Loader2, Check } from "lucide-react";
import { ToastContext } from "../components/ToastContext";

export default function PageContent() {
  const toast = useContext(ToastContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      if (u) {
        setUser(u);
        setFullName(u.user_metadata?.full_name || u.user_metadata?.name || "");
        setEmail(u.email || "");
      }
    }).finally(() => setLoading(false));
  }, []);

  async function handleProfileSave(e) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    try {
      const updates = { data: { full_name: fullName } };
      if (email !== user.email) {
        updates.email = email;
      }
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      setUser((prev) => ({
        ...prev,
        email: email !== user.email ? email : prev.email,
        user_metadata: { ...prev.user_metadata, full_name: fullName },
      }));
      toast("Profile updated successfully", "success");
    } catch (err) {
      toast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
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
      setNewPassword("");
      setConfirmPassword("");
      toast("Password updated successfully", "success");
    } catch (err) {
      toast(err.message || "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-5 lg:p-8">
        <div className="flex items-center gap-3 text-white/30">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-5">
      <div>
        <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Settings</h1>
        <p className="mt-1 text-sm text-white/35 tabular-nums">Manage your admin profile and password</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-white/[0.06] bg-white/[0.02] p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white/70">
            <User size={16} />
            <h2 className="text-sm font-medium">Profile</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label htmlFor="field-fullname" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
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
              <label htmlFor="field-email" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
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
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Profile
            </button>
          </form>
        </div>

        <div className="border border-white/[0.06] bg-white/[0.02] p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white/70">
            <Lock size={16} />
            <h2 className="text-sm font-medium">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label htmlFor="field-new-password" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
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
              <label htmlFor="field-confirm-password" className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5">
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
              disabled={saving || !newPassword || !confirmPassword}
              className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
