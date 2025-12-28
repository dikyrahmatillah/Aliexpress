"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import CarouselButton from "@/components/CarouselButton";
import { AliExpressProduct } from "@/types/aliexpress";
import { brands } from "@/data/brandsData";
import BrandCard from "@/components/BrandCard";

interface AliExpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: AliExpressProduct[];
}

interface FeaturedSectionProps {
  productsData?: AliExpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

interface FeaturedProductCardProps {
  product: AliExpressProduct;
  visibleCount: number;
}

function FeaturedProductCard({
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

export default function FeaturedSection({
  productsData,
  isLoading = false,
  error = null,
}: FeaturedSectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [startIdx, setStartIdx] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  // Check if we should use fallback data
  const shouldUseFallback = useFallback || (error && !isLoading);

  // Use the passed data or fallback to brands
  const allProducts = useMemo(() => {
    return shouldUseFallback ? [] : productsData?.products?.slice(0, 9) || [];
  }, [shouldUseFallback, productsData]);
  const fallbackItems = brands;

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      setVisibleCount(
        w < 640 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : w < 1600 ? 4 : 5
      );
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const itemsToUse = shouldUseFallback ? fallbackItems : allProducts;
    if (startIdx > itemsToUse.length - visibleCount && itemsToUse.length > 0) {
      setStartIdx(Math.max(0, itemsToUse.length - visibleCount));
    }
  }, [shouldUseFallback, allProducts, fallbackItems, visibleCount, startIdx]);

  const scroll = (dir: "left" | "right") => {
    const itemsToUse = shouldUseFallback ? fallbackItems : allProducts;
    setStartIdx((prev) =>
      dir === "left"
        ? Math.max(0, prev - 1)
        : Math.min(itemsToUse.length - visibleCount, prev + 1)
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="px-4">
        <h2 className="text-5xl font-extrabold text-center mb-10">
          Featured Products
          {error && (
            <div className="text-sm text-red-500 font-normal mt-2">
              (Using fallback data due to API issues)
            </div>
          )}
        </h2>
        <div className="flex justify-center mb-12">
          <div className="w-40 h-2 bg-gray-200 rounded-full" />
        </div>

        {!shouldUseFallback && allProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading featured products...</p>
            <button
              onClick={() => setUseFallback(true)}
              className="mt-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              Use Fallback Data
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <CarouselButton
                direction="left"
                onClick={() => scroll("left")}
                disabled={startIdx === 0}
              />
            </div>
            <div className="flex gap-2 pb-4 w-full justify-center">
              {shouldUseFallback
                ? fallbackItems
                    .slice(startIdx, startIdx + visibleCount)
                    .map((brand, idx) => (
                      <BrandCard
                        key={brand.name + idx}
                        brand={brand}
                        visibleCount={visibleCount}
                      />
                    ))
                : allProducts
                    .slice(startIdx, startIdx + visibleCount)
                    .map((product, idx) => (
                      <FeaturedProductCard
                        key={Number(product.product_id) + idx}
                        product={product}
                        visibleCount={visibleCount}
                      />
                    ))}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <CarouselButton
                direction="right"
                onClick={() => scroll("right")}
                disabled={
                  shouldUseFallback
                    ? startIdx === fallbackItems.length - visibleCount ||
                      fallbackItems.length <= visibleCount
                    : startIdx === allProducts.length - visibleCount ||
                      allProducts.length <= visibleCount
                }
              />
            </div>
          </div>
        )}

        {shouldUseFallback && !useFallback && (
          <div className="text-center mt-8">
            <button
              onClick={() => setUseFallback(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try AliExpress Data Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
