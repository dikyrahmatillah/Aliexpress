"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AliExpressProduct } from "@/types/aliexpress";

type GetSearchParams = (
  pageNo: number,
  overrides?: Record<string, string>
) => URLSearchParams;

function dedupeByProductId(items: AliExpressProduct[]) {
  const seen = new Set<string>();
  const unique: AliExpressProduct[] = [];
  for (const item of items) {
    const key = String(item.product_id);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

export function useAliExpressLoadMoreProducts(options: {
  initialProducts: AliExpressProduct[];
  getSearchParams: GetSearchParams;
  maxPageNo?: number;
  initialPageNo?: number;
}) {
  const {
    initialProducts,
    getSearchParams,
    maxPageNo = 3,
    initialPageNo = 1,
  } = options;

  const [products, setProducts] = useState(() =>
    dedupeByProductId(initialProducts)
  );
  const [pageNo, setPageNo] = useState(initialPageNo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(dedupeByProductId(initialProducts));
    setPageNo(initialPageNo);
    setIsLoading(false);
    setError(null);
  }, [initialProducts, initialPageNo]);

  const canLoadMore = useMemo(
    () => products.length > 0 && pageNo < maxPageNo,
    [products.length, pageNo, maxPageNo]
  );

  const fetchPage = useCallback(
    async (
      nextPageNo: number,
      mode: "replace" | "append",
      overrides?: Record<string, string>
    ) => {
      if (isLoading) return;

      setIsLoading(true);
      if (mode === "replace") setError(null);

      try {
        const searchParams = getSearchParams(nextPageNo, overrides);
        const response = await fetch(`/api/aliexpress/product?${searchParams}`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const newProducts: AliExpressProduct[] = data.products?.product ?? [];

        setProducts((prev) => {
          const combined =
            mode === "append" ? [...prev, ...newProducts] : newProducts;
          return dedupeByProductId(combined);
        });

        setPageNo(nextPageNo);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load products:", err);
        }
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    },
    [getSearchParams, isLoading]
  );

  const reload = useCallback(
    async (overrides?: Record<string, string>) => {
      await fetchPage(1, "replace", overrides);
    },
    [fetchPage]
  );

  const loadMore = useCallback(
    async (overrides?: Record<string, string>) => {
      const nextPageNo = pageNo + 1;
      if (nextPageNo > maxPageNo) return;
      await fetchPage(nextPageNo, "append", overrides);
    },
    [fetchPage, pageNo, maxPageNo]
  );

  return {
    products,
    pageNo,
    isLoading,
    error,
    setError,
    canLoadMore,
    reload,
    loadMore,
  };
}
