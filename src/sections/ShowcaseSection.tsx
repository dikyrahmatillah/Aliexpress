"use client";

import Link from "next/link";
import { AliexpressResponse } from "@/types/aliexpress";
import ShowcaseProductCard from "@/components/ShowcaseProductCard";

interface ShowcaseSectionProps {
  productsData?: AliexpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

export default function ShowcaseSection({
  productsData,
  isLoading = false,
  error = null,
}: ShowcaseSectionProps) {
  const products = productsData?.products || [];

  const filteredProducts = products.slice(0, 8);
  const skeletonItems = Array.from({ length: 8 }, (_, idx) => idx);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hot Products from{" "}
            <Link
              href="https://www.aliexpress.com"
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              AliExpress
            </Link>
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {skeletonItems.map((item) => (
              <div
                key={item}
                className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="flex items-center space-x-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load products: {String(error)}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, idx) => (
                <ShowcaseProductCard
                  key={product.product_id || idx}
                  product={product}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No products available.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
