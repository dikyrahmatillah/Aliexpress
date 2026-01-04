import { NextRequest, NextResponse } from "next/server";
import { getAliExpressHotProducts } from "@/utils/aliexpress";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const categoryId = searchParams.get("categoryId");
    const pageNo = searchParams.get("pageNo");
    const pageSize = searchParams.get("pageSize");
    const targetCurrency = searchParams.get("targetCurrency");
    const targetLanguage = searchParams.get("targetLanguage");
    const country = searchParams.get("country");

    // Build query parameters with defaults
    const queryParams = {
      ...(categoryId && { categoryId: parseInt(categoryId, 10) }),
      ...(pageNo && { pageNo: parseInt(pageNo, 10) }),
      ...(pageSize && { pageSize: parseInt(pageSize, 10) }),
      ...(targetCurrency && { targetCurrency }),
      ...(targetLanguage && { targetLanguage }),
      ...(country && { country }),
    };

    // Fetch hot products from AliExpress API
    const data = await getAliExpressHotProducts(queryParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AliExpress Hot Products API route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch hot products", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Fetch hot products from AliExpress API
    const data = await getAliExpressHotProducts(body);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AliExpress Hot Products API route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch hot products", details: errorMessage },
      { status: 500 }
    );
  }
}
