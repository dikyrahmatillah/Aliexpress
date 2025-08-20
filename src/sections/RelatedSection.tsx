"use client";

import React, { useState, useEffect } from "react";
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
  hotProductsData?: AliExpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

export default function RelatedSection({
  sideImage,
  sideImageRight = false,
  buttonSide = "right",
  hotProductsData,
  isLoading = false,
  error = null,
}: CategorySectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [carouselItems, setCarouselItems] = useState(
    hotProductsData?.products || []
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

  // Update carouselItems when product changes
  useEffect(() => {
    setCarouselItems(hotProductsData?.products || []);
  }, [hotProductsData]);

  const scroll = (dir: "left" | "right") => {
    setCarouselItems((prev) =>
      prev.length === 0
        ? prev
        : dir === "right"
        ? [...prev.slice(1), prev[0]]
        : [prev[prev.length - 1], ...prev.slice(0, -1)]
    );
  };

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
              {buttonSide === "left" ||
                (buttonSide === "both" && (
                  <CarouselButton
                    direction="left"
                    onClick={() => scroll("left")}
                  />
                ))}
              <div className="flex gap-4 pb-2 w-full justify-center">
                {carouselItems.slice(0, visibleCount).map((cat, idx) => (
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
                      linkUrl={`/item/${cat.product_id}`}
                    />
                  </div>
                ))}
              </div>
              {buttonSide === "right" ||
                (buttonSide === "both" && (
                  <CarouselButton
                    direction="right"
                    onClick={() => scroll("right")}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
