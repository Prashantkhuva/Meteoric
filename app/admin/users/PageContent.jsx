"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { useToast } from "../components/ToastContext";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";
import {
  Toolbar,
  FilterChip,
  SortDropdown,
  ClearFiltersButton,
} from "../components/Toolbar";
import { useFilters } from "@/hooks/useFilters";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useShortcuts } from "@/hooks/useShortcuts";
import {
  getUsersWithRoles,
  addUserInvite,
  updateUserRole,
  resendInvitation,
  deleteUser,
} from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import * as Select from "@radix-ui/react-select";
import {
  Shield,
  UserPlus,
  Mail,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Users,
  Crown,
  Eye,
  Pencil,
  Trash2,
  Search,
  Calendar,
  ArrowRight,
  RefreshCw,
  Check,
} from "lucide-react";

const PAGE_SIZE = 15;

const ROLES = {
  superadmin: {
    label: "Superadmin",
    color: "text-[#EAEFFF]",
    bg: "bg-[#EAEFFF]/[0.06]",
    border: "border-[#EAEFFF]/15",
    dot: "bg-[#EAEFFF]",
    icon: Crown,
    desc: "Full access. Manage users, all data, send emails, settings.",
    permissions: [
      "Manage team members",
      "Full data access",
      "Send emails",
      "System settings",
    ],
  },
  admin: {
    label: "Admin",
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.06]",
    border: "border-emerald-500/15",
    dot: "bg-emerald-400",
    icon: Pencil,
    desc: "CRUD all data. Send proposals/invoices. Cannot manage users.",
    permissions: [
      "View & edit all data",
      "Send proposals & invoices",
      "Manage projects",
    ],
  },
  speaker: {
    label: "Speaker",
    color: "text-white/50",
    bg: "bg-white/[0.03]",
    border: "border-white/[0.08]",
    dot: "bg-white/40",
    icon: Eye,
    desc: "View-only. Can see all data but cannot edit or send emails.",
    permissions: ["View all data", "Read-only access"],
  },
};

const ROLE_FILTERS = [
  { value: "all", label: "All" },
  { value: "superadmin", label: "Superadmin" },
  { value: "admin", label: "Admin" },
  { value: "speaker", label: "Speaker" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
];

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
  const dim =
    size === "xl"
      ? "h-12 w-12 text-base"
      : size === "lg"
        ? "h-10 w-10 text-sm"
        : "h-8 w-8 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0 ${r.bg} ${r.color} ring-1 ${r.border}`}
    >
      {initial}
    </div>
  );
}

const ROLE_OPTIONS = [
  { value: "superadmin", label: "Superadmin" },
  { value: "admin", label: "Admin" },
  { value: "speaker", label: "Speaker" },
];

function RoleSelect({ value, onChange, disabled, compact = false }) {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger
        className={`inline-flex items-center gap-1.5 outline-none transition-colors data-[disabled]:opacity-50 ${
          compact
            ? "border border-white/[0.06] bg-transparent px-2.5 py-1.5 text-[12px] text-white/70 hover:border-white/[0.12] hover:text-white/80 data-[state=open]:border-[#EAEFFF]/20"
            : "w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white hover:border-white/[0.12] data-[state=open]:border-[#EAEFFF]/20"
        }`}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown
            size={compact ? 12 : 14}
            className="text-white/30 shrink-0"
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[9999] min-w-[160px] border border-white/[0.08] bg-[#0c0c0c] py-1.5 shadow-2xl"
        >
          <Select.Viewport>
            {ROLE_OPTIONS.map((option, i) => (
              <div key={option.value}>
                {i > 0 && <div className="mx-3 my-1 h-px bg-white/[0.04]" />}
                <Select.Item
                  value={option.value}
                  className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-white/50 outline-none transition-colors hover:bg-white/[0.08] data-[highlighted]:bg-white/[0.08] data-[state=checked]:text-white/80"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${ROLES[option.value]?.dot || "bg-white/40"}`} />
                  <Select.ItemText>{option.label}</Select.ItemText>
                  {value === option.value && (
                    <span className="ml-auto text-[#EAEFFF]/50">
                      <Check size={13} />
                    </span>
                  )}
                </Select.Item>
              </div>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function SortIcon({ column, col, dir }) {
  if (col !== column) return null;
  return dir === "asc" ? (
    <ChevronUp size={11} className="inline ml-0.5 text-[#EAEFFF]" />
  ) : (
    <ChevronDown size={11} className="inline ml-0.5 text-[#EAEFFF]" />
  );
}

export default function PageContent() {
  const toast = useToast();
  const {
    user,
    canManageUsers,
    isSuperadmin,
    loading: roleLoading,
  } = useUserRole();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters, toggleColSort } = useFilters();
  const { search, sort, page, col, dir } = filters;
  const searchRef = useRef(null);

  // invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviting, setInviting] = useState(false);
  const inviteTrapRef = useFocusTrap(showInvite);

  // role filter (client-side)
  const [roleFilter, setRoleFilter] = useState("all");

  // role change
  const [changingRole, setChangingRole] = useState(null);

  // delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // detail drawer
  const [viewUser, setViewUser] = useState(null);

  // fetch users
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

  // keyboard shortcuts
  useShortcuts(
    useMemo(
      () => ({
        n: () => setShowInvite(true),
        "/": () => searchRef.current?.focus(),
        Escape: () => {
          if (showInvite) setShowInvite(false);
          if (viewUser) setViewUser(null);
        },
      }),
      [showInvite, viewUser]
    )
  );

  // client-side filtered + sorted
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          (u.full_name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }

    // role filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // sort
    const [sortKey, sortDir] = sort.includes("_")
      ? [sort.split("_")[0], sort.split("_")[1]]
      : [sort, "asc"];

    result.sort((a, b) => {
      if (sortKey === "name") {
        const cmp = (a.full_name || a.email || "").localeCompare(
          b.full_name || b.email || ""
        );
        return sortDir === "desc" ? -cmp : cmp;
      }
      // newest/oldest
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return sortDir === "desc" ? db - da : da - db;
    });

    return result;
  }, [users, search, roleFilter, sort]);

  const totalFiltered = filteredUsers.length;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  // handlers
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
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteUser(deleteTarget.id);
    setDeleting(false);
    if (res.error) {
      toast(res.error, "error");
    } else {
      toast(`${deleteTarget.email} has been removed`, "success");
      setDeleteTarget(null);
      if (viewUser?.id === deleteTarget.id) setViewUser(null);
      fetchUsers();
    }
  }

  // role counts
  const superadminCount = users.filter((u) => u.role === "superadmin").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const speakerCount = users.filter((u) => u.role === "speaker").length;

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

  const hasActiveFilters = search || roleFilter !== "all";

  return (
    <div className="p-5 lg:p-8 space-y-5">
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

      {/* Toolbar */}
      {!loading && users.length > 0 && (
        <Toolbar
          search={search}
          onSearchChange={(val) => setFilters({ search: val, page: 1 })}
          searchRef={searchRef}
          resultCount={totalFiltered}
        >
          {ROLE_FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              active={roleFilter === f.value}
              onClick={() => {
                setRoleFilter(f.value);
                setFilters({ page: 1 });
              }}
            >
              {f.label}
            </FilterChip>
          ))}
          <SortDropdown
            value={sort}
            onChange={(val) => setFilters({ sort: val, page: 1 })}
            options={SORT_OPTIONS}
            label="Sort by"
          />
          {hasActiveFilters && (
            <ClearFiltersButton
              onClick={() => {
                setRoleFilter("all");
                setFilters({ search: "", page: 1 });
              }}
            />
          )}
        </Toolbar>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex items-center gap-3 text-white/40">
            <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-[#EAEFFF]/60" />
            <span className="text-sm">Loading team...</span>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Users className="h-5 w-5 text-white/15" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/40">
                No team members yet
              </p>
              <p className="mt-1 text-xs text-white/25">
                Invite your first team member to get started
              </p>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-[#EAEFFF]/60 hover:text-[#EAEFFF] transition-colors"
            >
              <UserPlus size={13} />
              Invite team member
            </button>
          </div>
        </div>
      ) : totalFiltered === 0 ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Search className="h-5 w-5 text-white/15" />
            <div>
              <p className="text-sm font-medium text-white/40">
                No results found
              </p>
              <p className="mt-1 text-xs text-white/25">
                Try adjusting your search or filters
              </p>
            </div>
            <button
              onClick={() => {
                setRoleFilter("all");
                setFilters({ search: "", page: 1 });
              }}
              className="mt-2 text-xs text-[#EAEFFF]/60 hover:text-[#EAEFFF] transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block border border-white/[0.06] bg-[#0a0a0a] overflow-x-auto">
            <table className="w-full text-left text-sm min-w-max">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th
                    className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors"
                    onClick={() => toggleColSort("name")}
                  >
                    Member
                    <SortIcon column="name" col={col} dir={dir} />
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase">
                    Role
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase hidden md:table-cell">
                    Status
                  </th>
                  <th
                    className="px-5 py-3.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase hidden lg:table-cell cursor-pointer select-none hover:text-white/50 transition-colors"
                    onClick={() => toggleColSort("created_at")}
                  >
                    Joined
                    <SortIcon column="created_at" col={col} dir={dir} />
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.015] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={u.full_name}
                          email={u.email}
                          role={u.role}
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => setViewUser(u)}
                            className="text-sm font-medium text-white/80 truncate transition-colors hover:text-[#EAEFFF] text-left"
                          >
                            {u.full_name || "Unnamed"}
                          </button>
                          <p className="text-[11px] text-white/30 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative">
                        <RoleSelect
                          value={u.role || ""}
                          onChange={(val) => handleChangeRole(u.id, val)}
                          disabled={
                            changingRole === u.id ||
                            u.id === null ||
                            !isSuperadmin
                          }
                          compact
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
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-white/25 tabular-nums">
                        <Calendar size={11} className="text-white/20" />
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
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!u.onboarding_completed && (
                          <button
                            onClick={() => handleResend(u.id, u.email)}
                            className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                            title="Resend invitation"
                          >
                            <RefreshCw size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => setViewUser(u)}
                          className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                          title="View details"
                        >
                          <ArrowRight size={13} />
                        </button>
                        {isSuperadmin && u.id !== user?.id && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-2 text-red-400/30 hover:text-red-400/70 hover:bg-red-500/[0.04] transition-all"
                            title="Delete user"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {paginatedUsers.map((u) => (
              <div
                key={u.id}
                className="border border-white/[0.06] bg-[#0a0a0a] p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <UserAvatar
                      name={u.full_name}
                      email={u.email}
                      role={u.role}
                    />
                    <div className="min-w-0">
                      <button
                        onClick={() => setViewUser(u)}
                        className="text-sm font-medium text-white/80 hover:text-[#EAEFFF] transition-colors text-left"
                      >
                        {u.full_name || "Unnamed"}
                      </button>
                      <p className="text-xs text-white/30 mt-0.5 truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                    <span className="text-[10px] text-white/20 tabular-nums">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!u.onboarding_completed && (
                      <button
                        onClick={() => handleResend(u.id, u.email)}
                        className="p-2 text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                      >
                        <RefreshCw size={13} />
                      </button>
                    )}
                    {isSuperadmin && u.id !== user?.id && (
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-2 text-red-400/30 hover:text-red-400/70 hover:bg-red-500/[0.04] transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            current={page}
            total={totalFiltered}
            pageSize={PAGE_SIZE}
            loading={loading}
            onChange={(p) => setFilters({ page: p })}
          />
        </>
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
                className="border border-white/[0.04] bg-white/[0.01] p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center ${r.bg} border ${r.border}`}
                  >
                    <Icon size={13} className={r.color} />
                  </div>
                  <RoleBadge role={key} />
                </div>
                <p className="mt-2.5 text-[11px] text-white/30 leading-relaxed">
                  {r.desc}
                </p>
                <ul className="mt-2 space-y-1">
                  {r.permissions.map((perm) => (
                    <li
                      key={perm}
                      className="flex items-center gap-1.5 text-[10px] text-white/20"
                    >
                      <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[15vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowInvite(false)}
            />
            <motion.div
              ref={inviteTrapRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl"
            >
              <button
                onClick={() => setShowInvite(false)}
                className="absolute right-4 top-4 p-1.5 text-white/30 hover:text-white/50 transition-colors hover:bg-white/[0.04]"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-[#EAEFFF]/[0.06] border border-[#EAEFFF]/15 flex items-center justify-center">
                  <UserPlus size={18} className="text-[#EAEFFF]" />
                </div>
                <div>
                  <h2
                    id="invite-title"
                    className="text-lg font-semibold tracking-tight text-white/90"
                  >
                    Invite team member
                  </h2>
                  <p className="text-xs text-white/35">
                    They&apos;ll receive an email with setup instructions
                  </p>
                </div>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label
                    htmlFor="invite-name"
                    className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5"
                  >
                    Full name <span className="text-red-400/60">*</span>
                  </label>
                  <input
                    id="invite-name"
                    type="text"
                    placeholder="John Doe"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                    className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#EAEFFF]/20 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="invite-email"
                    className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5"
                  >
                    Email address <span className="text-red-400/60">*</span>
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    placeholder="john@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full border border-white/[0.06] bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#EAEFFF]/20 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="invite-role"
                    className="block text-xs font-medium tracking-wider text-white/40 uppercase mb-1.5"
                  >
                    Role
                  </label>
                  <RoleSelect
                    value={inviteRole}
                    onChange={setInviteRole}
                  />
                  <p className="mt-1.5 text-[11px] text-white/25">
                    {ROLES[inviteRole]?.desc}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInvite(false)}
                    disabled={inviting}
                    className="px-4 py-2.5 text-xs font-medium text-white/45 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.12] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="inline-flex items-center gap-2 bg-[#EAEFFF] px-5 py-2.5 text-xs font-semibold text-[#121212] transition-all hover:bg-[#EAEFFF]/90 active:scale-[0.97] disabled:opacity-50"
                  >
                    {inviting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Mail size={14} />
                    )}
                    {inviting ? "Sending..." : "Send Invite"}
                  </button>
                </div>
              </form>
              <p className="mt-3 text-[11px] text-white/20 text-center">
                An auto-generated password will be emailed. The user must change
                it on first login.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail drawer */}
      <AnimatePresence>
        {viewUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setViewUser(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l border-white/[0.06] bg-[#0a0a0a] overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl px-6 py-4">
                <h2 className="text-sm font-semibold text-white/80">
                  User Details
                </h2>
                <button
                  onClick={() => setViewUser(null)}
                  className="p-1.5 text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User hero */}
                <div className="flex items-center gap-4">
                  <UserAvatar
                    name={viewUser.full_name}
                    email={viewUser.email}
                    role={viewUser.role}
                    size="xl"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white/90 truncate">
                      {viewUser.full_name || "Unnamed"}
                    </h3>
                    <p className="text-sm text-white/40 truncate">
                      {viewUser.email}
                    </p>
                  </div>
                </div>

                {/* Info cards */}
                <div className="space-y-3">
                  <div className="border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-2">
                      Role
                    </p>
                    <div className="flex items-center justify-between">
                      <RoleBadge role={viewUser.role} size="lg" />
                      {isSuperadmin && (
                        <RoleSelect
                          value={viewUser.role || ""}
                          onChange={(val) => {
                            handleChangeRole(viewUser.id, val);
                            setViewUser({
                              ...viewUser,
                              role: val,
                            });
                          }}
                          disabled={changingRole === viewUser.id}
                          compact
                        />
                      )}
                    </div>
                  </div>

                  <div className="border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-2">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      {viewUser.onboarding_completed ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-sm text-emerald-400/80">
                            Active
                          </span>
                          <span className="text-xs text-white/25 ml-1">
                            — Account fully set up
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="text-sm text-amber-400/80">
                            Pending
                          </span>
                          <span className="text-xs text-white/25 ml-1">
                            — Awaiting first login
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-2">
                      Joined
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Calendar size={14} className="text-white/25" />
                      {viewUser.created_at
                        ? new Date(viewUser.created_at).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Unknown"}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="border border-white/[0.04] bg-white/[0.01] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-2">
                      Permissions
                    </p>
                    <ul className="space-y-1.5">
                      {(
                        ROLES[viewUser.role]?.permissions || []
                      ).map((perm) => (
                        <li
                          key={perm}
                          className="flex items-center gap-2 text-sm text-white/40"
                        >
                          <span className="h-1 w-1 rounded-full bg-white/25" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {!viewUser.onboarding_completed && (
                    <button
                      onClick={() => {
                        handleResend(viewUser.id, viewUser.email);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 border border-white/[0.06] px-4 py-2.5 text-xs font-medium text-white/50 hover:bg-white/[0.04] hover:text-white/70 hover:border-white/[0.12] transition-all"
                    >
                      <RefreshCw size={13} />
                      Resend Invitation
                    </button>
                  )}
                  {isSuperadmin && viewUser.id !== user?.id && (
                    <button
                      onClick={() => {
                        setViewUser(null);
                        setDeleteTarget(viewUser);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 border border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={13} />
                      Delete User
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user"
        message={`Are you sure you want to permanently delete ${deleteTarget?.email}? This action cannot be undone and all their data will be removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
