import { notFound } from "next/navigation";
import { AliExpressProduct } from "@/types/aliexpress";
import ProductInfo from "@/components/product/ProductInfo";
import ImageGalleryClient from "@/components/item/ImageGalleryClient";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import RelatedProducts from "./RelatedProducts";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productId = (id || "").trim();
  if (!productId) notFound();

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/aliexpress/productdetail?product_id=${encodeURIComponent(
    productId
  )}&target_currency=USD&target_language=EN&country=US`;

  const response = await fetch(url, { cache: "no-store" });
  if (response.status === 400 || response.status === 404) notFound();
  if (!response.ok) throw new Error("We couldn't load this product right now.");

  const payload = await response.json();
  const productData: AliExpressProduct = payload?.product;
  if (!productData || !productData.product_title) notFound();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs productData={productData} />

        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ImageGalleryClient
              images={productData.product_small_image_urls?.string}
              title={productData.product_title}
              discountPercent={parseInt(productData.discount)}
            />

            <ProductInfo productData={productData} />
          </div>

          <RelatedProducts
            categoryId={Number(productData.first_level_category_id)}
          />
        </div>
      </div>
    </div>
  );
}
