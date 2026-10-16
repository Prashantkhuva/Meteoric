"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  UserSquare2,
  Building2,
  Receipt,
  FileText,
  FolderKanban,
  Mail,
  CalendarDays,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Loader2,
  History,
} from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { globalSearch, type GlobalSearchGroup } from "../actions";

const GROUP_ICONS: Record<GlobalSearchGroup["key"], typeof Search> = {
  leads: UserSquare2,
  clients: Building2,
  invoices: Receipt,
  proposals: FileText,
  projects: FolderKanban,
  sent_emails: Mail,
  bookings: CalendarDays,
};

const RECENTS_KEY = "meteoric-global-search-recents";
const RECENTS_MAX = 5;
// Lists whose PageContent opens a detail drawer from ?id=<row id>
const DEEP_LINK_KEYS = new Set(["leads", "clients", "invoices", "proposals", "projects"]);

function loadRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string").slice(0, RECENTS_MAX)
      : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string): string[] {
  const next = [query, ...loadRecents().filter((r) => r !== query)].slice(0, RECENTS_MAX);
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — recents just don't persist
  }
  return next;
}

function humanizeField(field: string): string {
  return field.split(/[._]/g).join(" ");
}

interface GlobalSearchPaletteProps {
  onClose: () => void;
}

export function GlobalSearchPalette({ onClose }: GlobalSearchPaletteProps) {
  const router = useRouter();
  const trapRef = useFocusTrap(true);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<GlobalSearchGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const seqRef = useRef(0);

  useEffect(() => {
    setRecents(loadRecents());
  }, []);

  const flat = useMemo(
    () => groups.flatMap((g) => g.items.map((item) => ({ group: g, item }))),
    [groups]
  );

  useEffect(() => {
    setActive(0);
  }, [groups]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      seqRef.current++;
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const seq = ++seqRef.current;
      try {
        const res = await globalSearch(q);
        if (seqRef.current !== seq) return;
        if (res && "error" in res) {
          setGroups([]);
        } else {
          setGroups(res.groups);
        }
      } catch (err) {
        if (seqRef.current === seq) {
          console.error("[GlobalSearchPalette]", err);
          setGroups([]);
        }
      } finally {
        if (seqRef.current === seq) setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const open = useCallback(
    (href: string, searchQuery?: string) => {
      const q = (searchQuery ?? query).trim();
      if (q.length >= 2) setRecents(saveRecent(q));
      onClose();
      router.push(href);
    },
    [onClose, query, router]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, Math.max(flat.length - 1, 0)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        if ((e.target as HTMLElement)?.tagName === "BUTTON") return;
        e.preventDefault();
        const target = flat[active];
        if (target) open(target.group.href);
      }
    },
    [active, flat, onClose, open]
  );

  const trimmed = query.trim();
  const showRecents = trimmed.length < 2 && recents.length > 0;

  return (
    <div
      ref={trapRef}
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
          {loading ? (
            <Loader2 size={16} className="shrink-0 animate-spin text-white/40" />
          ) : (
            <Search size={16} className="shrink-0 text-white/40" />
          )}
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, clients, invoices, bookings..."
            className="h-12 w-full bg-transparent text-sm text-white/85 outline-none placeholder:text-white/30"
            aria-label="Search everything"
          />
          <kbd className="hidden shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/50 sm:inline-flex">
            Esc
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {showRecents && (
            <div>
              <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                <span>Recent searches</span>
                <button
                  type="button"
                  className="font-medium normal-case tracking-normal text-white/30 transition-colors hover:text-white/60"
                  onClick={() => {
                    try {
                      window.localStorage.removeItem(RECENTS_KEY);
                    } catch {
                      // ignore
                    }
                    setRecents([]);
                  }}
                >
                  Clear
                </button>
              </div>
              {recents.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setQuery(r)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-[13px] text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white/85"
                >
                  <History size={13} className="shrink-0 text-white/30" />
                  <span className="truncate">{r}</span>
                </button>
              ))}
            </div>
          )}

          {trimmed.length < 2 && !showRecents && (
            <p className="px-4 py-8 text-center text-xs text-white/35">
              Type at least 2 characters to search everything.
            </p>
          )}

          {trimmed.length >= 2 && !loading && groups.length === 0 && (
            <p className="px-4 py-8 text-center text-xs text-white/35">
              No results for &ldquo;{trimmed}&rdquo;.
            </p>
          )}

          {groups.map((group) => {
            const Icon = GROUP_ICONS[group.key];
            return (
              <div key={group.key}>
                <button
                  type="button"
                  onClick={() => open(group.href)}
                  className="sticky top-0 z-10 flex w-full items-center justify-between border-t border-white/[0.05] bg-[#0a0a0a]/95 px-4 pb-1.5 pt-3 backdrop-blur"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                    {group.label}
                    <span className="ml-2 font-normal normal-case tracking-normal text-white/25">
                      {group.count}
                      {group.count > group.items.length ? "+" : ""} matches
                    </span>
                  </span>
                  <span className="text-[10px] text-white/30 transition-colors group-hover:text-white/60">
                    view all →
                  </span>
                </button>
                {group.items.map((item) => {
                  const index = flat.findIndex(
                    (f) => f.group.key === group.key && f.item.id === item.id
                  );
                  const isActive = index === active;
                  const matchedLabel = item.matched?.length
                    ? `in ${item.matched.map(humanizeField).join(", ")}`
                    : null;
                  return (
                    <button
                      key={`${group.key}-${item.id}`}
                      type="button"
                      onMouseEnter={() => index >= 0 && setActive(index)}
                      onFocus={() => index >= 0 && setActive(index)}
                      onClick={() =>
                        open(
                          DEEP_LINK_KEYS.has(group.key)
                            ? `${group.href.split("?")[0]}?id=${item.id}`
                            : group.href
                        )
                      }
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.03] text-white/50">
                        <Icon size={13} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-white/85">
                          {item.title}
                        </span>
                        <span className="block truncate text-[11px] text-white/40">
                          {item.subtitle}
                          {matchedLabel && (
                            <span className="text-white/25"> · {matchedLabel}</span>
                          )}
                        </span>
                      </span>
                      {item.meta && (
                        <span className="shrink-0 rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/45">
                          {item.meta}
                        </span>
                      )}
                      {isActive && (
                        <CornerDownLeft size={12} className="shrink-0 text-white/40" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {flat.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2 text-[10px] text-white/35">
            <span className="flex items-center gap-1">
              <ArrowUp size={11} /> <ArrowDown size={11} /> navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft size={11} /> open list
            </span>
            <span>esc to close</span>
          </div>
        )}
      </div>
    </div>
  );
}
