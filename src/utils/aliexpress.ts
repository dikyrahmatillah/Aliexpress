import {
  AliExpressProductResponse,
  AliExpressQueryParams,
  AliExpressProduct,
  ProductQueryResult,
} from "@/types/aliexpress";
import CryptoJS from "crypto-js";

const DEFAULTS = {
  MIN_SALE_PRICE: 5,
  CATEGORY_IDS: 0,
  PAGE_SIZE: 50,
  PAGE_NO: 1,
  SORT: "LAST_VOLUME_DESC",
  TARGET_CURRENCY: "USD",
  TARGET_LANGUAGE: "EN",
  COUNTRY: "US",
  LOCALE_SITE: "global",
  PLATFORM_PRODUCT_TYPE: "ALL",
};

export const aliexpressConfig = {
  appKey: Number(process.env.ALIEXPRESS_APP_KEY),
  secret: process.env.ALIEXPRESS_SECRET || "",
  appSignature: process.env.ALIEXPRESS_APP_SIGNATURE || "",
  trackingId: process.env.ALIEXPRESS_TRACKING_ID || "",
  apiUrl: "https://api-sg.aliexpress.com/sync",
  partnerId: "top-sdk-php-20180326",
  apiVersion: "2.0",
  format: "json",
  signMethod: "md5",
};

const aliexpressParams = {
  minSalePrice: 5,
  categoryIds: 0,
  pageSize: 50,
  pageNo: 1,
  sort: "LAST_VOLUME_DESC",
  targetCurrency: "USD",
  targetLanguage: "EN",
  country: "US",
  localeSite: "global",
  platformProductType: "ALL",
};

/** Utility: Generate MD5 signature for AliExpress API */
export function generateSignature(
  params: Record<string, string | number>,
  secret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  let stringToBeSigned = secret;
  for (const key of sortedKeys) {
    const value = params[key];
    if (
      typeof value === "string" &&
      !Array.isArray(value) &&
      !value.startsWith("@")
    ) {
      stringToBeSigned += `${key}${value}`;
    } else if (typeof value !== "object") {
      stringToBeSigned += `${key}${value}`;
    }
  }
  stringToBeSigned += secret;
  return CryptoJS.MD5(stringToBeSigned).toString().toUpperCase();
}

async function fetchAliExpress<T>(
  params: Record<string, string | number>
): Promise<T> {
  const url = buildRequestUrl(params);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

function processProducts(products: AliExpressProduct[]): string[] {
  return shuffleArray(products).map((product) => {
    let smallImageUrls = "";
    const psi = product.product_small_image_urls as unknown;
    if (Array.isArray(psi)) {
      smallImageUrls = psi.join(",");
    } else if (typeof psi === "string") {
      smallImageUrls = psi;
    }
    return [
      product.product_id,
      product.lastest_volume,
      product.product_main_image_url,
      product.product_title,
      product.sale_price,
      product.original_price,
      product.discount,
      product.first_level_category_name,
      product.first_level_category_id,
      product.second_level_category_name,
      product.second_level_category_id,
      smallImageUrls,
      product.product_video_url,
      product.sku_id,
      product.shop_name,
      product.evaluate_rate,
    ].join("~");
  });
}

function buildRequestUrl(params: Record<string, string | number>): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${aliexpressConfig.apiUrl}?${queryString}`;
}

function buildCommonParams(
  extra: Record<string, string | number>
): Record<string, string | number> {
  return {
    ...extra,
    app_key: aliexpressConfig.appKey,
    v: aliexpressConfig.apiVersion,
    format: aliexpressConfig.format,
    sign_method: aliexpressConfig.signMethod,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    partner_id: aliexpressConfig.partnerId,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getAliExpressProducts(
  queryParams: AliExpressQueryParams
) {
  const {
    query,
    minSalePrice = aliexpressParams.minSalePrice,
    categoryIds = aliexpressParams.categoryIds,
    pageSize = aliexpressParams.pageSize,
    pageNo = aliexpressParams.pageNo,
    sort = aliexpressParams.sort,
    targetCurrency = aliexpressParams.targetCurrency,
    targetLanguage = aliexpressParams.targetLanguage,
  } = queryParams;

  const params = buildCommonParams({
    min_sale_price: minSalePrice,
    category_ids: categoryIds,
    keywords: query,
    page_size: pageSize,
    page_no: pageNo,
    sort,
    target_currency: targetCurrency,
    target_language: targetLanguage,
    locale_site: aliexpressParams.localeSite,
    platform_product_type: aliexpressParams.platformProductType,
    tracking_id: aliexpressConfig.trackingId,
    app_signature: aliexpressConfig.appSignature,
    method: "aliexpress.affiliate.product.query",
  });

  params.sign = generateSignature(params, aliexpressConfig.secret);

  try {
    const data: AliExpressProductResponse = await fetchAliExpress(params);
    const productData =
      data?.aliexpress_affiliate_product_query_response?.resp_result?.result;
    if (!productData || !productData.products?.product) {
      throw new Error("No products found in API response");
    }
    return {
      total_record_count: productData.total_record_count,
      current_record_count: productData.current_record_count,
      products: productData.products,
    };
  } catch (error) {
    console.error("Error fetching AliExpress products:", error);
    throw error;
  }
}

// To Do: Improve code quality and error handling here

export async function getAliExpressCategories({
  appSignature = aliexpressConfig.appSignature,
} = {}): Promise<{
  aliexpress_affiliate_category_get_response?: {
    resp_result?: {
      result?: {
        categories?: {
          category?: Array<{
            category_id: number;
            category_name: string;
            parent_category_id?: number;
          }>;
        };
      };
    };
  };
}> {
  const params = buildCommonParams({
    app_signature: appSignature,
    method: "aliexpress.affiliate.category.get",
  });

  params.sign = generateSignature(params, aliexpressConfig.secret);

  try {
    return await fetchAliExpress(params);
  } catch (error) {
    console.error("Error fetching AliExpress categories:", error);
    throw error;
  }
}

/**
 * Fetch hot products from AliExpress API
 */
export async function getAliExpressHotProducts({
  categoryId = DEFAULTS.CATEGORY_IDS,
  pageNo = DEFAULTS.PAGE_NO,
  pageSize = DEFAULTS.PAGE_SIZE,
  targetCurrency = DEFAULTS.TARGET_CURRENCY,
  targetLanguage = DEFAULTS.TARGET_LANGUAGE,
  country = DEFAULTS.COUNTRY,
  appSignature = aliexpressConfig.appSignature,
  trackingId = aliexpressConfig.trackingId,
  localeSite = DEFAULTS.LOCALE_SITE,
  fields = "app_sale_price,shop_id",
} = {}): Promise<ProductQueryResult> {
  const params = buildCommonParams({
    app_signature: appSignature,
    category_id: categoryId,
    fields,
    locale_site: localeSite,
    page_no: pageNo,
    page_size: pageSize,
    target_currency: targetCurrency,
    target_language: targetLanguage,
    tracking_id: trackingId,
    country,
    method: "aliexpress.affiliate.hotproduct.download",
  });

  params.sign = generateSignature(params, aliexpressConfig.secret);

  try {
    const data = await fetchAliExpress<AliExpressProductResponse>(params);
    const result =
      data?.aliexpress_affiliate_product_query_response?.resp_result?.result;
    const products = result?.products?.product || [];
    return {
      total_record_count: result?.total_record_count || products.length,
      current_record_count: products.length,
      products: { product: processProducts(products) },
    };
  } catch (error) {
    console.error("Error fetching AliExpress hot products:", error);
    return {
      total_record_count: 0,
      current_record_count: 0,
      products: { product: [] },
    };
  }
}
