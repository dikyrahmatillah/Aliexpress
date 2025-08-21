import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AliExpressQueryParams, ProcessedProduct } from "@/types/aliexpress";
import { mockHotProductsResponse } from "@/data/mockAliexpressData";

interface AliExpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: ProcessedProduct[];
}

interface AliExpressProductDetail {
  product_id: string | number;
  product_title: string;
  product_detail_url: string;
  product_main_image_url: string;
  product_small_image_urls?: {
    string: string[];
  };
  product_video_url: string;
  // The description will be added by our app since it's not in the API response
  product_description?: string;
  product_attributes?: Array<{
    name: string;
    value: string;
  }>;
  // The review fields will be added by our app since they're not in the API response
  review_rating?: string;
  review_count?: number;

  // Price information
  sale_price: string;
  app_sale_price: string;
  original_price: string;
  target_sale_price?: string;
  target_app_sale_price?: string;
  target_original_price?: string;
  discount: string;

  // Shop information
  shop_name: string;
  shop_id: number | string;
  shop_url: string;

  // Categories
  first_level_category_id: number | string;
  first_level_category_name: string;
  second_level_category_id: number | string;
  second_level_category_name: string;

  // Commission information
  commission_rate: string;
  hot_product_commission_rate?: string;

  // Additional fields
  promotion_link: string;
  tax_rate?: string;
  lastest_volume?: number;
  available_quantity?: number;
  sku_id?: string | number;

  // Currency information
  sale_price_currency?: string;
  app_sale_price_currency?: string;
  original_price_currency?: string;
  target_sale_price_currency?: string;
  target_app_sale_price_currency?: string;
  target_original_price_currency?: string;

  // The delivery info will be added by our app since it's not in the API response
  delivery_info?: {
    delivery_time: string;
    delivery_fee: string;
  };

  // SKU info will be handled separately in our app
  sku_info?: Array<{
    sku_id: string;
    sku_price: string;
    sku_available_quantity: number;
    sku_properties: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

interface UseAliExpressProductsOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  useMock?: boolean; // New option to force mock data
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
    useMock = false,
  } = options;

  return useQuery({
    queryKey: ["aliexpress-products", queryParams],
    queryFn: async (): Promise<AliExpressResponse> => {
      if (useMock) {
        // Return mock data immediately
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
        return mockHotProductsResponse;
      }

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
        console.warn("AliExpress API failed, using mock data:", error);
        // Always return mock data as fallback to satisfy return type
        return mockHotProductsResponse;
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
        console.warn(
          "AliExpress Hot Products API failed, using mock data:",
          error
        );
        // Fallback to mock data if API fails
        return {
          ...mockHotProductsResponse,
          products: mockHotProductsResponse.products.filter(
            (product) =>
              !categoryId ||
              product.first_level_category_id === categoryId.toString()
          ),
        };
      }
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
    retry: 1, // Reduced retries since we have fallback
    retryDelay: 1000,
  });
}

/**
 * Hook to fetch a specific product's details from AliExpress
 */
export function useAliExpressProductDetail(
  productId: string | undefined,
  options: UseAliExpressProductsOptions = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options;

  return useQuery({
    queryKey: ["aliexpress-product-detail", productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      try {
        const searchParams = new URLSearchParams({
          product_id: productId,
          target_currency: "USD",
          target_language: "EN",
          country: "US",
        });

        const response = await fetch(
          `/api/aliexpress/productdetail?${searchParams}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch product details");
        }

        const data = await response.json();
        if (!data.success || !data.product) {
          throw new Error("Failed to get product details from API");
        }

        const rawProductDetail = data.product;

        // Process the data to match our application's needs
        const processedData = processProductDetail(rawProductDetail);

        return {
          rawData: rawProductDetail,
          processedData,
        };
      } catch (error) {
        console.warn("AliExpress Product Detail API failed:", error);
        throw error;
      }
    },
    enabled: enabled && !!productId,
    staleTime,
    gcTime: cacheTime,
    retry: 1,
    retryDelay: 1000,
    select: (data) => data.processedData,
  });
}

/**
 * Process raw product details from AliExpress API to the format our app needs
 */
function processProductDetail(rawData: AliExpressProductDetail) {
  // Extract product images from the small_image_urls field
  const smallImages = rawData.product_small_image_urls?.string || [];

  // Combine all image data
  const allImages = [rawData.product_main_image_url, ...smallImages].filter(
    Boolean
  );

  // Mock SKU info if not provided
  const skuInfo = rawData.sku_info || [];

  // For products without SKUs, create a default one
  if (skuInfo.length === 0 && rawData.sku_id) {
    skuInfo.push({
      sku_id: String(rawData.sku_id),
      sku_price: rawData.sale_price || rawData.app_sale_price,
      sku_available_quantity:
        rawData.available_quantity || rawData.lastest_volume || 999,
      sku_properties: [],
    });
  }

  // Return processed data in the format our app expects
  return {
    product_id: String(rawData.product_id),
    product_title: rawData.product_title,
    product_detail_url: rawData.product_detail_url,
    product_main_image_url: rawData.product_main_image_url,
    product_images: allImages.filter((img, i, arr) => arr.indexOf(img) === i), // Remove duplicates
    product_video_url: rawData.product_video_url || "",
    product_description:
      rawData.product_description || "No description available",
    product_attributes: rawData.product_attributes || [],
    review_rating: rawData.review_rating || "0",
    review_count: rawData.review_count || 0,
    // Use target prices if available (usually in USD), otherwise use original prices
    sale_price:
      rawData.target_sale_price ||
      rawData.sale_price ||
      rawData.app_sale_price ||
      "0",
    original_price:
      rawData.target_original_price || rawData.original_price || "0",
    discount: rawData.discount || "0",
    shop_name: rawData.shop_name,
    shop_id: String(rawData.shop_id),
    shop_url: rawData.shop_url,
    commission_rate:
      rawData.commission_rate || rawData.hot_product_commission_rate || "0",
    available_quantity:
      rawData.available_quantity || rawData.lastest_volume || 999,
    delivery_info: rawData.delivery_info || {
      delivery_time: "Standard shipping time",
      delivery_fee: "Standard shipping rates apply",
    },
    sku_info: skuInfo,
    // Add additional fields from the API
    first_level_category_id: rawData.first_level_category_id,
    first_level_category_name: rawData.first_level_category_name,
    second_level_category_id: rawData.second_level_category_id,
    second_level_category_name: rawData.second_level_category_name,
    promotion_link: rawData.promotion_link,
    lastest_volume: rawData.lastest_volume,
  };
}

/**
 * Hook to fetch related products based on category
 */
export function useAliExpressRelatedProducts(
  categoryId: string | number | undefined,
  currentProductId: string | undefined,
  options: UseAliExpressProductsOptions = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
  } = options;

  return useQuery({
    queryKey: ["aliexpress-related-products", categoryId, currentProductId],
    queryFn: async (): Promise<AliExpressResponse> => {
      try {
        if (!categoryId) {
          throw new Error("Category ID is required for related products");
        }

        const searchParams = new URLSearchParams({
          categoryId: categoryId.toString(),
          pageSize: "20",
          targetCurrency: "USD",
          targetLanguage: "EN",
          parsed: "true",
        });

        const response = await fetch(
          `/api/aliexpress/hotproduct?${searchParams}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch related products"
          );
        }

        const fetchedData = await response.json();

        // Filter out the current product from related products
        const filteredProducts = fetchedData.products.filter(
          (product: ProcessedProduct) => product.product_id !== currentProductId
        );

        return {
          ...fetchedData,
          products: filteredProducts,
          current_record_count: filteredProducts.length,
        };
      } catch (error) {
        console.warn(
          "AliExpress Related Products API failed, using mock data:",
          error
        );
        // Fallback to mock data if API fails
        const filteredMockProducts = mockHotProductsResponse.products.filter(
          (product) =>
            product.product_id !== currentProductId &&
            (!categoryId ||
              product.first_level_category_id === categoryId.toString())
        );

        return {
          ...mockHotProductsResponse,
          products: filteredMockProducts,
          current_record_count: filteredMockProducts.length,
        };
      }
    },
    enabled: enabled && !!categoryId,
    staleTime,
    gcTime: cacheTime,
    retry: 1,
    retryDelay: 1000,
  });
}

// Helper function to extract useful data from AliExpress response
export function formatAliExpressProducts(products: ProcessedProduct[]) {
  return products.map((product) => ({
    id: product.product_id,
    title: product.title,
    salePrice: parseFloat(product.sale_price),
    originalPrice: parseFloat(product.original_price),
    discount: parseFloat(product.discount),
    imageUrl: product.image_url,
    salesVolume: product.volume,
    first_level_category_name: product.first_level_category_name,
    first_level_category_id: product.first_level_category_id,
    second_level_category_name: product.second_level_category_name,
    second_level_category_id: product.second_level_category_id,
    product_video_url: product.product_video_url,
    sku_id: product.sku_id,
    shop_name: product.shop_name,
    // Generate affiliate link (you may need to adjust this based on your setup)
    affiliateUrl: `https://www.aliexpress.com/item/${product.product_id}.html`,
  }));
}
