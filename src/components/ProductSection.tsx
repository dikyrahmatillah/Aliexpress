import React from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data for bestseller products
const products = [
  {
    title: "Koala Sofa Bed",
    imageUrl:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    hoverImageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    rating: 4.7,
    reviewCount: 1930,
    price: 1390,
    salePrice: 1084,
    sizes: ["2.5-Seater"],
    colors: ["#8DA399", "#333333", "#F5F5DC", "#808080", "#964B00", "#2E8B57"],
    linkUrl: "/products/koala-sofa-bed",
    tag: "Save 25%",
  },
  {
    title: "Koala Luxe Mattress",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    hoverImageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    rating: 4.8,
    reviewCount: 507,
    price: 2090,
    salePrice: 1567,
    sizes: ["Queen", "King", "Single", "Double"],
    linkUrl: "/products/koala-luxe-mattress",
    tag: "Most luxurious",
  },
  {
    title: "Byron Sofa Bed [3rd Gen]",
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    hoverImageUrl:
      "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    rating: 4.9,
    reviewCount: 67,
    price: 2290,
    salePrice: 1786,
    sizes: ["3.5-Seater"],
    colors: [
      "#D2B48C",
      "#8DA399",
      "#A9A9A9",
      "#D2B48C",
      "#2E8B57",
      "#F5DEB3",
      "#E0FFFF",
    ],
    linkUrl: "/products/byron-sofa-bed",
    tag: "Up to 22% off",
  },
  {
    title: "Koala Plus Mattress",
    imageUrl:
      "https://images.unsplash.com/photo-1600456899121-68eda5705257?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    hoverImageUrl:
      "https://images.unsplash.com/photo-1600456899121-68eda5705257?ixlib=rb-1.2.1&auto=format&fit=crop&w=360&q=80",
    rating: 4.8,
    reviewCount: 904,
    price: 1050,
    salePrice: 819,
    sizes: ["Queen", "King", "Single", "Double", "King Single", "Super King"],
    linkUrl: "/products/koala-plus-mattress",
    tag: "Save 22%",
  },
];

interface ProductProps {
  title: string;
  imageUrl: string;
  hoverImageUrl?: string;
  rating: number;
  reviewCount: number;
  price: number;
  salePrice?: number;
  sizes?: string[];
  colors?: string[];
  category?: string;
  linkUrl: string;
  tag?: string;
}

const ProductCard: React.FC<ProductProps> = ({
  title,
  imageUrl,
  hoverImageUrl,
  rating,
  reviewCount,
  price,
  salePrice,
  sizes,
  colors,
  category,
  linkUrl,
  tag,
}) => {
  const discount = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <div className="group">
      <Link href={linkUrl} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
          <Image
            src={imageUrl}
            alt={title}
            width={360}
            height={360}
            className={`object-cover w-full h-full transition-opacity duration-300 ${
              hoverImageUrl ? "group-hover:opacity-0" : ""
            }`}
          />
          {hoverImageUrl && (
            <Image
              src={hoverImageUrl}
              alt={`${title} hover view`}
              width={360}
              height={360}
              className="object-cover w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
          {tag && (
            <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1">
              {tag}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1">
              Save {discount}%
            </span>
          )}
        </div>

        <div>
          {category && <p className="text-sm text-gray-500 mb-1">{category}</p>}
          <h3 className="font-medium text-lg mb-1">{title}</h3>

          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={i < rating ? 0 : 2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>

          <div className="flex items-center">
            {salePrice ? (
              <>
                <span className="text-lg font-medium mr-2">${salePrice}</span>
                <span className="text-sm text-gray-500 line-through">
                  ${price}
                </span>
              </>
            ) : (
              <span className="text-lg font-medium">${price}</span>
            )}
          </div>

          {sizes && sizes.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {sizes.length > 1 ? `${sizes.length} Sizes` : "1 Size"}
            </p>
          )}

          {colors && colors.length > 0 && (
            <div className="flex mt-2 space-x-1">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

interface ProductSectionProps {
  title: string;
  viewAllLink?: string;
  filters?: string[];
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  viewAllLink,
  filters,
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-black underline">
              See All
            </Link>
          )}
        </div>

        {filters && filters.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm ${
                  index === 0
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
