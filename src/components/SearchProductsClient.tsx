"use client";

import { useState } from "react";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import ProductCard from "./ProductCard";
import { AliExpressProduct } from "@/types/aliexpress";

type Props = {
  initialProducts: AliExpressProduct[];
  initialQuery?: string;
};

export default function SearchProductsClient({
  initialProducts,
  initialQuery = "",
}: Props) {
  const [products, setProducts] =
    useState<AliExpressProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [viewMode] = useState<"grid" | "list">("grid");

  async function performSearch(query: string) {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const url = new URL("/api/aliexpress/product", window.location.origin);
      url.searchParams.set("query", query);
      url.searchParams.set("pageSize", "50");
      url.searchParams.set("parsed", "true");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setError("Failed to search products");
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load categories:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          performSearch(searchQuery);
        }}
        className="mb-6"
      >
        <div className="flex gap-4 max-w-2xl">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="mb-4">
          <p className="text-gray-600">
            {loading ? "Searching..." : `Search results for “${searchQuery}”`}
          </p>
        </div>
      )}

      {!hasSearched ? (
        <div className="text-center py-12">
          <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Start your search
          </h2>
          <p className="text-gray-500">Enter a search term to find products</p>
        </div>
      ) : (
        <div>
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching products...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto py-6">
              <div className="flex items-center gap-3 justify-center bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-md mx-auto">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-5 h-5" />
                  <div className="flex-1 ">
                    <p className="text-sm font-medium">Couldn’t load results</p>
                    <p className="text-xs text-red-600/80">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    No results found
                  </h2>
                  <p className="text-gray-500 mb-4">
                    No products found for “{searchQuery}”. Try adjusting your
                    search terms.
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.product_id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
