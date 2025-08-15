"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { brands } from "@/data/brandsData";
import BrandCard from "@/components/BrandCard";

export default function FeaturedSection() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [startIdx, setStartIdx] = useState(0);

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
    if (startIdx > brands.length - visibleCount) {
      setStartIdx(Math.max(0, brands.length - visibleCount));
    }
  }, [visibleCount, startIdx]);

  const scroll = (dir: "left" | "right") => {
    setStartIdx((prev) =>
      dir === "left"
        ? Math.max(0, prev - 1)
        : Math.min(brands.length - visibleCount, prev + 1)
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="px-4">
        <h2 className="text-5xl font-extrabold text-center mb-10">
          <Link
            href="https://sixsilver.pl/kategoria/marki/"
            className="hover:text-blue-600"
            title="Marki modowe"
          >
            Featured Products
          </Link>
        </h2>
        <div className="flex justify-center mb-12">
          <div className="w-40 h-2 bg-gray-200 rounded-full" />
        </div>
        <div className="relative">
          <CarouselButton
            direction="left"
            onClick={() => scroll("left")}
            disabled={startIdx === 0}
          />
          <div className="flex gap-2 pb-4 w-full justify-center">
            {brands
              .slice(startIdx, startIdx + visibleCount)
              .map((brand, idx) => (
                <BrandCard
                  key={brand.name + idx}
                  brand={brand}
                  visibleCount={visibleCount}
                />
              ))}
          </div>
          <CarouselButton
            direction="right"
            onClick={() => scroll("right")}
            disabled={
              startIdx === brands.length - visibleCount ||
              brands.length <= visibleCount
            }
          />
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={`Scroll ${direction}`}
      className={`absolute ${
        direction === "left" ? "left-0" : "right-0"
      } top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition hidden md:block`}
      onClick={onClick}
      type="button"
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {direction === "left" ? (
          <path d="M15 19l-7-7 7-7" />
        ) : (
          <path d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}
