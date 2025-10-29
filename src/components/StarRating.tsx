"use client";

import { FiStar } from "react-icons/fi";

type Props = {
  rating: number;
  reviewCount: number;
};

export default function StarRating({ rating, reviewCount }: Props) {
  return (
    <div className="flex items-center">
      {(() => {
        const starCount = Math.max(1, Math.round((rating / 100) * 5));

        return [...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${
              i < starCount ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ));
      })()}
      <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
    </div>
  );
}
