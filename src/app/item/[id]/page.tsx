"use client";

import { useState, use as usePromise, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, Clock, Shield, Minus, Plus } from "lucide-react";
import StarRating from "@/components/StarRating";
import {
  useAliExpressProductDetail,
  useAliExpressRelatedProducts,
} from "@/hooks/useAliexpress";
import RelatedSection from "@/sections/RelatedSection";

// Define interfaces for TypeScript typings
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

// Define a complete product interface for all possible fields from the API
interface ProductDetailData {
  product_id: string;
  product_title: string;
  product_detail_url: string;
  product_main_image_url: string;
  product_images: string[];
  product_description: string;
  product_attributes: Array<{ name: string; value: string }>;
  review_rating: string;
  review_count: number;
  sale_price: string;
  original_price: string;
  discount: string;
  shop_name: string;
  shop_id: string;
  shop_url: string;
  commission_rate: string;
  available_quantity: number;
  delivery_info: {
    delivery_time: string;
    delivery_fee: string;
  };
  sku_info: SkuInfo[];
  first_level_category_id: string | number;
  first_level_category_name: string;
  second_level_category_id: string | number;
  second_level_category_name: string;
  lastest_volume?: number;
  promotion_link: string;

  // Optional AliExpress API fields
  app_sale_price?: string;
  target_sale_price?: string;
  target_original_price?: string;
  target_app_sale_price?: string;
  sale_price_currency?: string;
  app_sale_price_currency?: string;
  target_sale_price_currency?: string;
  hot_product_commission_rate?: string;
  tax_rate?: string;
  product_video_url?: string;
  product_small_image_urls?: { string: string[] };
}

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Use params.id to fetch specific product data from AliExpress API
  const { id } = usePromise(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);

  // Fetch product details from AliExpress API
  const {
    data: productDetail,
    isLoading,
    error,
  } = useAliExpressProductDetail(id);

  // Fetch related products based on category
  const {
    data: relatedProducts,
    isLoading: isLoadingRelated,
    error: relatedError,
  } = useAliExpressRelatedProducts(productDetail?.first_level_category_id, id, {
    enabled: !!productDetail?.first_level_category_id,
  });

  // Default to fallback data if API call fails or when loading
  const productData: ProductDetailData = productDetail || {
    product_id: id,
    product_title: "Loading...",
    product_detail_url: "",
    product_main_image_url:
      "https://via.placeholder.com/800x800?text=Loading...",
    product_images: [] as string[],
    product_description: "Loading product details...",
    product_attributes: [] as Array<{ name: string; value: string }>,
    review_rating: "0",
    review_count: 0,
    sale_price: "0",
    original_price: "0",
    discount: "0",
    shop_name: "",
    shop_id: "",
    shop_url: "",
    commission_rate: "0",
    available_quantity: 0,
    delivery_info: {
      delivery_time: "",
      delivery_fee: "",
    },
    sku_info: [] as SkuInfo[],
    first_level_category_id: "",
    first_level_category_name: "",
    second_level_category_id: "",
    second_level_category_name: "",
    // Optional fields from the API response
    promotion_link: "",
  };

  // Extract available variant options from all SKUs
  const variantOptions: Record<string, Set<string>> = {};
  if (productDetail?.sku_info) {
    productDetail.sku_info.forEach((sku) => {
      if (sku.sku_properties) {
        sku.sku_properties.forEach((prop: SkuProperty) => {
          if (!variantOptions[prop.name]) {
            variantOptions[prop.name] = new Set<string>();
          }
          variantOptions[prop.name].add(prop.value);
        });
      }
    });
  }

  // Set the first SKU as selected by default when product loads
  useEffect(() => {
    if (
      productDetail &&
      productDetail.sku_info &&
      productDetail.sku_info.length > 0
    ) {
      setSelectedSku(productDetail.sku_info[0].sku_id);

      // Initialize selected variants from the first SKU
      const initialVariants: Record<string, string> = {};
      if (productDetail.sku_info[0].sku_properties) {
        productDetail.sku_info[0].sku_properties.forEach(
          (prop: SkuProperty) => {
            initialVariants[prop.name] = prop.value;
          }
        );
      }
      setSelectedVariants(initialVariants);
    }
  }, [productDetail]);

  // Update selected SKU when variants change
  useEffect(() => {
    // Find the currently selected SKU based on variants
    const findMatchingSku = () => {
      if (!productDetail?.sku_info) return null;

      return productDetail.sku_info.find((sku) => {
        if (!sku.sku_properties) return false;

        // Check if this SKU matches all selected variants
        const variantKeys = Object.keys(selectedVariants);
        if (variantKeys.length === 0) return false;

        return variantKeys.every((key) => {
          const matchingProp = sku.sku_properties.find(
            (prop: SkuProperty) => prop.name === key
          );
          return matchingProp && matchingProp.value === selectedVariants[key];
        });
      });
    };

    const matchingSku = findMatchingSku();
    if (matchingSku) {
      setSelectedSku(matchingSku.sku_id);
    }
  }, [selectedVariants, productDetail]);

  // Get the current selected SKU
  const currentSku = productDetail?.sku_info?.find(
    (sku) => sku.sku_id === selectedSku
  );

  const handleQuantityChange = (change: number) => {
    const maxQuantity =
      currentSku?.sku_available_quantity ||
      productDetail?.available_quantity ||
      999;
    setQuantity(Math.max(1, Math.min(maxQuantity, quantity + change)));
  };

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // If loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-700 mb-4">
            Sorry, we could not load this product. Please try again later.
          </p>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate price and discount
  const currentPrice = currentSku
    ? parseFloat(currentSku.sku_price)
    : parseFloat(productData.sale_price);

  const originalPrice = parseFloat(productData.original_price);
  const discountPercent = parseInt(productData.discount) || 0;

  // Get product images
  const productImages = productData.product_images || [];
  const mainImage = productData.product_main_image_url;

  // Combine all images into one array for gallery display
  const allImages = [
    mainImage,
    ...productImages.filter((img) => img !== mainImage),
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <Link
                href={`/collections/${productData.first_level_category_id}`}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {productData.first_level_category_name || "Category"}
              </Link>
            </li>
            {productData.second_level_category_name && (
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <Link
                  href={`/category/${productData.second_level_category_id}`}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {productData.second_level_category_name}
                </Link>
              </li>
            )}
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="ml-2 text-gray-900 font-medium truncate max-w-xs">
                {productData.product_title.length > 40
                  ? productData.product_title.substring(0, 40) + "..."
                  : productData.product_title}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={allImages[selectedImage] || mainImage}
                alt={productData.product_title}
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

            {/* Thumbnail Gallery */}
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
                    src={image}
                    alt={`${productData.product_title} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.product_title}
              </h1>

              {/* Category Info */}
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

              {/* Shop Info */}
              <p className="text-sm text-gray-600 mb-4">
                Store: {productData.shop_name}
              </p>

              {/* Rating */}
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

            {/* Price */}
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

                {/* Show target price if available (for multi-currency) */}
                {productData.target_sale_price && (
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    USD ${productData.target_sale_price}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <p className="text-sm text-red-600 font-medium">
                  Save {discountPercent}% off retail price
                </p>
              )}
            </div>

            {/* Variants Selection */}
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

            {/* Quantity */}
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

            {/* Add to Cart & Buy Now buttons */}
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

            {/* Delivery Info */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
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
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Delivery Time</p>
                  <p className="text-sm text-gray-600">Estimated 7-20 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Buyer Protection</p>
                  <p className="text-sm text-gray-600">Money back guarantee</p>
                </div>
              </div>
            </div>

            {/* View on AliExpress */}
          </div>
        </div>

        {/* Related Products Showcase Section */}
        {relatedProducts && relatedProducts.products.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <RelatedSection
              hotProductsData={relatedProducts}
              buttonSide="both"
              sideImageRight={false}
              isLoading={isLoadingRelated}
              error={relatedError}
            />
          </div>
        )}

        {/* Product Attributes */}
        {productData.product_attributes &&
          productData.product_attributes.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold mb-4">
                Product Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productData.product_attributes.map((attr, index) => (
                  <div key={index} className="flex">
                    <div className="w-40 font-medium text-gray-700">
                      {attr.name}
                    </div>
                    <div className="flex-1 text-gray-900">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
