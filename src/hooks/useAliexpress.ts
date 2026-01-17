import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AliExpressProduct, AliExpressQueryParams } from "@/types/aliexpress";

interface AliExpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: { product: AliExpressProduct[] };
}

interface UseAliExpressProductsOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export function useAliExpressProducts(
  queryParams: AliExpressQueryParams,
  options: UseAliExpressProductsOptions = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options;

  return useQuery({
    queryKey: ["aliexpress-products", queryParams],
    queryFn: async (): Promise<AliExpressResponse> => {
      try {
        const searchParams = new URLSearchParams({
          query: queryParams.query,
          parsed: "true", // Always get parsed results
          ...(queryParams.minSalePrice && {
            minSalePrice: queryParams.minSalePrice.toString(),
          }),
          ...(queryParams.categoryIds && {
            categoryIds: queryParams.categoryIds.toString(),
          }),
          ...(queryParams.pageSize && {
            pageSize: queryParams.pageSize.toString(),
          }),
          ...(queryParams.pageNo && { pageNo: queryParams.pageNo.toString() }),
          ...(queryParams.sort && { sort: queryParams.sort }),
          ...(queryParams.targetCurrency && {
            targetCurrency: queryParams.targetCurrency,
          }),
          ...(queryParams.targetLanguage && {
            targetLanguage: queryParams.targetLanguage,
          }),
        });

        const response = await fetch(`/api/aliexpress/product?${searchParams}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch products");
        }

        return response.json();
      } catch (error) {
        console.error("AliExpress API failed:", error);
        // Propagate error to callers (React Query will handle retries/state)
        throw error;
      }
    },
    enabled: enabled && !!queryParams.query,
    staleTime,
    gcTime: cacheTime,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useAliExpressSearch(searchTerm: string, debounceMs = 1000) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  return useAliExpressProducts(
    { query: debouncedSearchTerm },
    { enabled: debouncedSearchTerm.length >= 2 }
  );
}
