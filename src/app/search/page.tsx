import Link from "next/link";
import { getAliExpressProducts } from "@/utils/aliexpress";
import { AliExpressProduct } from "@/types/aliexpress";
import SearchProductsClient from "@/components/SearchProductsClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const query = resolved?.q || "";

  let initialProducts: AliExpressProduct[] = [];
  if (query) {
    try {
      const res = await getAliExpressProducts({
        query,
        categoryIds: 0,
        pageSize: 50,
        sort: "LAST_VOLUME_DESC",
        targetCurrency: "USD",
        targetLanguage: "EN",
      });
      initialProducts = res.products.product;
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Search</span>
            {query && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Products
          </h1>
          <SearchProductsClient
            initialProducts={initialProducts}
            initialQuery={query}
          />
        </div>
      </div>
    </div>
  );
}
