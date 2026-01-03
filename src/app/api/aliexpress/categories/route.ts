import { NextRequest, NextResponse } from "next/server";
import { getAliExpressCategories } from "@/utils/aliexpress";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appSignature = searchParams.get("appSignature") || undefined;

    const result = await getAliExpressCategories({
      appSignature,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in categories API route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
