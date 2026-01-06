import Link from "next/link";
import {
  getAliExpressProducts,
  getAliExpressCategories,
} from "@/utils/aliexpress";
import CategoryProductsClient from "@/components/CategoryProductsClient";

interface CategoryInfo {
  name: string;
  description: string;
}

const defaultCategoryInfo: CategoryInfo = {
  name: "Category Products",
  description: "Discover amazing products from AliExpress in this category",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const categoryId = Number((await params).id || 0);

  const result = await getAliExpressProducts({
    query: "",
    categoryIds: categoryId,
    pageSize: 50,
    sort: "priceDesc",
    targetCurrency: "USD",
    targetLanguage: "EN",
  });

  let categoryInfo: CategoryInfo = defaultCategoryInfo;
  try {
    const categoriesData = await getAliExpressCategories();
    const categories =
      categoriesData?.aliexpress_affiliate_category_get_response?.resp_result
        ?.result?.categories?.category;
    if (categories) {
      const found = categories.find((item) => item.category_id === categoryId);
      if (found) {
        categoryInfo = {
          name: found.category_name,
          description: `Discover amazing ${found.category_name.toLowerCase()} products from AliExpress`,
        };
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load categories:", err);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {categoryInfo.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryInfo.name}
            </h1>
            <p className="text-gray-600">{categoryInfo.description}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <CategoryProductsClient
              initialProducts={result.products.product}
              categoryId={categoryId}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Subscribe to our emails
          </h2>
          <p className="text-gray-600 mb-8">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form className="gap-4">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
