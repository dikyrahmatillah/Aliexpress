import Link from "next/link";
import { FiTruck, FiClock, FiShield, FiChevronRight } from "react-icons/fi";
import StarRating from "@/components/StarRating";
import RelatedSection from "@/sections/RelatedSection";
import ImageGalleryClient from "@/components/item/ImageGalleryClient";
import PurchasePanelClient from "@/components/item/PurchasePanelClient";
import { getAliExpressProducts, parseProductString } from "@/utils/aliexpress";
import { ProcessedProduct } from "@/types/aliexpress";

async function fetchProductDetailServer(productId: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = `${base}/api/aliexpress/productdetail?product_id=${encodeURIComponent(
    productId
  )}&target_currency=USD&target_language=EN&country=US`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch product detail: ${res.status}`);
  }
  const payload = await res.json();

  // The API route returns { success: true, product: rawProduct }
  const raw = payload?.product || {};

  // Normalize to the shape the UI expects (similar to client-side processor)
  const smallImages = raw.product_small_image_urls?.string || [];
  const images = [raw.product_main_image_url, ...smallImages].filter(Boolean);

  const skuInfo = raw.sku_info || [];
  if (skuInfo.length === 0 && raw.sku_id) {
    skuInfo.push({
      sku_id: String(raw.sku_id),
      sku_price: raw.sale_price || raw.app_sale_price,
      sku_available_quantity:
        raw.available_quantity || raw.lastest_volume || 999,
      sku_properties: [],
    });
  }

  return {
    product_id: String(raw.product_id || productId),
    product_title: raw.product_title || "",
    product_detail_url: raw.product_detail_url || "",
    product_main_image_url: raw.product_main_image_url || "",
    product_images: images,
    product_description: raw.product_description || "",
    product_attributes: raw.product_attributes || [],
    review_rating: raw.review_rating || "0",
    review_count: raw.review_count || 0,
    sale_price:
      raw.target_sale_price || raw.sale_price || raw.app_sale_price || "0",
    original_price: raw.target_original_price || raw.original_price || "0",
    discount: raw.discount || "0",
    shop_name: raw.shop_name || "",
    shop_id: raw.shop_id || "",
    shop_url: raw.shop_url || "",
    commission_rate:
      raw.commission_rate || raw.hot_product_commission_rate || "0",
    available_quantity: raw.available_quantity || raw.lastest_volume || 999,
    delivery_info: raw.delivery_info || {
      delivery_time: "Standard shipping time",
      delivery_fee: "Standard shipping rates apply",
    },
    sku_info: skuInfo,
    first_level_category_id: raw.first_level_category_id || "",
    first_level_category_name: raw.first_level_category_name || "",
    second_level_category_id: raw.second_level_category_id || "",
    second_level_category_name: raw.second_level_category_name || "",
    promotion_link: raw.promotion_link || "",
    lastest_volume: raw.lastest_volume,
  };
}

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

  const productData = await fetchProductDetailServer(id).catch(() => {
    return null;
  });

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

  const productImages = productData.product_images || [];
  const mainImage = productData.product_main_image_url;
  const allImages = [
    mainImage,
    ...productImages.filter((img) => img !== mainImage),
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-4">
        {/* Breadcrumb */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
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
            <li className="flex items-center">
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              <span className="ml-2 text-gray-900 font-medium truncate max-w-xs">
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
                    rating={parseFloat(productData.review_rating) || 0}
                    reviewCount={productData.review_count}
                  />

                  <span className="text-sm text-gray-500">
                    {productData.lastest_volume
                      ? `${productData.lastest_volume} sales`
                      : `${productData.review_count} reviews`}
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
