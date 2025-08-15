"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ShowcaseSection() {
  const mattresses = [
    {
      name: "Koala Luxe Mattress",
      price: 2390,
      salePrice: 1792,
      rating: 4.8,
      reviewCount: 507,
      image:
        "https://au.koala.com/cdn/shop/files/Queen_Luxe_Mattress_1_3.webp?v=1728130989&width=360",
      badge: "Save 22%",
      sizes: "Queen, 4 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single"], // Added for filtering
      href: "/products/koala-luxe-mattress",
    },
    {
      name: "Koala Plus Mattress",
      price: 1650,
      salePrice: 1287,
      rating: 4.8,
      reviewCount: 904,
      image:
        "https://au.koala.com/cdn/shop/files/PlusMattress_4_1.jpg?v=1728227347&width=360",
      badge: "Save 20%",
      sizes: "Queen, 6 Sizes",
      sizeList: [
        "Queen",
        "King",
        "Double",
        "King Single",
        "Single",
        "Super King",
      ],
      href: "/products/koala-plus-mattress",
    },
    {
      name: "Koala Mattress",
      price: 1290,
      salePrice: 1032,
      rating: 4.8,
      reviewCount: 2417,
      image:
        "https://au.koala.com/cdn/shop/files/AU_-_The_New_Koala_Mattress_-_Queen_-_1_2.webp?v=1728135769&width=360",
      badge: "Save 20%",
      sizes: "Queen, 5 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single", "Single"],
      href: "/products/koala-mattress",
    },
    {
      name: "Koala SE Mattress",
      price: 950,
      salePrice: 855,
      rating: 4.8,
      reviewCount: 665,
      image:
        "https://au.koala.com/cdn/shop/files/SEMattress_12_1_869df618-64d5-4f28-b432-ae4aa71c1bd5.jpg?v=1728227524&width=360",
      badge: "Save 10%",
      sizes: "Queen, 5 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single", "Single"],
      href: "/products/koala-se-mattress",
    },
    {
      name: "Koala Lite Mattress",
      price: 790,
      salePrice: 632,
      rating: 4.5,
      reviewCount: 300,
      image:
        "https://au.koala.com/cdn/shop/files/LiteMattress_1_1.jpg?v=1728227347&width=360",
      badge: "Save 20%",
      sizes: "Queen, 4 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single"],
      href: "/products/koala-lite-mattress",
    },
    {
      name: "Koala Lite Mattress",
      price: 790,
      salePrice: 632,
      rating: 4.5,
      reviewCount: 300,
      image:
        "https://au.koala.com/cdn/shop/files/LiteMattress_1_1.jpg?v=1728227347&width=360",
      badge: "Save 20%",
      sizes: "Queen, 4 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single"],
      href: "/products/koala-lite-mattress",
    },
    {
      name: "Koala Lite Mattress",
      price: 790,
      salePrice: 632,
      rating: 4.5,
      reviewCount: 300,
      image:
        "https://au.koala.com/cdn/shop/files/LiteMattress_1_1.jpg?v=1728227347&width=360",
      badge: "Save 20%",
      sizes: "Queen, 4 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single"],
      href: "/products/koala-lite-mattress",
    },
    {
      name: "Koala Lite Mattress",
      price: 790,
      salePrice: 632,
      rating: 4.5,
      reviewCount: 300,
      image:
        "https://au.koala.com/cdn/shop/files/LiteMattress_1_1.jpg?v=1728227347&width=360",
      badge: "Save 20%",
      sizes: "Queen, 4 Sizes",
      sizeList: ["Queen", "King", "Double", "King Single"],
      href: "/products/koala-lite-mattress",
    },
  ];

  const sizes = [
    "Queen",
    "Single",
    "King Single",
    "Double",
    "King",
    "Super King",
  ];

  const [selectedSize, setSelectedSize] = useState<string>("Queen");

  const filteredMattresses = mattresses.filter((mattress) =>
    mattress.sizeList.includes(selectedSize)
  );

  const StarRating = ({
    rating,
    reviewCount,
  }: {
    rating: number;
    reviewCount: number;
  }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
      </div>
    );
  };

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

        {/* Size Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4 bg-white rounded-lg p-1 shadow-sm">
            {sizes.map((size, index) => (
              <button
                key={index}
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
            filteredMattresses.map((mattress, index) => (
              <Link key={index} href={mattress.href} className="group">
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
                      Save $
                      {(mattress.price - mattress.salePrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No mattresses available for this size.
            </div>
          )}
        </div>

        {/* CTA Buttons */}
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
