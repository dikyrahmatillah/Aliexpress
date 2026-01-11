import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { AliExpressProduct } from "@/types/aliexpress";

export default function Breadcrumbs({
  productData,
}: {
  productData: AliExpressProduct;
}) {
  return (
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
  );
}
