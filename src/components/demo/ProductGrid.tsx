import Image from "next/image";
import { AliExpressProduct } from "@/types/aliexpress";

export default function ProductGrid({
  products,
}: {
  products: AliExpressProduct[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        return (
          <div
            key={product.product_id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square mb-3 relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              {product.product_video_url ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="none"
                  playsInline
                  poster={product.product_main_image_url}
                >
                  <source src={product.product_video_url} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={product.product_main_image_url}
                  alt={product.product_title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">
              {product.product_title}
            </h3>

            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ${Number(product.sale_price).toFixed(2)}
                </span>
                {product.discount !== "0%" && (
                  <>
                    <span className="text-xs line-through text-gray-500">
                      ${Number(product.original_price).toFixed(2)}
                    </span>
                    <span className="text-xs text-red-600 font-semibold">
                      -{product.discount}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {product.lastest_volume} sold
              </span>

              <span className="text-xs text-gray-700">
                Shop: {product.shop_name}
              </span>

              <span className="text-xs text-gray-400">
                {product.first_level_category_name}
                {product.second_level_category_name &&
                  ` / ${product.second_level_category_name}`}
              </span>

              <span className="text-xs text-gray-300">
                SKU: {product.sku_id}
              </span>
            </div>

            <a
              href={`https://www.aliexpress.com/item/${product.product_id}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
            >
              View on AliExpress
            </a>
          </div>
        );
      })}
    </div>
  );
}
