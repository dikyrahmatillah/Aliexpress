import RelatedSection from "@/sections/RelatedSection";
import { getAliExpressProducts } from "@/utils/aliexpress";

async function fetchRelatedProductsServer(categoryId: number | undefined) {
  try {
    const data = await getAliExpressProducts({
      query: "*",
      pageSize: 20,
      pageNo: 1,
      targetCurrency: "USD",
      targetLanguage: "EN",
      ...(categoryId != null ? { categoryIds: Number(categoryId) } : {}),
    });

    const products = data.products?.product ?? [];
    return {
      total_record_count: data.total_record_count || products.length,
      current_record_count: data.current_record_count || products.length,
      products,
    };
  } catch {
    return null;
  }
}

export default async function RelatedProducts({
  categoryId,
}: {
  categoryId?: number | null;
}) {
  if (categoryId == null) return null;

  const relatedProducts = await fetchRelatedProductsServer(categoryId);
  if (!relatedProducts?.products?.length) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <RelatedSection productsData={relatedProducts} buttonSide="both" />
    </div>
  );
}
