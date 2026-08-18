"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";

export function useFilters(defaults = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => ({
    search: searchParams.get("search") || defaults.search || "",
    status: searchParams.get("status") || defaults.status || "all",
    score: searchParams.get("score") || defaults.score || "all",
    source: searchParams.get("source") || defaults.source || "all",
    sort: searchParams.get("sort") || defaults.sort || "newest",
    page: Number(searchParams.get("page")) || defaults.page || 1,
    col: searchParams.get("col") || "",
    dir: searchParams.get("dir") || "asc",
  }), [searchParams, defaults.search, defaults.status, defaults.score, defaults.source, defaults.sort, defaults.page]);

  // Merges rapid successive updates so nothing gets dropped by the debounce,
  // and reads the freshest committed URL at flush time instead of a stale closure.
  const pendingRef = useRef(null);
  const debounceRef = useRef(null);

  const setFilters = useCallback((updates) => {
    pendingRef.current = { ...(pendingRef.current || {}), ...updates };
    const merged = pendingRef.current;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      pendingRef.current = null;
      const params = new URLSearchParams(window.location.search);
      Object.entries(merged).forEach(([key, value]) => {
        if (!value || value === "all" || value === 1 || value === "1") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, updates.search !== undefined ? 300 : 0);
  }, [router, pathname]);

  const toggleColSort = useCallback((column) => {
    const params = new URLSearchParams(window.location.search);
    const currentCol = params.get("col") || "";
    const currentDir = params.get("dir") || "asc";
    if (currentCol === column) {
      if (currentDir === "asc") {
        params.set("dir", "desc");
      } else {
        params.delete("col");
        params.delete("dir");
      }
    } else {
      params.set("col", column);
      params.set("dir", "asc");
    }
    params.delete("page");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router, pathname]);

  return { filters, setFilters, toggleColSort };
}