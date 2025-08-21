"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { ProcessedProduct } from "@/types/aliexpress";

type Props = {
  initialProducts: ProcessedProduct[];
  categoryId: number;
};

export default function CategoryProductsClient({
  initialProducts,
  categoryId,
}: Props) {
  const [products, setProducts] = useState<ProcessedProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("LAST_VOLUME_DESC");
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    label: "All Prices",
    min: 0,
    max: 10000,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function reloadProducts() {
    try {
      setLoading(true);
      setError(null);

      const url = new URL("/api/aliexpress/product", window.location.origin);
      url.searchParams.set("query", "");
      url.searchParams.set("categoryIds", String(categoryId));
      url.searchParams.set("pageSize", "50");
      url.searchParams.set("sort", selectedSort);
      url.searchParams.set("parsed", "true");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (e) {
      // log error for diagnostics
      console.error("reloadProducts error", e);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.sale_price);
    const priceInRange =
      price >= selectedPriceRange.min && price <= selectedPriceRange.max;
    return priceInRange;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div />
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
            >
              <svg className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
            >
              <svg className="w-4 h-4" />
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
                  setSelectedSort(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="LAST_VOLUME_DESC">Best Selling</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="DISCOUNT_DESC">Biggest Discount</option>
                <option value="NEWEST">Newest Arrivals</option>
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
                onClick={reloadProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
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

              {filteredProducts.length > 0 && (
                <div className="text-center mt-12">
                  <button
                    onClick={reloadProducts}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg"
                  >
                    Load More Products
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
