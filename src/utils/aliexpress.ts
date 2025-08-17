import CryptoJS from "crypto-js";
import {
  AliExpressQueryParams,
  AliExpressProductResponse,
  ProductQueryResult,
  ProcessedProduct,
  AliExpressProduct,
} from "@/types/aliexpress";

// Configuration constants
const ALIEXPRESS_CONFIG = {
  APP_KEY: Number(process.env.ALIEXPRESS_APP_KEY) || 28898013,
  SECRET: process.env.ALIEXPRESS_SECRET || "d8c33695e899858c1ab0a84898b5ca7b",
  APP_SIGNATURE: process.env.ALIEXPRESS_APP_SIGNATURE || "TeMpeb41GmLD",
  TRACKING_ID: process.env.ALIEXPRESS_TRACKING_ID || "Daiki",
  API_URL: "https://api-sg.aliexpress.com/sync",
};

interface ApiParams {
  [key: string]: string | number | undefined;
  min_sale_price: number;
  category_ids: number;
  locale_site: string;
  keywords: string;
  page_size: number;
  page_no: number;
  platform_product_type: string;
  sort: string;
  target_currency: string;
  target_language: string;
  tracking_id: string;
  app_signature: string;
  app_key: number;
  v: string;
  format: string;
  sign_method: string;
  method: string;
  timestamp: string;
  partner_id: string;
  sign?: string;
}

/**
 * Generates the MD5 signature for AliExpress API request
 */
function generateSignature(params: ApiParams, secret: string): string {
  // Sort parameters and filter out undefined values
  const filteredParams: Record<string, string | number> = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined) {
      filteredParams[key] = value;
    }
  });

  const sortedParams = Object.keys(filteredParams)
    .sort()
    .reduce((result, key) => {
      result[key] = filteredParams[key];
      return result;
    }, {} as Record<string, string | number>);

  // Build string to be signed
  let stringToBeSigned = secret;

  for (const [key, value] of Object.entries(sortedParams)) {
    if (
      !Array.isArray(value) &&
      typeof value === "string" &&
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

/**
 * Builds the complete request URL with all parameters
 */
function buildRequestUrl(params: Record<string, string | number>): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${ALIEXPRESS_CONFIG.API_URL}?${queryString}`;
}

/**
 * Shuffles an array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Processes raw product data into the required format
 */
function processProducts(products: AliExpressProduct[]): string[] {
  const shuffledProducts = shuffleArray(products);
  const processedProducts: string[] = [];

  let count = 0;
  for (const product of shuffledProducts) {
    if (count >= 10) break;

    // Skip products with no sales volume
    if (product.lastest_volume === 0) continue;

    // Determine price (sale price or original price)
    const price =
      product.sale_price !== "0.00"
        ? product.sale_price
        : product.original_price;

    // Format: productId~volume~imageUrl~title~price
    const formattedProduct = [
      product.product_id,
      product.lastest_volume,
      product.product_main_image_url,
      product.product_title,
      price,
    ].join("~");

    processedProducts.push(formattedProduct);
    count++;
  }

  return processedProducts;
}

/**
 * Fetches products from AliExpress API
 */
export async function getAliExpressProducts(
  queryParams: AliExpressQueryParams
): Promise<ProductQueryResult> {
  const {
    query,
    minSalePrice = 5,
    categoryIds = 0,
    pageSize = 50,
    pageNo = 1,
    sort = "LAST_VOLUME_DESC",
    targetCurrency = "USD",
    targetLanguage = "en",
  } = queryParams;

  // Build API parameters
  const params: ApiParams = {
    min_sale_price: minSalePrice,
    category_ids: categoryIds,
    locale_site: "global",
    keywords: query,
    page_size: pageSize,
    page_no: pageNo,
    platform_product_type: "ALL",
    sort,
    target_currency: targetCurrency,
    target_language: targetLanguage,
    tracking_id: ALIEXPRESS_CONFIG.TRACKING_ID,
    app_signature: ALIEXPRESS_CONFIG.APP_SIGNATURE,
    app_key: ALIEXPRESS_CONFIG.APP_KEY,
    v: "2.0",
    format: "json",
    sign_method: "md5",
    method: "aliexpress.affiliate.product.query",
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    partner_id: "top-sdk-php-20180326",
  };

  // Generate signature
  params.sign = generateSignature(params, ALIEXPRESS_CONFIG.SECRET);

  // Build request URL - filter out undefined values
  const requestParams: Record<string, string | number> = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined) {
      requestParams[key] = value;
    }
  });

  const requestUrl = buildRequestUrl(requestParams);

  try {
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AliExpressProductResponse = await response.json();

    // Check if products exist in response
    const productData =
      data?.aliexpress_affiliate_product_query_response?.resp_result?.result;

    if (!productData || !productData.products?.product) {
      throw new Error("No products found in API response");
    }

    console.log("API Response:", productData.products.product[0]);

    // Process and return results
    const result: ProductQueryResult = {
      total_record_count: productData.total_record_count,
      current_record_count: productData.current_record_count,
      products: {
        product: processProducts(productData.products.product),
      },
    };

    return result;
  } catch (error) {
    console.error("Error fetching AliExpress products:", error);
    throw error;
  }
}

/**
 * Parses a product string back into an object
 */
export function parseProductString(productString: string): ProcessedProduct {
  const [productId, volume, imageUrl, title, price] = productString.split("~");

  return {
    productId,
    volume: parseInt(volume, 10),
    imageUrl,
    title,
    price,
  };
}

/**
 * Alternative function that returns parsed products directly
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
