"use client";

import { useState } from "react";
import { useAliExpressSearch } from "@/hooks/useAliexpress";
import ProductGrid from "./ProductGrid";

export default function AliExpressProductDemo() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading, error } = useAliExpressSearch(searchQuery);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        AliExpress Product Search Demo
      </h1>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products (min 2 characters)..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-sm text-gray-600">
          {isLoading && <p>Loading products...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {products && (
            <p>
              Found {products.current_record_count} products out of{" "}
              {products.total_record_count} total
            </p>
          )}
        </div>
      </div>

      {products && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Results ({products.current_record_count} products)
          </h2>
          <ProductGrid
            products={products.products?.product ?? products.products ?? []}
          />
        </div>
      )}

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Using the Debounced Search Hook:</h4>
            <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
              {`const { data, isLoading, error } = useAliExpressSearch('phone case');
// Debounces by 1000ms, triggers when query >= 2 chars`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium">Direct API Call:</h4>
            <pre className="bg-white p-3 rounded mt-2 overflow-x-auto">
              {`const response = await fetch('/api/aliexpress/product?query=laptop');
const data = await response.json();`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
