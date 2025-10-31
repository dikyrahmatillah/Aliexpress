"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title?: string;
  discountPercent?: number;
}

export default function ImageGalleryClient({
  images = [],
  title = "",
  discountPercent = 0,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const mainImage =
    images[0] || "https://via.placeholder.com/800x800?text=No+Image";
  const allImages = [mainImage, ...images.filter((img) => img !== mainImage)];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={allImages[selectedImage]}
          alt={title}
          fill
          className="object-contain"
          priority
        />
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
              selectedImage === index ? "border-black" : "border-gray-200"
            }`}
          >
            <Image
              src={`${image}_220x220.jpg`}
              alt={`${title} view ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
