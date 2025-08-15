"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categoriesData";

const sideImage = {
  url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  link: "https://unsplash.com/photos/1506744038136-46273834b3fb",
  alt: "Unsplash nature example",
};

const CategoryCard = ({
  title,
  discount,
  imageUrl,
  linkUrl,
}: {
  title: string;
  discount?: string;
  imageUrl: string;
  linkUrl: string;
}) => (
  <div className="w-full max-w-xs flex-shrink-0 mx-2">
    <Link href={linkUrl} className="block">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={350}
          height={350}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-base font-medium">{title}</h3>
      </div>
    </Link>
  </div>
);

interface CategorySectionProps {
  sideImageRight?: boolean;
  buttonSide?: "left" | "right";
}

export default function CategorySection({
  sideImageRight = false,
  buttonSide = "right",
}: CategorySectionProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [carouselItems, setCarouselItems] = useState(categories);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 900) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1200) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1600) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset carouselItems if categories change
  useEffect(() => {
    setCarouselItems(categories);
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    setCarouselItems((prev) => {
      if (direction === "right") {
        // Move first item to end
        return [...prev.slice(1), prev[0]];
      } else {
        // Move last item to start
        return [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];
      }
    });
  };

  // Layout order based on sideImageRight
  const content = (
    <>
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
      {/* Carousel with buttons */}
      <div className="w-full relative">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="relative w-full">
          {buttonSide === "left" && (
            <button
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition hidden md:block"
              onClick={() => scroll("left")}
              type="button"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
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
            <button
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition hidden md:block"
              onClick={() => scroll("right")}
              type="button"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <section className="py-10">
      <div className="px-4">
        <div
          className={`flex gap-6 items-center ${
            sideImageRight ? "flex-row-reverse" : ""
          }`}
        >
          {content}
        </div>
      </div>
    </section>
  );
}
