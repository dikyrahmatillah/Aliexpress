"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { FiGrid, FiList } from "react-icons/fi";
import { AliExpressProduct } from "@/types/aliexpress";

type Props = {
  initialProducts: AliExpressProduct[];
  categoryId: number;
};

export default function CategoryProductsClient({
  initialProducts,
  categoryId,
}: Props) {
  function dedupeByProductId(items: AliExpressProduct[]) {
    const seen = new Set();
    const unique = [];
    for (const item of items) {
      const key = item.product_id;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    return unique;
  }

  const [products, setProducts] = useState(() =>
    dedupeByProductId(initialProducts)
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("priceDesc");
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    label: "All Prices",
    min: 0,
    max: 10000,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageNo, setPageNo] = useState(1);

  const pageSize = 50;
  const maxPageNo = 3;

  async function reloadProducts(
    sortValue?: string,
    { loadMore } = { loadMore: false }
  ) {
    try {
      if (loadMore) {
        if (loadingMore || loading) return;
        if (pageNo >= maxPageNo) return;
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const sortKey = sortValue ?? selectedSort;
      const nextPageNo = loadMore ? pageNo + 1 : 1;

      if (nextPageNo > maxPageNo) {
        return;
      }

      const searchParams = new URLSearchParams({
        query: "",
        categoryIds: String(categoryId),
        pageSize: String(pageSize),
        pageNo: String(nextPageNo),
        sort: sortKey,
        targetCurrency: "USD",
        targetLanguage: "EN",
      });

      const response = await fetch(`/api/aliexpress/product?${searchParams}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to fetch products");
      }

      const data = await response.json();

      const newProducts: AliExpressProduct[] = data.products?.product ?? [];
      setPageNo(nextPageNo);
      setProducts((prev) => {
        if (!loadMore) return dedupeByProductId(newProducts);
        const existing = new Set(prev.map((p) => String(p.product_id)));
        const appendedUnique = newProducts.filter(
          (p) => !existing.has(String(p.product_id))
        );
        return [...prev, ...appendedUnique];
      });
      return;
    } catch (e) {
      console.error("reloadProducts error", e);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function loadMoreProducts() {
    await reloadProducts(undefined, { loadMore: true });
  }

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.sale_price);
    const priceInRange =
      price >= selectedPriceRange.min && price <= selectedPriceRange.max;
    return priceInRange;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg"
          >
            <span className="flex items-center">Filters</span>
          </button>

          <div
            className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Sort By
              </h3>
              <select
                value={selectedSort}
                onChange={(e) => {
                  const newSort = e.target.value;
                  setSelectedSort(newSort);
                  setPageNo(1);
                  reloadProducts(newSort);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="volumeAsc">Sale: Low to High</option>
                <option value="volumeDesc">Sale: High to Low</option>
                <option value="discountAsc">Discount: Low to High</option>
                <option value="discountDesc">Discount: High to Low</option>
                <option value="ratingAsc">Rating: Low to High</option>
                <option value="ratingDesc">Rating: High to Low</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Price Range
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange.label === "All Prices"}
                    onChange={() =>
                      setSelectedPriceRange({
                        label: "All Prices",
                        min: 0,
                        max: 10000,
                      })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">All Prices</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange.label === "Under $25"}
                    onChange={() =>
                      setSelectedPriceRange({
                        label: "Under $25",
                        min: 0,
                        max: 25,
                      })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Under $25</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => reloadProducts()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No products found matching your criteria.
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

              {filteredProducts.length > 0 && pageNo < maxPageNo && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg cursor-pointer"
                  >
                    {loadingMore ? "Loading..." : "Load More Products"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
