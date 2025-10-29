import Link from "next/link";
import { FiTruck, FiClock, FiShield, FiChevronRight } from "react-icons/fi";
import StarRating from "@/components/StarRating";
import RelatedSection from "@/sections/RelatedSection";
import ImageGalleryClient from "@/components/item/ImageGalleryClient";
import PurchasePanelClient from "@/components/item/PurchasePanelClient";
import { getAliExpressProducts, parseProductString } from "@/utils/aliexpress";
import { ProcessedProduct } from "@/types/aliexpress";

async function fetchRelatedProductsServer(
  categoryId: string | number | undefined,
  currentProductId: string
) {
  try {
    // Use getAliExpressProducts similar to homepage
    const queryParams = {
      query: categoryId ? "" : "*", // Use empty query when we have categoryId
      categoryIds: categoryId ? Number(categoryId) : undefined,
      pageSize: 20,
      pageNo: 1,
      targetCurrency: "USD",
      targetLanguage: "EN",
    };

    const productsResult = await getAliExpressProducts(queryParams);

    // Parse the product strings into objects
    const rawProductStrings = productsResult?.products?.product || [];
    const processedProducts: ProcessedProduct[] = rawProductStrings
      .map((s) => parseProductString(s))
      .filter((p: ProcessedProduct) => p.product_id !== currentProductId);

    return {
      total_record_count:
        productsResult.total_record_count || processedProducts.length,
      current_record_count: processedProducts.length,
      products: processedProducts,
    };
  } catch {}
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = `${base}/api/aliexpress/productdetail?product_id=${encodeURIComponent(
    id
  )}&target_currency=USD&target_language=EN&country=US`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch product detail: ${res.status}`);
  }
  const payload = await res.json();

  // The API route returns { success: true, product: rawProduct }
  const productData = payload?.product || {};
  console.log("Product Data:", productData);

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-700 mb-4">
            Sorry, we could not load this product. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const relatedProducts = await fetchRelatedProductsServer(
    productData.first_level_category_id,
    id
  ).catch(() => null);

  const discountPercent = parseInt(productData.discount || "0") || 0;

  const allImages = productData.product_small_image_urls.string || [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-4">
        {/* Breadcrumb - responsive: allow horizontal scroll on small screens and
            ensure truncation works by setting min-w-0 on the truncating element */}
        <nav className="flex" aria-label="Breadcrumb">
          {/* Allow breadcrumb items to wrap on small screens instead of scrolling */}
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
                  href={`/colllections/${productData.second_level_category_id}`}
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

            <div className="space-y-6">
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
                    rating={parseFloat(productData.evaluate_rate) || 0}
                    reviewCount={productData.evaluate_rate}
                  />

                  <span className="text-sm text-gray-500">
                    {productData.lastest_volume
                      ? `${productData.lastest_volume} sales`
                      : `${productData.evaluate_rate} reviews`}
                  </span>
                </div>
              </div>

              <PurchasePanelClient product={productData} />

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3">
                  <FiTruck className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Delivery Information</p>
                    <p className="text-sm text-gray-600">
                      {productData.delivery_info?.delivery_time ||
                        "Standard shipping time applies"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {productData.delivery_info?.delivery_fee ||
                        "Standard shipping fees apply"}
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

          {relatedProducts &&
            relatedProducts.products &&
            relatedProducts.products.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <RelatedSection
                  productsData={relatedProducts}
                  buttonSide="both"
                  sideImageRight={false}
                />
              </div>
            )}

          {productData.product_attributes &&
            productData.product_attributes.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold mb-4">
                  Product Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productData.product_attributes.map(
                    (attr: { name: string; value: string }, index: number) => (
                      <div key={index} className="flex">
                        <div className="w-40 font-medium text-gray-700">
                          {attr.name}
                        </div>
                        <div className="flex-1 text-gray-900">{attr.value}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
