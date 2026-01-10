import Link from "next/link";
import { FiTruck, FiClock, FiShield, FiChevronRight } from "react-icons/fi";
import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";
import ImageGalleryClient from "@/components/item/ImageGalleryClient";
import RelatedProducts from "./RelatedProducts";
import { AliExpressProduct } from "@/types/aliexpress";
import { parseEvaluateRate } from "@/utils/parseEvaluateRate";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productId = (id || "").trim();
  if (!productId) {
    notFound();
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = `${base}/api/aliexpress/productdetail?product_id=${encodeURIComponent(
    productId
  )}&target_currency=USD&target_language=EN&country=US`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 400 || res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("We couldn't load this product right now.");
  }

  const payload = await res.json();

  const productData: AliExpressProduct = payload?.product ?? null;

  if (!productData || !productData.product_title) {
    notFound();
  }

  const discountPercent = parseInt(productData.discount || "0") || 0;
  const allImages = productData.product_small_image_urls?.string || [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 flex-wrap">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                href={`/collections/${productData.first_level_category_id}`}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {productData.first_level_category_name || "Category"}
              </Link>
            </li>
            {productData.second_level_category_name && (
              <li className="flex items-center">
                <FiChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  href={`/collections/${productData.second_level_category_id}`}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {productData.second_level_category_name}
                </Link>
              </li>
            )}
            <li className="flex items-center flex-shrink-0 sm:flex-shrink">
              <FiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="ml-2 text-gray-900 font-medium truncate min-w-0 max-w-full">
                {productData.product_title.length > 40
                  ? productData.product_title.substring(0, 40) + "..."
                  : productData.product_title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Main content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ImageGalleryClient
              images={allImages}
              title={productData.product_title}
              discountPercent={discountPercent}
            />

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
                    rating={parseEvaluateRate(productData.evaluate_rate) || 0}
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
                    <p className="text-sm text-gray-600">
                      Money back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RelatedProducts
            categoryId={Number(productData.first_level_category_id)}
          />
        </div>
      </div>
    </div>
  );
}
