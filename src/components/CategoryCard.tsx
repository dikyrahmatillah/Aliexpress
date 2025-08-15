import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  title: string;
  discount?: string;
  imageUrl: string;
  linkUrl: string;
}

export default function CategoryCard({
  title,
  discount,
  imageUrl,
  linkUrl,
}: CategoryCardProps) {
  return (
    <div className="w-full max-w-xs flex-shrink-0 mx-2">
      <Link href={linkUrl} className="block group">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
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
        </div>
      </Link>
    </div>
  );
}
