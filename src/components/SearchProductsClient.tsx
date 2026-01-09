"use client";

import { useCallback, useEffect, useState } from "react";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import ProductCard from "./ProductCard";
import { AliExpressProduct } from "@/types/aliexpress";
import { useAliExpressLoadMoreProducts } from "@/hooks/useAliExpressLoadMoreProducts";

type Props = {
  initialProducts: AliExpressProduct[];
  initialQuery?: string;
};

export default function SearchProductsClient({
  initialProducts,
  initialQuery = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const currentQuery = initialQuery || "";

  const pageSize = 50;
  const maxPageNo = 3;

  const getSearchParams = useCallback(
    (pageNo: number) => {
      const q = initialQuery.trim();
      return new URLSearchParams({
        query: q,
        categoryIds: "0",
        pageSize: String(pageSize),
        pageNo: String(pageNo),
        sort: "LAST_VOLUME_DESC",
        targetCurrency: "USD",
        targetLanguage: "EN",
      });
    },
    [initialQuery, pageSize]
  );

  const pager = useAliExpressLoadMoreProducts({
    initialProducts,
    getSearchParams,
    maxPageNo,
  });

  useEffect(() => {
    setLoading(false);
    setFormError(null);
    setHasSearched(Boolean(initialQuery));
  }, [initialQuery, initialProducts]);

  const errorMessage = formError ?? pager.error;

  return (
    <div>
      <form
        action="/search"
        method="GET"
        onSubmit={(e) => {
          const formData = new FormData(e.currentTarget);
          const query = String(formData.get("q") ?? "").trim();

          if (!query) {
            e.preventDefault();
            setHasSearched(true);
            setLoading(false);
            setFormError("Please enter a search term");
            return;
          }

          setHasSearched(true);
          setFormError(null);
          setLoading(true);
        }}
        className="mb-6"
      >
        <div className="flex gap-4 max-w-2xl">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name="q"
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
              : `${pager.products.length} result${
                  pager.products.length === 1 ? "" : "s"
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

          {errorMessage && (
            <div className="max-w-md mx-auto py-6">
              <div className="flex items-center gap-3 justify-center bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-md mx-auto">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-5 h-5" />
                  <div className="flex-1 ">
                    <p className="text-sm font-medium">Couldn’t load results</p>
                    <p className="text-xs text-red-600/80">{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !errorMessage && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pager.products.map((p) => (
                  <ProductCard key={p.product_id} product={p} />
                ))}
              </div>

              {pager.products.length > 0 &&
                initialQuery.trim() &&
                pager.canLoadMore && (
                <div className="text-center mt-12">
                  <button
                    type="button"
                    onClick={() => pager.loadMore()}
                    disabled={pager.isLoading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg cursor-pointer"
                  >
                    {pager.isLoading ? "Loading..." : "Load More Products"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
