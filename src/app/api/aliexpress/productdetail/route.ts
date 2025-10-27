import { NextRequest, NextResponse } from "next/server";
import * as CryptoJS from "crypto-js";

// Configuration constants
const ALIEXPRESS_CONFIG = {
  APP_KEY: Number(process.env.ALIEXPRESS_APP_KEY),
  SECRET: process.env.ALIEXPRESS_SECRET,
  APP_SIGNATURE: process.env.ALIEXPRESS_APP_SIGNATURE,
  TRACKING_ID: process.env.ALIEXPRESS_TRACKING_ID,
  API_URL: "https://api-sg.aliexpress.com/sync",
};

interface ApiParams {
  [key: string]: string | number | undefined;
  app_signature: string;
  fields: string;
  product_ids: string;
  target_currency: string;
  target_language: string;
  tracking_id: string;
  country: string;
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const productId = searchParams.get("product_id");
    const targetCurrency = searchParams.get("target_currency") || "USD";
    const targetLanguage = searchParams.get("target_language") || "EN";
    const country = searchParams.get("country") || "US";

    // Validate required parameters
    if (!productId) {
      return NextResponse.json(
        { error: "product_id parameter is required" },
        { status: 400 }
      );
    }

    // Ensure required environment secret is available
    if (!ALIEXPRESS_CONFIG.SECRET) {
      console.error("Missing ALIEXPRESS_SECRET environment variable");
      return NextResponse.json(
        { error: "Missing ALIEXPRESS_SECRET environment variable" },
        { status: 500 }
      );
    }

    // Build API parameters
    // Request all available fields based on the API documentation and the fields seen in the example response
    const fields =
      "app_sale_price,original_price,product_detail_url,product_small_image_urls," +
      "category_id,target_sale_price,discount,product_main_image_url,first_level_category_id," +
      "target_app_sale_price_currency,tax_rate,shop_url,target_original_price_currency,promotion_link," +
      "sku_id,shop_name,sale_price,product_title,hot_product_commission_rate,shop_id,commission_rate";
    const params: ApiParams = {
      app_signature: String(ALIEXPRESS_CONFIG.APP_SIGNATURE),
      fields,
      product_ids: productId,
      target_currency: targetCurrency,
      target_language: targetLanguage,
      tracking_id: String(ALIEXPRESS_CONFIG.TRACKING_ID),
      country,
      app_key: ALIEXPRESS_CONFIG.APP_KEY,
      v: "2.0",
      format: "json",
      sign_method: "md5",
      method: "aliexpress.affiliate.productdetail.get",
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      partner_id: "top-sdk-php-20180326",
    };

    // Generate signature
    params.sign = generateSignature(params, ALIEXPRESS_CONFIG.SECRET);

    // Build request URL - filter out undefined values
    const requestParams: Record<string, string | number> = {};
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof ApiParams];
      if (value !== undefined) {
        requestParams[key] = value;
      }
    });

    const requestUrl = buildRequestUrl(requestParams);

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if product details exist in response
    const productDetails =
      data?.aliexpress_affiliate_productdetail_get_response?.resp_result?.result
        ?.products?.product?.[0];

    if (!productDetails) {
      console.error("API Response structure:", JSON.stringify(data, null, 2));
      throw new Error("No product details found in API response");
    }

    // Process and return the product details as-is to be processed on the client side
    return NextResponse.json({
      success: true,
      product: productDetails,
    });
  } catch (error) {
    console.error("Error fetching AliExpress product details:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch product details", details: errorMessage },
      { status: 500 }
    );
  }
}
