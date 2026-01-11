import Link from "next/link";
import { FiTruck, FiClock, FiShield } from "react-icons/fi";
import StarRating from "@/components/StarRating";
import { AliExpressProduct } from "@/types/aliexpress";
import { parseEvaluateRate } from "@/utils/parseEvaluateRate";

export default function ProductInfo({
  productData,
}: {
  productData: AliExpressProduct;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {productData.product_title}
        </h1>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
            {productData.first_level_category_name || "Category"}
          </span>
          {productData.second_level_category_name && (
            <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
              {productData.second_level_category_name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Store: {productData.shop_name}
        </p>
        <div className="flex items-center gap-4 mb-6">
          <StarRating
            rating={parseEvaluateRate(productData.evaluate_rate)}
            reviewCount={productData.lastest_volume}
          />

          <span className="text-sm text-gray-500">
            {productData.evaluate_rate
              ? `${productData.evaluate_rate} people rated this product positively`
              : null}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">
            ${productData.sale_price}
          </span>
          {productData.original_price > productData.sale_price && (
            <span className="text-lg text-gray-500 line-through">
              ${productData.original_price}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href={productData.promotion_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-red-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            View on AliExpress
          </Link>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3">
          <FiTruck className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium">Delivery Information</p>
            <p className="text-sm text-gray-600">
              Standard shipping time applies
            </p>
            <p className="text-sm text-gray-600">
              Standard shipping fees apply
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiClock className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium">Delivery Time</p>
            <p className="text-sm text-gray-600">Estimated 7-20 days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiShield className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium">Buyer Protection</p>
            <p className="text-sm text-gray-600">Money back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
