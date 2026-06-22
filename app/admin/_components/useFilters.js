"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useFilters(defaults = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => ({
    search: searchParams.get("search") || defaults.search || "",
    status: searchParams.get("status") || defaults.status || "all",
    sort: searchParams.get("sort") || defaults.sort || "newest",
    page: Number(searchParams.get("page")) || defaults.page || 1,
  }), [searchParams, defaults.search, defaults.status, defaults.sort, defaults.page]);

  const setFilters = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === 1 || value === "1") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return { filters, setFilters };
}
