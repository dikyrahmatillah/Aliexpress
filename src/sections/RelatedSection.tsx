"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProcessedProduct } from "@/types/aliexpress";
import CategoryCard from "@/components/CategoryCard";
import CarouselButton from "@/components/CarouselButton";

export interface SideImage {
  url: string;
  link: string;
  alt: string;
}

interface AliExpressResponse {
  total_record_count: number;
  current_record_count: number;
  products: ProcessedProduct[];
}

interface CategorySectionProps {
  sideImage?: SideImage;
  sideImageRight?: boolean;
  buttonSide?: "left" | "right" | "both";
  productsData?: AliExpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

export default function RelatedSection({
  sideImage,
  sideImageRight = false,
  buttonSide = "right",
  productsData,
  isLoading = false,
  error = null,
}: CategorySectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [carouselItems, setCarouselItems] = useState(
    productsData?.products || []
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setVisibleCount(
        width < 640
          ? 1
          : width < 900
          ? 2
          : width < 1200
          ? 3
          : width < 1600
          ? 4
          : 5
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update carouselItems when product changes
  useEffect(() => {
    setCarouselItems(productsData?.products || []);
  }, [productsData]);

  useEffect(() => {
    // keep activeIndex within bounds when items change
    setActiveIndex((i) =>
      Math.max(0, Math.min(i, (productsData?.products?.length || 1) - 1))
    );
  }, [productsData]);

  const scroll = useCallback((dir: "left" | "right") => {
    setCarouselItems((prev) => {
      if (prev.length === 0) return prev;
      if (dir === "right") {
        setActiveIndex((i) => (i + 1) % prev.length);
        return [...prev.slice(1), prev[0]];
      }
      setActiveIndex((i) => (i - 1 + prev.length) % prev.length);
      return [prev[prev.length - 1], ...prev.slice(0, -1)];
    });
  }, []);

  // keyboard navigation
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scroll("right");
      if (e.key === "ArrowLeft") scroll("left");
    },
    [scroll]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <section className="py-10">
      <div className="px-4">
        <div
          className={`flex gap-6 items-center ${
            sideImageRight ? "flex-row-reverse" : ""
          }`}
        >
          {/* Side Image */}
          {sideImage && (
            <div className="hidden md:block w-1/5 flex-shrink-0">
              <Link href={sideImage.link}>
                <Image
                  src={sideImage.url}
                  alt={sideImage.alt}
                  width={480}
                  height={480}
                  className="object-cover mx-auto"
                />
              </Link>
            </div>
          )}
          {/* Carousel */}
          <div className={`relative ${sideImage ? "w-full" : "w-full"}`}>
            <div className="relative w-full">
              {/* Left Button - Centered vertically */}
              {(buttonSide === "left" || buttonSide === "both") && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                  <CarouselButton
                    direction="left"
                    onClick={() => scroll("left")}
                  />
                </div>
              )}

              <div className="flex gap-4 pb-2 w-full justify-center items-stretch">
                {isLoading ? (
                  // simple skeletons
                  Array.from({ length: Math.max(visibleCount, 3) }).map(
                    (_, sidx) => (
                      <div
                        key={`s-${sidx}`}
                        className="w-48 bg-gray-100 animate-pulse rounded-md h-64 mx-2"
                      />
                    )
                  )
                ) : error ? (
                  <div className="text-red-600">
                    Failed to load related products.
                  </div>
                ) : (
                  carouselItems.slice(0, visibleCount).map((cat, idx) => (
                    <div
                      key={cat.title + idx}
                      style={{
                        flex: `0 0 calc(${100 / visibleCount}% - 1rem)`,
                        maxWidth: `calc(${100 / visibleCount}% - 1rem)`,
                        minWidth: 0,
                      }}
                    >
                      <CategoryCard
                        title={cat.title}
                        discount={
                          cat.discount ? `${cat.discount} off` : undefined
                        }
                        imageUrl={cat.image_url}
                        linkUrl={`/product/${cat.product_id}`}
                        price={cat.sale_price}
                        rating={cat.evaluate_rate}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* indicators */}
              {!isLoading && !error && carouselItems.length > visibleCount && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  {carouselItems.slice(0, carouselItems.length).map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      aria-label={`Go to item ${i + 1}`}
                      onClick={() => {
                        const rotate =
                          (i - activeIndex + carouselItems.length) %
                          carouselItems.length;
                        const newItems = [...carouselItems];
                        for (let r = 0; r < rotate; r++)
                          newItems.push(newItems.shift()!);
                        setCarouselItems(newItems);
                        setActiveIndex(i);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Right Button - Centered vertically */}
              {(buttonSide === "right" || buttonSide === "both") && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                  <CarouselButton
                    direction="right"
                    onClick={() => scroll("right")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
