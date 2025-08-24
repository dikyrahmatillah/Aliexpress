"use client";

import Image from "next/image";
import Link from "next/link";
import { ProcessedProduct } from "@/types/aliexpress";
import StarRating from "../components/StarRating";

interface AliExpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: ProcessedProduct[];
}

interface ShowcaseSectionProps {
  productsData?: AliExpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

function ProductCard({ product }: { product: ProcessedProduct }) {
  const salePrice = parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.original_price);
  const discount =
    originalPrice > salePrice
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  return (
    <Link
      href={`/product/${product.product_id}`}
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
        <div className="aspect-square overflow-hidden bg-white">
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
        <StarRating
          rating={product.evaluate_rate}
          reviewCount={product.volume}
        />
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

export default function ShowcaseSection({
  productsData,
  isLoading = false,
  error = null,
}: ShowcaseSectionProps) {
  // Transform AliExpress data before displaying
  const transformedProducts =
    productsData?.products?.map((product) => ({
      ...product,
      displayTitle: product.title.toUpperCase(),
      sale_price: (parseFloat(product.sale_price) * 1.1).toFixed(2),
    })) || [];

  // Use transformed products instead of raw products
  const filteredProducts = transformedProducts.slice(0, 8);

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
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.product_id || idx}
                  product={{
                    ...product,
                    title: product.displayTitle,
                    sale_price: product.sale_price,
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No products available.
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
      </div>
    </section>
  );
}
