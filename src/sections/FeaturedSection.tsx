"use client";

import { useState, useEffect } from "react";
import CarouselButton from "@/components/CarouselButton";
import { AliexpressResponse } from "@/types/aliexpress";
import FeaturedProductCard from "@/components/FeaturedProductCard";

interface FeaturedSectionProps {
  productsData?: AliexpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

export default function FeaturedSection({
  productsData,
  isLoading = false,
  error = null,
}: FeaturedSectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [startIdx, setStartIdx] = useState(0);

  const products = productsData?.products || [];
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

  const scroll = (dir: "left" | "right") => {
    setStartIdx((prev) =>
      dir === "left"
        ? Math.max(0, prev - 1)
        : Math.max(0, Math.min(products.length - visibleCount, prev + 1))
    );
  };

  const canScrollLeft = startIdx > 0;
  const canScrollRight =
    products.length > visibleCount && startIdx < products.length - visibleCount;

  return (
    <section className="py-16 bg-white">
      <div className="px-4">
        <h2 className="text-5xl font-extrabold text-center mb-10">
          Featured Products
        </h2>
        <div className="flex justify-center mb-12">
          <div className="w-40 h-2 bg-gray-200 rounded-full" />
        </div>

        {isLoading ? (
          <div className="flex gap-4 pb-4 w-full justify-center">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div
                key={i}
                className="w-48 sm:w-56 md:w-64 lg:w-72 bg-white rounded-lg p-4 shadow-sm flex-shrink-0"
              >
                <div className="h-44 bg-gray-200 rounded-md animate-pulse" />
                <div className="mt-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="mt-2 text-gray-600">
              Failed to load featured products.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <CarouselButton
                direction="left"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
              />
            </div>
            <div className="flex gap-2 pb-4 w-full justify-center">
              {products
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
                disabled={!canScrollRight}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
