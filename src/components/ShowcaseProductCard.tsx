"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import { AliExpressProduct } from "@/types/aliexpress";

export default function ShowcaseProductCard({
  product,
}: {
  product: AliExpressProduct;
}) {
  const salePrice = parseFloat(product.sale_price);
  const originalPrice = parseFloat(product.original_price);
  const ratingValue = Number(
    String(product.evaluate_rate).replace("%", "") || 0
  );
  const discount =
    originalPrice > salePrice
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  return (
    <Link href={`/product/${product.product_id}`} className="group">
      <div className="relative">
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Save {discount}%
          </div>
        )}
        <div className="aspect-square overflow-hidden bg-white">
          <Image
            src={`${product.product_main_image_url}_350x350.jpg`}
            alt={product.product_title}
            width={350}
            height={350}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.product_title}
        </h3>
        <StarRating rating={ratingValue} reviewCount={product.lastest_volume} />
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
          {product.lastest_volume} sold | {product.shop_name}
        </div>
      </div>
    </Link>
  );
}
