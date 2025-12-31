"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AliexpressResponse } from "@/types/aliexpress";
import CategoryCard from "@/components/CategoryCard";
import CarouselButton from "@/components/CarouselButton";
import { parseEvaluateRate } from "@/utils/parseEvaluateRate";

interface SideImage {
  url: string;
  link: string;
  alt: string;
  position?: "left" | "right";
}

interface RelatedSectionProps {
  sideImage?: SideImage;
  productsData?: AliexpressResponse;
  buttonSide?: "left" | "right" | "both";
  isLoading?: boolean;
}

export default function RelatedSection({
  sideImage,
  buttonSide = "right",
  productsData,
  isLoading = false,
}: RelatedSectionProps) {
  const sideImageRight = sideImage?.position === "right";
  const [visibleCount, setVisibleCount] = useState(4);
  const [carouselItems, setCarouselItems] = useState(
    productsData?.products || []
  );

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

  useEffect(() => {
    const nextItems = productsData?.products || [];
    setCarouselItems(nextItems);
  }, [productsData]);

  const scroll = useCallback((dir: "left" | "right") => {
    setCarouselItems((prev) => {
      if (prev.length === 0) return prev;
      if (dir === "right") {
        return [...prev.slice(1), prev[0]];
      }
      return [prev[prev.length - 1], ...prev.slice(0, -1)];
    });
  }, []);

  return (
    <section className="py-10">
      <div className="px-4">
        <div
          className={`flex gap-6 items-center ${
            sideImageRight ? "flex-row-reverse" : ""
          }`}
        >
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
          <div className={`relative ${sideImage ? "w-full" : "w-full"}`}>
            <div className="relative w-full">
              {(buttonSide === "left" || buttonSide === "both") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                  <CarouselButton
                    direction="left"
                    onClick={() => scroll("left")}
                  />
                </div>
              )}

              <div className="flex gap-4 pb-2 w-full justify-center items-stretch">
                {isLoading
                  ? Array.from({ length: Math.max(visibleCount, 4) }).map(
                      (_, sidx) => (
                        <div
                          key={`s-${sidx}`}
                          className="w-48 bg-gray-100 animate-pulse rounded-md h-64 mx-2"
                        />
                      )
                    )
                  : carouselItems.slice(0, visibleCount).map((cat, idx) => (
                      <div
                        key={cat.product_title + idx}
                        style={{
                          flex: `0 0 calc(${100 / visibleCount}% - 1rem)`,
                          maxWidth: `calc(${100 / visibleCount}% - 1rem)`,
                          minWidth: 0,
                        }}
                      >
                        <CategoryCard
                          title={cat.product_title}
                          discount={
                            cat.discount ? `${cat.discount} off` : undefined
                          }
                          imageUrl={cat.product_main_image_url}
                          linkUrl={`/product/${cat.product_id}`}
                          price={cat.sale_price}
                          rating={parseEvaluateRate(cat.evaluate_rate)}
                        />
                      </div>
                    ))}
              </div>

              {(buttonSide === "right" || buttonSide === "both") && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
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
