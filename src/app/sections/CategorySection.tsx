"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProcessedProduct } from "@/types/aliexpress";
import { categories } from "@/data/categoriesData";
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
  sideImage: SideImage;
  sideImageRight?: boolean;
  buttonSide?: "left" | "right";
  product?: AliExpressResponse;
  isLoading?: boolean;
  error?: Error | null;
}

// AliExpress category IDs for different product categories
const CATEGORY_MAPPING = [
  { id: 7, name: "Electronics", discount: "Up to 30% off" },
  { id: 15, name: "Home & Garden", discount: "Up to 25% off" },
  { id: 30, name: "Health & Beauty", discount: "Up to 20% off" },
  { id: 66, name: "Sports & Entertainment", discount: "Up to 35% off" },
  { id: 13, name: "Fashion", discount: "Up to 40% off" },
  { id: 1420, name: "Automobiles", discount: "Up to 25% off" },
  { id: 5, name: "Phones & Telecommunications", discount: "Up to 30% off" },
  { id: 44, name: "Jewelry & Accessories", discount: "Up to 50% off" },
];

export default function CategorySection({
  sideImage,
  sideImageRight = false,
  buttonSide = "right",
  product,
  isLoading = false,
  error = null,
}: CategorySectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [carouselItems, setCarouselItems] = useState(categories);

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

  const scroll = (dir: "left" | "right") => {
    setCarouselItems((prev) =>
      dir === "right"
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
          {/* Carousel */}
          <div className="w-full relative">
            <h2 className="text-2xl font-bold mb-4">
              Categories
              {isLoading && (
                <span className="text-sm text-gray-500 ml-2">(Loading...)</span>
              )}
              {error && (
                <span className="text-sm text-red-500 ml-2">
                  (Using fallback data)
                </span>
              )}
            </h2>
            <div className="relative w-full">
              {buttonSide === "left" && (
                <CarouselButton
                  direction="left"
                  onClick={() => scroll("left")}
                />
              )}
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
                    <CategoryCard {...cat} />
                  </div>
                ))}
              </div>
              {buttonSide === "right" && (
                <CarouselButton
                  direction="right"
                  onClick={() => scroll("right")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
