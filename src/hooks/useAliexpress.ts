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
  gcTime?: number;
}

function buildSearchParams(params: AliExpressQueryParams): URLSearchParams {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return new URLSearchParams(entries.map(([k, v]) => [k, String(v)]));
}

export function useAliExpressProducts(
  queryParams: AliExpressQueryParams,
  options: UseAliExpressProductsOptions = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
  } = options;

  return useQuery({
    queryKey: ["aliexpress-products", queryParams],
    queryFn: async (): Promise<AliExpressResponse> => {
      const searchParams = buildSearchParams(queryParams);
      const response = await fetch(`/api/aliexpress/product?${searchParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products");
      }

      return response.json();
    },
    enabled: enabled && !!queryParams.query,
    staleTime,
    gcTime,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useAliExpressSearch(searchTerm: string, debounceMs = 1000) {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), debounceMs);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  return useAliExpressProducts(
    { query: debouncedTerm },
    { enabled: debouncedTerm.length >= 2 }
  );
}
