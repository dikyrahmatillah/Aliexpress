"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

interface SkuProperty {
  name: string;
  value: string;
}

interface SkuInfo {
  sku_id: string;
  sku_price: string;
  sku_available_quantity: number;
  sku_properties: SkuProperty[];
}

interface Product {
  product_id: string;
  product_title: string;
  sale_price: string;
  original_price: string;
  discount: string;
  promotion_link: string;
  sku_info?: SkuInfo[];
}

export default function PurchasePanelClient({ product }: { product: Product }) {
  const [selectedSku, setSelectedSku] = useState<string | null>(
    product.sku_info && product.sku_info.length > 0
      ? product.sku_info[0].sku_id
      : null
  );
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);

  const variantOptions: Record<string, Set<string>> = {};
  product.sku_info?.forEach((sku) => {
    sku.sku_properties?.forEach((p) => {
      if (!variantOptions[p.name]) variantOptions[p.name] = new Set();
      variantOptions[p.name].add(p.value);
    });
  });

  // compute current sku
  const currentSku = useMemo(
    () => product.sku_info?.find((s) => s.sku_id === selectedSku) || null,
    [product.sku_info, selectedSku]
  );

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [name]: value }));
    // attempt to match a SKU when variants change
    const matched = product.sku_info?.find((s) => {
      return (s.sku_properties || []).every(
        (p) => selectedVariants[p.name] === p.value || value === p.value
      );
    });
    if (matched) setSelectedSku(matched.sku_id);
  };

  const handleQuantityChange = (change: number) => {
    const maxQuantity =
      currentSku?.sku_available_quantity || product?.sale_price ? 999 : 999;
    setQuantity((q) => Math.max(1, Math.min(maxQuantity, q + change)));
  };

  const currentPrice = currentSku
    ? parseFloat(currentSku.sku_price)
    : parseFloat(product.sale_price || "0");
  const originalPrice = parseFloat(product.original_price || "0");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-gray-900">
          ${currentPrice.toFixed(2)}
        </span>
        {originalPrice > currentPrice && (
          <span className="text-lg text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {Object.entries(variantOptions).map(([variantName, values]) => (
        <div key={variantName} className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            {variantName}:{" "}
            <span className="font-bold">
              {selectedVariants[variantName] || "Select"}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[...values].map((value) => (
              <button
                key={`${variantName}-${value}`}
                onClick={() => handleVariantChange(variantName, value)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                  selectedVariants[variantName] === value
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Quantity{" "}
          {currentSku && (
            <span className="text-gray-500 text-xs ml-2">
              ({currentSku.sku_available_quantity} available)
            </span>
          )}
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="p-2 hover:bg-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-2 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
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
