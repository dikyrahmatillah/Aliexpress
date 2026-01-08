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
  const products = initialProducts;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const currentQuery = initialQuery || "";

  return (
    <div>
      <form
        action="/search"
        method="GET"
        onSubmit={(e) => {
          const formData = new FormData(e.currentTarget);
          const query = String(formData.get("query") ?? "").trim();

          if (!query) {
            e.preventDefault();
            setHasSearched(true);
            setLoading(false);
            setError("Please enter a search term");
            return;
          }

          setHasSearched(true);
          setError(null);
          setLoading(true);
        }}
        className="mb-6"
      >
        <div className="flex gap-4 max-w-2xl">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name="query"
              type="text"
              placeholder="Search for products..."
              defaultValue={initialQuery}
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
          <p className="text-gray-600" aria-live="polite">
            {loading
              ? `Searching…`
              : `${products.length} result${
                  products.length === 1 ? "" : "s"
                } found for “${currentQuery}”`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
