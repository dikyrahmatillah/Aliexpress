import {
  AliExpressProductResponse,
  AliExpressQueryParams,
  AliExpressProduct,
} from "@/types/aliexpress";
import CryptoJS from "crypto-js";

const aliexpressConfig = {
  appKey: Number(process.env.ALIEXPRESS_APP_KEY) || 28898013,
  secret: process.env.ALIEXPRESS_SECRET || "d8c33695e899858c1ab0a84898b5ca7b",
  appSignature: process.env.ALIEXPRESS_APP_SIGNATURE || "TeMpeb41GmLD",
  trackingId: process.env.ALIEXPRESS_TRACKING_ID || "Daiki",
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
function generateSignature(
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
