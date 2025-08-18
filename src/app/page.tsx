"use client";

import HeroSection from "@/app/sections/HeroSection";
import AboutSection from "@/app/sections/AboutSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import { heroContent } from "@/data/heroData";
import FeaturedSection from "@/app/sections/FeaturedSection";
import CategorySection from "./sections/CategorySection";
import { useAliExpressHotProducts } from "@/hooks/useAliexpress";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  // Fetch hot products data once for the entire page
  const {
    data: hotProducts,
    isLoading,
    error,
  } = useAliExpressHotProducts(0, {
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Create different product slices for each section
  const categoryProducts = hotProducts
    ? {
        ...hotProducts,
        products: hotProducts.products?.slice(0, 10) || [],
      }
    : undefined;

  const showcaseProducts1 = hotProducts
    ? {
        ...hotProducts,
        products: hotProducts.products?.slice(10, 20) || [],
      }
    : undefined;

  const featuredProducts = hotProducts
    ? {
        ...hotProducts,
        products: hotProducts.products?.slice(20, 30) || [],
      }
    : undefined;

  const showcaseProducts2 = hotProducts
    ? {
        ...hotProducts,
        products: hotProducts.products?.slice(30, 40) || [],
      }
    : undefined;

  const categoryProducts2 = hotProducts
    ? {
        ...hotProducts,
        products: hotProducts.products?.slice(40, 50) || [],
      }
    : undefined;

  return (
    <>
      <main>
        <HeroSection content={heroContent} />
        <CategorySection
          hotProductsData={categoryProducts}
          isLoading={isLoading}
          error={error}
          sideImage={{
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
            link: "https://unsplash.com/photos/1506744038136-46273834b3fb",
            alt: "Nature left",
          }}
        />
        <ShowcaseSection
          hotProductsData={showcaseProducts1}
          isLoading={isLoading}
          error={error}
        />
        <FeaturedSection
          hotProductsData={featuredProducts}
          isLoading={isLoading}
          error={error}
        />
        <ShowcaseSection
          hotProductsData={showcaseProducts2}
          isLoading={isLoading}
          error={error}
        />
        <CategorySection
          hotProductsData={categoryProducts2}
          buttonSide="left"
          sideImageRight={true}
          isLoading={isLoading}
          error={error}
          sideImage={{
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
            link: "https://unsplash.com/photos/1506744038136-46273834b3fb",
            alt: "Nature left",
          }}
        />
        <AboutSection title="About Us" />
        <Newsletter />
      </main>
    </>
  );
}
