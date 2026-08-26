"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useToast } from "../components/ToastContext";
import {
  getUsersWithRoles,
  addUserInvite,
  updateUserRole,
  resendInvitation,
  deleteUser,
} from "../actions";
import {
  Shield,
  UserPlus,
  Mail,
  ChevronDown,
  Loader2,
  X,
  Users,
  Crown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const ROLES = {
  superadmin: {
    label: "Superadmin",
    color: "text-[#EAEFFF]",
    bg: "bg-[#EAEFFF]/[0.06]",
    border: "border-[#EAEFFF]/15",
    dot: "bg-[#EAEFFF]",
    icon: Crown,
    desc: "Full access. Manage users, all data, send emails, settings.",
  },
  admin: {
    label: "Admin",
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.06]",
    border: "border-emerald-500/15",
    dot: "bg-emerald-400",
    icon: Pencil,
    desc: "CRUD all data. Send proposals/invoices. Cannot manage users.",
  },
  speaker: {
    label: "Speaker",
    color: "text-white/50",
    bg: "bg-white/[0.03]",
    border: "border-white/[0.08]",
    dot: "bg-white/40",
    icon: Eye,
    desc: "View-only. Can see all data but cannot edit or send emails.",
  },
};

function RoleBadge({ role, size = "sm" }) {
  const r = ROLES[role] || ROLES.speaker;
  const isLg = size === "lg";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-${isLg ? "3" : "2.5"} py-${isLg ? "1" : "0.5"} text-[${isLg ? "12" : "11"}px] font-semibold uppercase tracking-wider ${r.bg} ${r.color} ${r.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
      {r.label}
    </span>
  );
}

function UserAvatar({ name, email, role, size = "md" }) {
  const r = ROLES[role] || ROLES.speaker;
  const initial = (name || email || "?").charAt(0).toUpperCase();
  const dim = size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0 ${r.bg} ${r.color} ring-1 ${r.border}`}
    >
      {initial}
    </div>
  );
}

export default function PageContent() {
  const toast = useToast();
  const { user, canManageUsers, isSuperadmin, loading: roleLoading } = useUserRole();

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

  // delete
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    return () => {
      active = false;
    };
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

  async function handleDelete() {
    if (!deletingUser) return;
    setDeleting(true);
    const res = await deleteUser(deletingUser.id);
    setDeleting(false);
    if (res.error) {
      toast(res.error, "error");
    } else {
      toast(`${deletingUser.email} has been removed`, "success");
      setDeletingUser(null);
      fetchUsers();
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
        <p className="text-sm text-white/30">
          You don't have permission to manage users.
        </p>
      </div>
    );
  }

  const superadminCount = users.filter((u) => u.role === "superadmin").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const speakerCount = users.filter((u) => u.role === "speaker").length;

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-white leading-tight">
            Team
          </h1>
          <p className="mt-1 text-sm text-white/35 tabular-nums">
            {users.length} member{users.length !== 1 ? "s" : ""} &middot;
            {superadminCount > 0 && ` ${superadminCount} superadmin`}
            {adminCount > 0 && ` · ${adminCount} admin`}
            {speakerCount > 0 && ` · ${speakerCount} speaker`}
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 bg-[#EAEFFF] px-4 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97]"
        >
          <UserPlus size={14} />
          Invite
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="border border-[#EAEFFF]/10 bg-[#EAEFFF]/[0.03] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/70">
              Invite team member
            </h2>
            <button
              onClick={() => setShowInvite(false)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <form
            onSubmit={handleInvite}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Full name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
              className="flex-1 border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#EAEFFF]/20 transition-colors"
            />
            <input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="flex-1 border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#EAEFFF]/20 transition-colors"
            />
            <div className="relative">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="appearance-none border border-white/[0.06] bg-black/60 px-3.5 py-2.5 pr-8 text-sm text-white outline-none focus:border-[#EAEFFF]/20 cursor-pointer transition-colors"
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
            An auto-generated password will be emailed. The user must change it
            on first login.
          </p>
        </div>
      )}

      {/* Users list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-5 w-5 animate-spin text-white/30" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <Users className="h-8 w-8 text-white/15" />
          <p className="text-sm text-white/30">No team members yet</p>
          <button
            onClick={() => setShowInvite(true)}
            className="text-xs text-[#EAEFFF]/60 hover:text-[#EAEFFF] transition-colors"
          >
            Invite your first team member
          </button>
        </div>
      ) : (
        <div className="border border-white/[0.06] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                <th className="text-left px-5 py-3">Member</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">
                  Status
                </th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                return (
                  <tr
                    key={u.id}
                    className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={u.full_name}
                          email={u.email}
                          role={u.role}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white/80 truncate">
                            {u.full_name}
                          </p>
                          <p className="text-[11px] text-white/30 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative">
                        <select
                          value={u.role || ""}
                          onChange={(e) =>
                            handleChangeRole(u.id, e.target.value)
                          }
                          disabled={changingRole === u.id || u.id === null}
                          className="appearance-none bg-transparent border border-white/[0.06] px-2.5 py-1.5 pr-7 text-[12px] text-white/70 outline-none focus:border-[#EAEFFF]/20 cursor-pointer disabled:opacity-50 transition-colors"
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
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/70">
                          <span className="h-1 w-1 rounded-full bg-emerald-400/50" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-400/70">
                          <span className="h-1 w-1 rounded-full bg-amber-400/50" />
                          Pending
                        </span>
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
                      <div className="inline-flex items-center gap-2">
                        {!u.onboarding_completed && (
                          <button
                            onClick={() => handleResend(u.id, u.email)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                          >
                            <Mail size={12} />
                            Resend
                          </button>
                        )}
                        {isSuperadmin && u.id !== user?.id && (
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-red-400/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Role permissions */}
      <div className="pt-4 border-t border-white/[0.04]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/20 mb-3">
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(ROLES).map(([key, r]) => {
            const Icon = r.icon;
            return (
              <div
                key={key}
                className="border border-white/[0.04] bg-white/[0.01] p-3.5"
              >
                <div className="flex items-center gap-2">
                  <Icon size={13} className={r.color} />
                  <RoleBadge role={key} />
                </div>
                <p className="mt-2 text-[11px] text-white/30 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm border border-white/[0.08] bg-[#0a0a0a] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-red-500/10 border border-red-500/20">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Delete User</h3>
                <p className="text-xs text-white/40">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Are you sure you want to permanently delete <span className="text-white/70 font-medium">{deletingUser.email}</span>? All their data will be removed from the system.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-white/50 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.12] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
