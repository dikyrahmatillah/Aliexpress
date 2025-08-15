import Link from "next/link";
import Image from "next/image";

interface Brand {
  name: string;
  image: string;
  link: string;
  alt: string;
}

export default function BrandCard({
  brand,
  visibleCount,
}: {
  brand: Brand;
  visibleCount: number;
}) {
  return (
    <div
      style={{
        flex: `0 0 calc(${100 / visibleCount}% - 0.5rem)`,
        maxWidth: `calc(${100 / visibleCount}% - 0.5rem)`,
        minWidth: 0,
      }}
      className="flex-shrink-0 bg-white rounded-2xl shadow-sm group overflow-hidden"
    >
      <Link href={brand.link} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={brand.image}
            alt={brand.alt}
            width={300}
            height={400}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xl font-semibold">{brand.name}</h3>
        </div>
      </Link>
    </div>
  );
}
