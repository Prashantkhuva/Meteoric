"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

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

  // paramsRef is the synchronous source of truth for the URL state. Every
  // update merges into it immediately, so rapid clicks always build on the
  // latest logical state — never on the browser URL, which lags behind
  // in-flight router.replace() calls (the cause of dropped/duplicated updates).
  const paramsRef = useRef(null);
  const debounceRef = useRef(null);

  // Rebuild from the committed URL only on back/forward navigation.
  useEffect(() => {
    const syncFromUrl = () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      paramsRef.current = new URLSearchParams(window.location.search);
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const commit = useCallback((params) => {
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router, pathname]);

  const setFilters = useCallback((updates) => {
    const base = paramsRef.current || new URLSearchParams(window.location.search);
    const params = new URLSearchParams(base.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === 1 || value === "1") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    paramsRef.current = params;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      commit(params);
    }, updates.search !== undefined ? 300 : 0);
  }, [commit]);

  const toggleColSort = useCallback((column) => {
    const base = paramsRef.current || new URLSearchParams(window.location.search);
    const params = new URLSearchParams(base.toString());
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
    paramsRef.current = params;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    commit(params);
  }, [commit]);

  return { filters, setFilters, toggleColSort };
}