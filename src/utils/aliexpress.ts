import {
  AliexpressHotProductResponse,
  AliExpressProductResponse,
  AliExpressQueryParams,
} from "@/types/aliexpress";
import CryptoJS from "crypto-js";

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
  fields: "",
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
    const result: AliExpressProductResponse = await fetchAliExpress(params);
    const productData =
      result?.aliexpress_affiliate_product_query_response?.resp_result?.result;
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

export async function getAliExpressHotProducts(
  queryParams: AliExpressQueryParams
) {
  const {
    fields = aliexpressParams.fields,
    categoryIds = aliexpressParams.categoryIds,
    pageSize = aliexpressParams.pageSize,
    pageNo = aliexpressParams.pageNo,
    targetCurrency = aliexpressParams.targetCurrency,
    targetLanguage = aliexpressParams.targetLanguage,
  } = queryParams;

  const params = buildCommonParams({
    fields,
    category_id: categoryIds,
    page_size: pageSize,
    page_no: pageNo,
    target_currency: targetCurrency,
    target_language: targetLanguage,
    country: aliexpressParams.country,
    locale_site: aliexpressParams.localeSite,
    tracking_id: aliexpressConfig.trackingId,
    app_signature: aliexpressConfig.appSignature,
    method: "aliexpress.affiliate.hotproduct.download",
  });

  params.sign = generateSignature(params, aliexpressConfig.secret);

  try {
    const result = await fetchAliExpress<AliexpressHotProductResponse>(params);
    const productData =
      result?.aliexpress_affiliate_hotproduct_download_response?.resp_result
        ?.result;
    if (!productData) {
      throw new Error("No products found in API response");
    }

    return {
      current_record_count: productData.current_record_count,
      products: productData.products,
    };
  } catch (error) {
    console.error("Error fetching AliExpress hot products:", error);
    throw error;
  }
}
