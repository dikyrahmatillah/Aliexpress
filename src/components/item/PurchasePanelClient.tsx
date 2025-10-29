"use client";

import Link from "next/link";

interface Product {
  product_title: string;
  sale_price: string;
  original_price: string;
  promotion_link: string;
  lastest_volume: number;
}

export default function PurchasePanelClient({ product }: { product: Product }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-gray-900">
          ${product.sale_price}
        </span>
        {product.original_price > product.sale_price && (
          <span className="text-lg text-gray-500 line-through">
            ${product.original_price}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Quantity:{" "}
          <span className="text-gray-500 text-xs ml-2">
            {product.lastest_volume > 0
              ? `Only ${product.lastest_volume} left in stock`
              : "Out of stock"}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href={product.promotion_link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-red-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          View on AliExpress
        </Link>
      </div>
    </div>
  );
}
