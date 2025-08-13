import React from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data for the categories section
const categories = [
  {
    title: "Mattresses",
    discount: "Up to 25% off",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    linkUrl: "/collections/mattresses",
  },
  {
    title: "Sofa Beds",
    discount: "Up to 22% off",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    linkUrl: "/collections/sofa-beds",
  },
  {
    title: "Bed Bases",
    discount: "Up to 22% off",
    imageUrl:
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    linkUrl: "/collections/bed-bases",
  },
  {
    title: "Sofas",
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    linkUrl: "/collections/sofas-couches",
  },
];

interface CategoryProps {
  title: string;
  discount?: string;
  imageUrl: string;
  linkUrl: string;
}

const CategoryCard: React.FC<CategoryProps> = ({
  title,
  discount,
  imageUrl,
  linkUrl,
}) => {
  return (
    <div className="relative group overflow-hidden">
      <Link href={linkUrl} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={750}
            height={750}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-medium">{title}</h3>
          {discount && <p className="text-sm text-red-600">{discount}</p>}
        </div>
      </Link>
    </div>
  );
};

interface CategorySectionProps {
  title: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              discount={category.discount}
              imageUrl={category.imageUrl}
              linkUrl={category.linkUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
