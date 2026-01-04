"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import { AliExpressProduct } from "@/types/aliexpress";
import { parseEvaluateRate } from "@/utils/parseEvaluateRate";

export default function ProductCard({
  product,
}: {
  product: AliExpressProduct;
}) {
  const salePrice = parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.original_price);
  const discount =
    originalPrice > salePrice
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  return (
    <Link href={`/product/${product.product_id}`} className="group block">
      <div className="relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square bg-gray-50">
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {discount}% OFF
            </div>
          )}
          <Image
            src={`${product.product_main_image_url}_300x300.jpg`}
            alt={product.product_title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.product_title}
          </h3>

          <div className="flex items-center space-x-1">
            <StarRating
              rating={parseEvaluateRate(product.evaluate_rate)}
              reviewCount={product.lastest_volume}
            />
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

          <div className="text-xs text-gray-500">
            {product.lastest_volume} sold
          </div>
        </div>
      </div>
    </Link>
  );
}
