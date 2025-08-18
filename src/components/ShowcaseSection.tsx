"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProcessedProduct } from "@/types/aliexpress";
import { mattresses } from "../data/mattresses";
import StarRating from "./StarRating";

interface AliExpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: ProcessedProduct[];
}

interface ShowcaseSectionProps {
  hotProductsData?: AliExpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

const categories = [
  { id: 7, name: "Electronics" },
  { id: 15, name: "Home & Garden" },
  { id: 30, name: "Health & Beauty" },
  { id: 66, name: "Sports" },
  { id: 13, name: "Fashion" },
  { id: 1420, name: "Automobiles" },
];

function ProductCard({ product }: { product: ProcessedProduct }) {
  const salePrice = parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.original_price);
  const discount =
    originalPrice > salePrice
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  return (
    <Link
      href={`https://www.aliexpress.com/item/${product.product_id}.html`}
      className="group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative">
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Save {discount}%
          </div>
        )}
        <div className="aspect-square overflow-hidden rounded-lg bg-white">
          <Image
            src={product.image_url}
            alt={product.title}
            width={360}
            height={360}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <StarRating rating={4.5} reviewCount={product.volume} />
        <p className="text-sm text-gray-600">
          {product.first_level_category_name}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            ${salePrice.toFixed(2)}
          </span>
          {originalPrice > salePrice && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Save ${(originalPrice - salePrice).toFixed(2)}
              </span>
            </>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {product.volume} sold | {product.shop_name}
        </div>
      </div>
    </Link>
  );
}

function MattressCard({ mattress }: { mattress: (typeof mattresses)[0] }) {
  return (
    <Link href={mattress.href} className="group">
      <div className="relative">
        {mattress.badge && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            {mattress.badge}
          </div>
        )}
        <div className="aspect-square overflow-hidden rounded-lg bg-white">
          <Image
            src={mattress.image}
            alt={mattress.name}
            width={360}
            height={360}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {mattress.name}
        </h3>
        <StarRating
          rating={mattress.rating}
          reviewCount={mattress.reviewCount}
        />
        <p className="text-sm text-gray-600">{mattress.sizes}</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            From ${mattress.salePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${mattress.price.toLocaleString()}
          </span>
          <span className="text-sm text-green-600 font-medium">
            Save ${(mattress.price - mattress.salePrice).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShowcaseSection({
  hotProductsData,
  isLoading = false,
  error = null,
}: ShowcaseSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(7);
  const [useFallback, setUseFallback] = useState(false);

  // Check if we should use fallback data
  const shouldUseFallback = useFallback || (error && !isLoading);

  // Filter products by selected category if we have hot products data
  const filteredProducts = shouldUseFallback
    ? []
    : hotProductsData?.products
        ?.filter(
          (product) =>
            product.first_level_category_id === selectedCategory.toString()
        )
        .slice(0, 8) || [];

  const filteredMattresses = mattresses.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {shouldUseFallback ? (
              <>
                Australia&apos;s most awarded{" "}
                <Link
                  href="/collections/mattresses"
                  className="text-blue-600 hover:text-blue-800"
                >
                  mattress
                </Link>{" "}
                brand
              </>
            ) : (
              <>
                Hot Products from{" "}
                <Link
                  href="https://www.aliexpress.com"
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AliExpress
                </Link>
              </>
            )}
          </h2>
        </div>

        {!shouldUseFallback ? (
          <>
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4 bg-white rounded-lg p-1 shadow-sm flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    type="button"
                  >
                    {category.name}
                  </button>
                ))}
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800"
                  onClick={() => setUseFallback(true)}
                  type="button"
                >
                  Use Fallback
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading hot products...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">
                  Failed to load products: {String(error)}
                </p>
                <button
                  onClick={() => setUseFallback(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Use Fallback Data
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.product_id || idx}
                      product={product}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    No products available for this category.
                  </div>
                )}
              </div>
            )}

            <div className="text-center space-y-4">
              <Link
                href={`https://www.aliexpress.com`}
                className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                See All Products on AliExpress
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {filteredMattresses.map((mattress, idx) => (
                <MattressCard key={idx} mattress={mattress} />
              ))}
            </div>
            <div className="text-center space-y-4">
              <Link
                href="/collections/queen-mattresses"
                className="inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                See All Mattresses
              </Link>
              <div>
                <button
                  onClick={() => setUseFallback(false)}
                  className="text-gray-600 hover:text-gray-800 font-medium ml-4"
                >
                  Try AliExpress Data Again
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
