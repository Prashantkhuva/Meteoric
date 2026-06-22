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
    sort: searchParams.get("sort") || defaults.sort || "newest",
    page: Number(searchParams.get("page")) || defaults.page || 1,
    col: searchParams.get("col") || "",
    dir: searchParams.get("dir") || "asc",
  }), [searchParams, defaults.search, defaults.status, defaults.sort, defaults.page]);

  const debounceRef = useRef(null);

  const setFilters = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === 1 || value === "1") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, updates.search !== undefined ? 300 : 0);
  }, [searchParams, router, pathname]);

  const toggleColSort = useCallback((column) => {
    const params = new URLSearchParams(searchParams.toString());
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
  }, [searchParams, router, pathname]);

  return { filters, setFilters, toggleColSort };
}
