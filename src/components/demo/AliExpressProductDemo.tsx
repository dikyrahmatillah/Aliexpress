"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useAliExpressProducts,
  useAliExpressProductsMutation,
} from "@/hooks/useAliexpress";
import { FiPlay } from "react-icons/fi";
import { AliExpressProduct } from "@/types/aliexpress";

export default function AliExpressProductDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  // Suggestions (debounced) from the hook
  //   const { data: suggestionsData, isLoading: SuggestionsLoading } =
  //     useAliExpressSearch(searchQuery);

  // Using the query hook (automatic fetching)
  const {
    data: products,
    isLoading,
    error,
  } = useAliExpressProducts({ query: activeQuery }, { enabled: !!activeQuery });

  const mutation = useAliExpressProductsMutation();

  const handleSearch = () => {
    setActiveQuery(searchQuery);
  };

  const handleMutationSearch = () => {
    mutation.mutate({
      query: searchQuery,
      pageSize: 20,
      sort: "LAST_VOLUME_DESC",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        AliExpress Product Search Demo
      </h1>

      {/* Search Input */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search (Query)
          </button>
          <button
            onClick={handleMutationSearch}
            disabled={!searchQuery.trim() || mutation.isPending}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Searching..." : "Search (Mutation)"}
          </button>
        </div>

        {/* Suggestions dropdown */}
        {/* {searchQuery.length >= 2 && (
          <div className="mb-4">
            {SuggestionsLoading && (
              <p className="text-sm">Loading suggestions...</p>
            )}
            {suggestionsData?.products?.length ? (
              <ul className="bg-white border rounded shadow max-h-56 overflow-auto">
                {formatAliExpressProducts(suggestionsData.products)
                  .slice(0, 6)
                  .map((s) => (
                    <li
                      key={s.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSearchQuery(s.title);
                        setActiveQuery(s.title); // trigger the main query
                      }}
                    >
                      <div className="flex justify-between">
                        <span className="truncate">{s.title}</span>
                        <span className="text-xs text-gray-500">
                          {s.priceFormatted}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              !SuggestionsLoading && (
                <p className="text-sm text-gray-500">No suggestions</p>
              )
            )}
          </div>
        )} */}

        {/* Status Display */}
        <div className="text-sm text-gray-600">
          {isLoading && <p>Loading products...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {mutation.error && (
            <p className="text-red-500">
              Mutation Error: {mutation.error.message}
            </p>
          )}
          {products && (
            <p>
              Found {products.current_record_count} products out of{" "}
              {products.total_record_count} total
            </p>
          )}
        </div>
      </div>

      {/* Query Results */}
      {products && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Query Results ({products.current_record_count} products)
          </h2>
          <ProductGrid
            products={products.products?.product ?? products.products ?? []}
          />
        </div>
      )}

      {/* Mutation Results */}
      {mutation.data &&
        (mutation.data.products?.product ?? mutation.data.products ?? [])
          .length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Mutation Results (
              {
                (
                  mutation.data.products?.product ??
                  mutation.data.products ??
                  []
                ).length
              }{" "}
              products)
            </h2>
            <ProductGrid
              products={
                mutation.data.products?.product ?? mutation.data.products ?? []
              }
            />
          </div>
        )}

      {/* Usage Example */}
      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Using the Query Hook:</h4>
            <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
              {`const { data, isLoading, error } = useAliExpressProducts(
  { query: 'phone case' },
  { enabled: true }
);`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium">Using the Mutation Hook:</h4>
            <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
              {`const mutation = useAliExpressProductsMutation();

mutation.mutate({
  query: 'wireless headphones',
  pageSize: 20,
  sort: 'LAST_VOLUME_DESC'
});`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium">Direct API Call:</h4>
            <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
              {`const response = await fetch('/api/aliexpress/product?query=laptop&parsed=true');
const data = await response.json();`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products }: { products: AliExpressProduct[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const hasDiscount =
          typeof product.discount === "number"
            ? product.discount > 0
            : !!product.discount;
        const showOriginal =
          typeof product.original_price === "number" &&
          typeof product.sale_price === "number"
            ? product.original_price > product.sale_price
            : false;
        return (
          <div
            key={product.product_id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square mb-3 relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              <Image
                src={product.product_main_image_url}
                alt={product.product_title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.svg";
                }}
              />
              {product.product_video_url && (
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <FiPlay className="w-4 h-4" />
                  Video
                </span>
              )}
            </div>

            <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">
              {product.product_title}
            </h3>

            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ${Number(product.sale_price).toFixed(2)}
                </span>
                {showOriginal && (
                  <span className="text-xs line-through text-gray-500">
                    ${Number(product.original_price).toFixed(2)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs text-red-600 font-semibold">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {product.lastest_volume} sold
              </span>
              {product.shop_name && (
                <span className="text-xs text-gray-700">
                  Shop: {product.shop_name}
                </span>
              )}
              {(product.first_level_category_name ||
                product.second_level_category_name) && (
                <span className="text-xs text-gray-400">
                  {product.first_level_category_name}
                  {product.second_level_category_name &&
                    ` / ${product.second_level_category_name}`}
                </span>
              )}
              {product.sku_id && (
                <span className="text-xs text-gray-300">
                  SKU: {product.sku_id}
                </span>
              )}
            </div>

            <a
              href={`https://www.aliexpress.com/item/${product.product_id}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
            >
              View on AliExpress
            </a>
          </div>
        );
      })}
    </div>
  );
}
