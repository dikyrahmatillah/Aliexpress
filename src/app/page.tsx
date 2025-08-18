"use client";

import HeroSection from "@/app/sections/HeroSection";
import AboutSection from "@/app/sections/AboutSection";
// import AsSeenInSection from "@/app/sections/AsSeenInSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import { heroContent } from "@/data/heroData";
import FeaturedSection from "@/app/sections/FeaturedSection";
import CategorySection from "./sections/CategorySection";
import { useAliExpressHotProducts } from "@/hooks/useAliexpress";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  // Fetch hot products data once for the entire page
  const {
    data: hotProducts,
    isLoading,
    error,
  } = useAliExpressHotProducts(0, {
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  return (
    <>
      <main>
        <HeroSection content={heroContent} />
        {/* <AsSeenInSection /> */}
        <CategorySection
          hotProductsData={hotProducts}
          isLoading={isLoading}
          error={error}
          sideImage={{
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
            link: "https://unsplash.com/photos/1506744038136-46273834b3fb",
            alt: "Nature left",
          }}
        />
        <ShowcaseSection
          hotProductsData={hotProducts}
          isLoading={isLoading}
          error={error}
        />
        <FeaturedSection
          hotProductsData={hotProducts}
          isLoading={isLoading}
          error={error}
        />
        <ShowcaseSection
          hotProductsData={hotProducts}
          isLoading={isLoading}
          error={error}
        />
        <CategorySection
          hotProductsData={hotProducts}
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
