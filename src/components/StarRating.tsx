"use client";

import { FiStar } from "react-icons/fi";

export default function StarRating({
  rating,
  reviewCount,
}: {
  rating: number | undefined;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center">
      {(() => {
        return [...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${
              i < (rating ?? 0) ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ));
      })()}
      <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
    </div>
  );
}
