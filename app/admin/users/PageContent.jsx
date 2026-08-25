"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useToast } from "../components/ToastContext";
import {
  getUsersWithRoles,
  addUserInvite,
  updateUserRole,
  resendInvitation,
} from "../actions";
import { Shield, UserPlus, Mail, ChevronDown, Loader2, X } from "lucide-react";

const ROLE_STYLES = {
  superadmin: {
    bg: "bg-[#EAEFFF]/[0.08]",
    text: "text-[#EAEFFF]",
    border: "border-[#EAEFFF]/20",
    dot: "bg-[#EAEFFF]",
  },
  admin: {
    bg: "bg-emerald-500/[0.08]",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  speaker: {
    bg: "bg-white/[0.04]",
    text: "text-white/50",
    border: "border-white/10",
    dot: "bg-white/40",
  },
};

function RoleBadge({ role }) {
  const s = ROLE_STYLES[role] || ROLE_STYLES.speaker;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {role || "—"}
    </span>
  );
}

export default function PageContent() {
  const toast = useToast();
  const { canManageUsers, loading: roleLoading } = useUserRole();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  // invite form
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviting, setInviting] = useState(false);

  // role change
  const [changingRole, setChangingRole] = useState(null);

  const fetchUsers = useCallback(async () => {
    const res = await getUsersWithRoles();
    if (res.error) {
      toast(res.error, "error");
    } else {
      setUsers(res.users || []);
    }
  }, [toast]);

  useEffect(() => {
    if (!canManageUsers) return;
    let active = true;
    (async () => {
      setLoading(true);
      const res = await getUsersWithRoles();
      if (active) {
        if (res.error) toast(res.error, "error");
        else setUsers(res.users || []);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [canManageUsers, toast]);

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    setInviting(true);
    const fd = new FormData();
    fd.append("name", inviteName.trim());
    fd.append("email", inviteEmail.trim());
    fd.append("role", inviteRole);
    const res = await addUserInvite(fd);
    setInviting(false);
    if (res.error) {
      toast(res.error, "error");
    } else {
      toast(`Invitation sent to ${inviteEmail}`, "success");
      setInviteName("");
      setInviteEmail("");
      setInviteRole("admin");
      setShowInvite(false);
      fetchUsers();
    }
  }

  async function handleChangeRole(userId, newRole) {
    setChangingRole(userId);
    const res = await updateUserRole(userId, newRole);
    setChangingRole(null);
    if (res.error) {
      toast(res.error, "error");
    } else {
      toast("Role updated", "success");
      fetchUsers();
    }
  }

  async function handleResend(userId, email) {
    const res = await resendInvitation(userId);
    if (res.error) {
      toast(res.error, "error");
    } else {
      toast(`Invitation resent to ${email}`, "success");
    }
  }

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
      </div>
    );
  }

  if (!canManageUsers) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Shield className="h-8 w-8 text-white/15" />
        <p className="text-sm text-white/30">You don't have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">
            Users
          </h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">
            {users.length} user{users.length !== 1 ? "s" : ""} in your team
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <UserPlus size={14} />
          Invite User
        </button>
      </div>

      {showInvite && (
        <div className="border border-[#EAEFFF]/10 bg-[#EAEFFF]/[0.03] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/70">Invite new user</h2>
            <button
              onClick={() => setShowInvite(false)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
              className="flex-1 border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#EAEFFF]/20"
            />
            <input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="flex-1 border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#EAEFFF]/20"
            />
            <div className="relative">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="appearance-none border border-white/[0.06] bg-black/60 px-3.5 py-2.5 pr-8 text-sm text-white outline-none focus:border-[#EAEFFF]/20 cursor-pointer"
              >
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="speaker">Speaker</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
            </div>
            <button
              type="submit"
              disabled={inviting}
              className="inline-flex items-center justify-center gap-2 bg-[#EAEFFF] px-5 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
            >
              {inviting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Mail size={14} />
              )}
              Send Invite
            </button>
          </form>
          <p className="mt-2 text-[11px] text-white/25">
            An auto-generated password will be emailed. The user must change it on first login.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-5 w-5 animate-spin text-white/30" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <Shield className="h-8 w-8 text-white/15" />
          <p className="text-sm text-white/30">No users found</p>
        </div>
      ) : (
        <div className="border border-white/[0.06] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Status</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#EAEFFF]/[0.07] flex items-center justify-center text-[11px] font-bold text-[#EAEFFF] shrink-0">
                        {(u.full_name || u.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/80 truncate">{u.full_name}</p>
                        <p className="text-[11px] text-white/30 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <select
                        value={u.role || ""}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        disabled={changingRole === u.id || u.id === null}
                        className="appearance-none bg-transparent border border-white/[0.06] px-2.5 py-1.5 pr-7 text-[12px] text-white/70 outline-none focus:border-[#EAEFFF]/20 cursor-pointer disabled:opacity-50"
                      >
                        <option value="superadmin">Superadmin</option>
                        <option value="admin">Admin</option>
                        <option value="speaker">Speaker</option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                      />
                      {changingRole === u.id && (
                        <Loader2
                          size={12}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 animate-spin"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {u.onboarding_completed ? (
                      <span className="text-[11px] text-emerald-400/70">Active</span>
                    ) : (
                      <span className="text-[11px] text-amber-400/70">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[11px] text-white/25 tabular-nums">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {!u.onboarding_completed && (
                      <button
                        onClick={() => handleResend(u.id, u.email)}
                        className="inline-flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                      >
                        <Mail size={12} />
                        Resend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-4 border-t border-white/[0.04] space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/20">
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              role: "superadmin",
              perms: "Full access. Manage users, all data, send emails, settings.",
            },
            {
              role: "admin",
              perms: "CRUD all data. Send proposals/invoices. Cannot manage users.",
            },
            {
              role: "speaker",
              perms: "View-only. Can see all data but cannot edit or send emails.",
            },
          ].map((r) => (
            <div key={r.role} className="border border-white/[0.04] bg-white/[0.01] p-3">
              <RoleBadge role={r.role} />
              <p className="mt-2 text-[11px] text-white/30 leading-relaxed">{r.perms}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
