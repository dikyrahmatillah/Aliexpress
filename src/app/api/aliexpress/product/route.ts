import { NextRequest, NextResponse } from "next/server";
import { getAliExpressProductsParsed } from "@/utils/aliexpress-old";
import { AliExpressQueryParams } from "@/types/aliexpress";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const query = searchParams.get("query") || "";
    const minSalePrice = searchParams.get("minSalePrice");
    const categoryIds = searchParams.get("categoryIds");
    const pageSize = searchParams.get("pageSize");
    const pageNo = searchParams.get("pageNo");
    const sort = searchParams.get("sort");
    const targetCurrency = searchParams.get("targetCurrency");
    const targetLanguage = searchParams.get("targetLanguage");
    // parsed flag no longer required; route always returns parsed products

    // Query can be empty when fetching by category

    // Build query parameters
    const queryParams: AliExpressQueryParams = {
      query,
      ...(minSalePrice && { minSalePrice: parseInt(minSalePrice, 10) }),
      ...(categoryIds && { categoryIds: parseInt(categoryIds, 10) }),
      ...(pageSize && { pageSize: parseInt(pageSize, 10) }),
      ...(pageNo && { pageNo: parseInt(pageNo, 10) }),
      ...(sort && { sort }),
      ...(targetCurrency && { targetCurrency }),
      ...(targetLanguage && { targetLanguage }),
    };

    // Fetch products from AliExpress API (parsed preferred)
    const data = await getAliExpressProductsParsed(queryParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AliExpress API route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch products", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, ...otherParams } = body;

    // Validate required parameters
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Build query parameters
    const queryParams: AliExpressQueryParams = {
      query,
      ...otherParams,
    };

    // Fetch products from AliExpress API
    const data = await getAliExpressProductsParsed(queryParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AliExpress API route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch products", details: errorMessage },
      { status: 500 }
    );
  }
}
