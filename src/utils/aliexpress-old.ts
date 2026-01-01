import CryptoJS from "crypto-js";
import {
  AliExpressQueryParams,
  AliExpressProductResponse,
  ProductQueryResult,
  ProcessedProduct,
  AliExpressProduct,
} from "@/types/aliexpress";

/** AliExpress API configuration */
const ALIEXPRESS_CONFIG = {
  APP_KEY: Number(process.env.ALIEXPRESS_APP_KEY),
  SECRET: process.env.ALIEXPRESS_SECRET,
  APP_SIGNATURE: process.env.ALIEXPRESS_APP_SIGNATURE,
  TRACKING_ID: process.env.ALIEXPRESS_TRACKING_ID,
  API_URL: "https://api-sg.aliexpress.com/sync",
  PARTNER_ID: "top-sdk-php-20180326",
  API_VERSION: "2.0",
  FORMAT: "json",
  SIGN_METHOD: "md5",
};

/** Default values for product queries */
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

/** Utility: Build request URL from params */
function buildRequestUrl(params: Record<string, string | number>): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${ALIEXPRESS_CONFIG.API_URL}?${queryString}`;
}

/** Utility: Shuffle array (Fisher-Yates) */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Utility: Parse product string to object */
export function parseProductString(productString: string): ProcessedProduct {
  const [
    product_id,
    volume,
    image_url,
    title,
    sale_price,
    original_price,
    discount,
    first_level_category_name,
    first_level_category_id,
    second_level_category_name,
    second_level_category_id,
    product_small_image_urls,
    product_video_url,
    sku_id,
    shop_name,
    evaluate_rate,
  ] = productString.split("~");

  let rating = 0;
  if (evaluate_rate && evaluate_rate.includes("%")) {
    const percent = parseFloat(evaluate_rate.replace("%", ""));
    rating = Math.round((percent / 20) * 10) / 10;
  } else {
    rating = parseFloat(evaluate_rate) || 0;
  }

  return {
    product_id,
    volume: parseInt(volume, 10),
    image_url,
    title,
    original_price,
    sale_price,
    discount,
    first_level_category_name,
    first_level_category_id,
    second_level_category_name,
    second_level_category_id,
    product_small_image_urls: product_small_image_urls
      ? product_small_image_urls.split(",")
      : [],
    product_video_url,
    sku_id,
    shop_name,
    evaluate_rate: rating,
  };
}

/** Utility: Format AliExpress products to string array */
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

/** Utility: Make a GET request and parse JSON */
async function fetchAliExpress<T>(
  params: Record<string, string | number>
): Promise<T> {
  const url = buildRequestUrl(params);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

/** Build common API params */
function buildCommonParams(
  extra: Record<string, string | number>
): Record<string, string | number> {
  return {
    ...extra,
    app_key: ALIEXPRESS_CONFIG.APP_KEY,
    v: ALIEXPRESS_CONFIG.API_VERSION,
    format: ALIEXPRESS_CONFIG.FORMAT,
    sign_method: ALIEXPRESS_CONFIG.SIGN_METHOD,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    partner_id: ALIEXPRESS_CONFIG.PARTNER_ID,
  };
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
  appSignature = ALIEXPRESS_CONFIG.APP_SIGNATURE,
  trackingId = ALIEXPRESS_CONFIG.TRACKING_ID,
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

  params.sign = generateSignature(params, ALIEXPRESS_CONFIG.SECRET);

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

/**
 * Fetch hot products and return parsed objects
 */
export async function getAliExpressHotProductsParsed(opts = {}): Promise<{
  total_record_count: number;
  current_record_count: number;
  products: ProcessedProduct[];
}> {
  try {
    const result = await getAliExpressHotProducts(opts);
    const products = Array.isArray(result.products.product)
      ? result.products.product.map(parseProductString)
      : [];
    return {
      total_record_count: result.total_record_count,
      current_record_count: result.current_record_count,
      products,
    };
  } catch (error) {
    console.error("Error in getAliExpressHotProductsParsed:", error);
    return { total_record_count: 0, current_record_count: 0, products: [] };
  }
}

/**
 * Fetch products from AliExpress API
 */
export async function getAliExpressProducts(
  queryParams: AliExpressQueryParams
): Promise<ProductQueryResult> {
  const {
    query,
    minSalePrice = DEFAULTS.MIN_SALE_PRICE,
    categoryIds = DEFAULTS.CATEGORY_IDS,
    pageSize = DEFAULTS.PAGE_SIZE,
    pageNo = DEFAULTS.PAGE_NO,
    sort = DEFAULTS.SORT,
    targetCurrency = DEFAULTS.TARGET_CURRENCY,
    targetLanguage = DEFAULTS.TARGET_LANGUAGE,
  } = queryParams;

  const params = buildCommonParams({
    min_sale_price: minSalePrice,
    category_ids: categoryIds,
    locale_site: DEFAULTS.LOCALE_SITE,
    keywords: query,
    page_size: pageSize,
    page_no: pageNo,
    platform_product_type: DEFAULTS.PLATFORM_PRODUCT_TYPE,
    sort,
    target_currency: targetCurrency,
    target_language: targetLanguage,
    tracking_id: ALIEXPRESS_CONFIG.TRACKING_ID,
    app_signature: ALIEXPRESS_CONFIG.APP_SIGNATURE,
    method: "aliexpress.affiliate.product.query",
  });

  params.sign = generateSignature(params, ALIEXPRESS_CONFIG.SECRET);

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
      products: { product: processProducts(productData.products.product) },
    };
  } catch (error) {
    console.error("Error fetching AliExpress products:", error);
    throw error;
  }
}

/**
 * Fetch products and return parsed objects
 */
export async function getAliExpressProductsParsed(
  queryParams: AliExpressQueryParams
): Promise<{
  total_record_count: number;
  current_record_count: number;
  products: ProcessedProduct[];
}> {
  const result = await getAliExpressProducts(queryParams);
  return {
    total_record_count: result.total_record_count,
    current_record_count: result.current_record_count,
    products: result.products.product.map(parseProductString),
  };
}

/**
 * Fetch AliExpress categories
 */
export async function getAliExpressCategories({
  appSignature = ALIEXPRESS_CONFIG.APP_SIGNATURE,
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

  params.sign = generateSignature(params, ALIEXPRESS_CONFIG.SECRET);

  try {
    return await fetchAliExpress(params);
  } catch (error) {
    console.error("Error fetching AliExpress categories:", error);
    throw error;
  }
}
