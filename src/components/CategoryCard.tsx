import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  title: string;
  discount?: string;
  imageUrl: string;
  linkUrl: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
}

export default function CategoryCard({
  title,
  discount,
  imageUrl,
  linkUrl,
  price,
  rating,
}: CategoryCardProps) {
  return (
    <div className="w-full max-w-xs flex-shrink-0 mx-2">
      <Link href={linkUrl} className="block group">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={`${imageUrl}_350x350.webp`}
            alt={title}
            width={350}
            height={350}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discount}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-base font-medium">{title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                ${price}
              </span>
            </div>
            {typeof rating === "number" && (
              <div className="text-sm text-yellow-500">
                ★ {rating.toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
