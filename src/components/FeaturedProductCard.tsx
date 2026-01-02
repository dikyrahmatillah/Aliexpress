"use client";

import Link from "next/link";
import Image from "next/image";
import { AliExpressProduct } from "@/types/aliexpress";

interface FeaturedProductCardProps {
  product: AliExpressProduct;
  visibleCount: number;
}

export default function FeaturedProductCard({
  product,
  visibleCount,
}: FeaturedProductCardProps) {
  const salePrice = parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.original_price);
  const discount =
    originalPrice > salePrice
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  return (
    <div
      style={{
        flex: `0 0 calc(${100 / visibleCount}% - 0.5rem)`,
        maxWidth: `calc(${100 / visibleCount}% - 0.5rem)`,
        minWidth: 0,
      }}
    >
      <Link
        href={`/product/${product.product_id}`}
        className="group block"
        rel="noopener noreferrer"
      >
        <div className="relative">
          {discount > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              -{discount}%
            </div>
          )}
          <div className="aspect-square overflow-hidden rounded-lg bg-white border">
            <Image
              src={`${product.product_main_image_url}_300x300.jpg`}
              alt={product.product_title}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.product_title}
          </h3>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900">
              ${salePrice.toFixed(2)}
            </span>
            {originalPrice > salePrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {product.lastest_volume} sold
          </div>
        </div>
      </Link>
    </div>
  );
}
