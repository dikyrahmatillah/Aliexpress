"use client";

import { useAliExpressHotProducts } from "@/hooks/useAliexpress";

export default function TestPage() {
  const { data, isLoading, error } = useAliExpressHotProducts(0, {
    useMock: false,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AliExpress API Test</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {String(error)}</p>}

      {data && (
        <div>
          <p className="mb-4">Found {data.products.length} products</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.products.slice(0, 6).map((product) => (
              <div key={product.product_id} className="border p-4 rounded-lg">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-2"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
                <h3 className="font-medium text-sm line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-green-600">${product.sale_price}</p>
                <p className="text-gray-500 text-sm">{product.volume} sold</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
