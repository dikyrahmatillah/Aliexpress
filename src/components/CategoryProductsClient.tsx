"use client";

import { useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { FiGrid, FiList } from "react-icons/fi";
import { AliExpressProduct } from "@/types/aliexpress";
import CategoryFilters from "./CategoryFilters";

type Props = {
  initialProducts: AliExpressProduct[];
  categoryId: number;
};

function dedupeByProductId(items: AliExpressProduct[]) {
  const seen = new Set<string>();
  const unique: AliExpressProduct[] = [];
  for (const item of items) {
    const key = String(item.product_id);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

export default function CategoryProductsClient({
  initialProducts,
  categoryId,
}: Props) {
  const [products, setProducts] = useState(() =>
    dedupeByProductId(initialProducts)
  );
  const currentPageRef = useRef(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("priceDesc");
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    label: "All Prices",
    min: 0,
    max: 10000,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const pageSize = 50;
  const maxPageNo = 3;

  async function reloadProducts(loadMore = false, sortValue?: string) {
    const sortKey = sortValue ?? selectedSort;
    const nextPageNo = loadMore ? currentPageRef.current + 1 : 1;

    if (nextPageNo > maxPageNo) return;

    if (isLoading) return;
    setIsLoading(true);
    if (!loadMore) setError(null);

    try {
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
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const newProducts: AliExpressProduct[] = data.products?.product ?? [];
      setProducts((prev) => {
        const combined = loadMore ? [...prev, ...newProducts] : newProducts;
        return dedupeByProductId(combined);
      });

      currentPageRef.current = nextPageNo;
    } catch (e) {
      console.error("reloadProducts error", e);
      setError("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.sale_price);
    const priceInRange =
      price >= selectedPriceRange.min && price <= selectedPriceRange.max;
    return priceInRange;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">
          {filteredProducts.length} products
        </span>

        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid" ? "bg-gray-100" : ""
            } cursor-pointer`}
            aria-label="Grid view"
            type="button"
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list" ? "bg-gray-100" : ""
            } cursor-pointer`}
            aria-label="List view"
            type="button"
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <CategoryFilters
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
          selectedSort={selectedSort}
          onSortChange={(newSort) => {
            setSelectedSort(newSort);
            reloadProducts(false, newSort);
          }}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
        />

        <div className="flex-1">
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

              {filteredProducts.length > 0 &&
                currentPageRef.current < maxPageNo && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => reloadProducts(true)}
                      disabled={isLoading}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg cursor-pointer"
                    >
                      {isLoading ? "Loading..." : "Load More Products"}
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
