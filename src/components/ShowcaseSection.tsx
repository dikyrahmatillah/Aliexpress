"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mattresses } from "../data/mattresses";
import StarRating from "./StarRating";

const sizes = [
  "Queen",
  "Single",
  "King Single",
  "Double",
  "King",
  "Super King",
];

function MattressCard({ mattress }: { mattress: (typeof mattresses)[0] }) {
  return (
    <Link href={mattress.href} className="group">
      <div className="relative">
        {mattress.badge && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            {mattress.badge}
          </div>
        )}
        <div className="aspect-square overflow-hidden rounded-lg bg-white">
          <Image
            src={mattress.image}
            alt={mattress.name}
            width={360}
            height={360}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {mattress.name}
        </h3>
        <StarRating
          rating={mattress.rating}
          reviewCount={mattress.reviewCount}
        />
        <p className="text-sm text-gray-600">{mattress.sizes}</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            From ${mattress.salePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${mattress.price.toLocaleString()}
          </span>
          <span className="text-sm text-green-600 font-medium">
            Save ${(mattress.price - mattress.salePrice).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShowcaseSection() {
  const [selectedSize, setSelectedSize] = useState<string>("Queen");
  const filteredMattresses = mattresses.filter((m) =>
    m.sizeList.includes(selectedSize)
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Australia&apos;s most awarded{" "}
            <Link
              href="/collections/mattresses"
              className="text-blue-600 hover:text-blue-800"
            >
              mattress
            </Link>{" "}
            brand
          </h2>
        </div>
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4 bg-white rounded-lg p-1 shadow-sm">
            {sizes.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSize(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {filteredMattresses.length > 0 ? (
            filteredMattresses.map((mattress, idx) => (
              <MattressCard key={idx} mattress={mattress} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No mattresses available for this size.
            </div>
          )}
        </div>
        <div className="text-center space-y-4">
          <Link
            href="/collections/queen-mattresses"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            See All Mattresses
          </Link>
        </div>
      </div>
    </section>
  );
}
