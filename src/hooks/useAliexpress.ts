import { useQuery, useMutation } from "@tanstack/react-query";
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

/**
 * Hook to fetch AliExpress products using React Query
 */
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
    retry: 1, // Reduced retries since we have fallback
    retryDelay: 1000,
  });
}

/**
 * Hook to search AliExpress products with mutation (for manual triggering)
 */
export function useAliExpressProductsMutation() {
  return useMutation({
    mutationFn: async (
      queryParams: AliExpressQueryParams
    ): Promise<AliExpressResponse> => {
      const response = await fetch("/api/aliexpress/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryParams),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products");
      }

      return response.json();
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for search suggestions/autocomplete
 */
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

/**
 * Hook to fetch AliExpress hot products
 */
export function useAliExpressHotProducts(
  categoryId?: number,
  options: UseAliExpressProductsOptions = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options;

  return useQuery({
    queryKey: ["aliexpress-hot-products", categoryId],
    queryFn: async (): Promise<AliExpressResponse> => {
      try {
        const searchParams = new URLSearchParams({
          ...(categoryId && { categoryId: categoryId.toString() }),
          pageSize: "50",
          targetCurrency: "USD",
          targetLanguage: "EN",
          parsed: "true",
        });

        const response = await fetch(
          `/api/aliexpress/hotproduct?${searchParams}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch hot products");
        }
        const fetchedData = await response.json();

        return fetchedData;
      } catch (error) {
        console.error("AliExpress Hot Products API failed:", error);
        throw error;
      }
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
    retry: 1, // Reduced retries since we have fallback
    retryDelay: 1000,
  });
}

// Helper function to extract useful data from AliExpress response
export function formatAliExpressProducts(products: AliExpressProduct[]) {
  return products.map((product) => ({
    product_id: product.product_id,
    product_title: product.product_title,
    salePrice: parseFloat(product.sale_price),
    originalPrice: parseFloat(product.original_price),
    discount: parseFloat(product.discount),
    imageUrl: product.product_main_image_url,
    salesVolume: product.lastest_volume,
    first_level_category_name: product.first_level_category_name,
    first_level_category_id: product.first_level_category_id,
    second_level_category_name: product.second_level_category_name,
    second_level_category_id: product.second_level_category_id,
    product_video_url: product.product_video_url,
    sku_id: product.sku_id,
    shop_name: product.shop_name,
  }));
}
