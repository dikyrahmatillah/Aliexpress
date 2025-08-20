"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Filter, Grid, List } from "lucide-react";
import { getAliExpressProductsParsed } from "@/utils/aliexpress";
import { ProcessedProduct } from "@/types/aliexpress";
import StarRating from "@/components/StarRating";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

// Sort options matching Koala's style
const sortOptions = [
  { value: "LAST_VOLUME_DESC", label: "Best Selling" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
  { value: "DISCOUNT_DESC", label: "Biggest Discount" },
  { value: "NEWEST", label: "Newest Arrivals" },
];

// Color filter options (simulated)
const colorOptions = [
  { name: "All Colors", value: "all", color: "bg-gray-200" },
  { name: "Black", value: "black", color: "bg-black" },
  { name: "White", value: "white", color: "bg-white border border-gray-300" },
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Gray", value: "gray", color: "bg-gray-500" },
  { name: "Brown", value: "brown", color: "bg-amber-800" },
];

// Price ranges
const priceRanges = [
  { label: "All Prices", min: 0, max: 10000 },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: 10000 },
];

interface CategoryInfo {
  name: string;
  description: string;
}

// Default category info for fallback
const defaultCategoryInfo: CategoryInfo = {
  name: "Category Products",
  description: "Discover amazing products from AliExpress in this category",
};

function ProductCard({ product }: { product: ProcessedProduct }) {
  const salePrice = parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.original_price);
  const discount =
    originalPrice > salePrice
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  return (
    <Link href={`/item/${product.product_id}`} className="group block">
      <div className="relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50">
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {discount}% OFF
            </div>
          )}
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center space-x-1">
            <StarRating rating={4.5} reviewCount={product.volume} />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${salePrice.toFixed(2)}
            </span>
            {originalPrice > salePrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500">{product.volume} sold</div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] =
    useState<CategoryInfo>(defaultCategoryInfo);

  // Filter and sort states
  const [selectedSort, setSelectedSort] = useState("LAST_VOLUME_DESC");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load products and category info on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch products with the actual AliExpress category ID
        const result = await getAliExpressProductsParsed({
          query: "", // Empty string as requested
          categoryIds: parseInt(id) || 0, // Use the real AliExpress category ID from URL
          pageSize: 50,
          sort: selectedSort,
          targetCurrency: "USD",
          targetLanguage: "EN",
        });

        setProducts(result.products);

        // Try to fetch category information via API route
        try {
          const categoriesResponse = await fetch("/api/aliexpress/categories");
          if (categoriesResponse.ok) {
            const categoriesResult = await categoriesResponse.json();
            const categories =
              categoriesResult?.aliexpress_affiliate_category_get_response
                ?.resp_result?.result?.categories?.category;

            if (categories) {
              const foundCategory = categories.find(
                (cat: { category_id: number; category_name: string }) =>
                  cat.category_id.toString() === id
              );
              if (foundCategory) {
                setCategoryInfo({
                  name: foundCategory.category_name,
                  description: `Discover amazing ${foundCategory.category_name.toLowerCase()} products from AliExpress`,
                });
              }
            }
          }
        } catch (categoryError) {
          console.warn("Could not fetch category info:", categoryError);
          // Keep default category info
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, selectedSort]); // Re-load when category ID or sort changes

  async function reloadProducts() {
    try {
      setLoading(true);
      setError(null);

      const result = await getAliExpressProductsParsed({
        query: "", // Empty string as requested
        categoryIds: parseInt(id) || 0, // Use the real AliExpress category ID from URL
        pageSize: 50,
        sort: selectedSort,
        targetCurrency: "USD",
        targetLanguage: "EN",
      });

      setProducts(result.products);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.sale_price);
    const priceInRange =
      price >= selectedPriceRange.min && price <= selectedPriceRange.max;

    // Color filtering is simulated since AliExpress API doesn't provide color info
    // In a real app, you'd extract this from product titles or use a separate API
    return priceInRange;
  });

  const categoryName = categoryInfo.name;
  const categoryDescription = categoryInfo.description;

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
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600">{categoryDescription}</p>
          </div>

          {/* Results count and view toggle */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">
              {filteredProducts.length} products
            </span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg"
            >
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`space-y-6 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Sort By
                </h3>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range}
                        onChange={() => setSelectedPriceRange(range)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Color
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`relative w-8 h-8 rounded-full ${
                        color.color
                      } ${
                        selectedColor === color.value
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.product_id} product={product} />
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {filteredProducts.length > 0 && (
                  <div className="text-center mt-12">
                    <button
                      onClick={reloadProducts}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Subscribe to our emails
          </h2>
          <p className="text-gray-600 mb-8">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
