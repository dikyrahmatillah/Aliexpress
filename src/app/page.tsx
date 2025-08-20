"use client";

import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ShowcaseSection from "@/sections/ShowcaseSection";
import { heroContent } from "@/data/heroData";
import FeaturedSection from "@/sections/FeaturedSection";
import RelatedSection from "@/sections/RelatedSection";
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
    <main>
      <HeroSection content={heroContent} />
      <RelatedSection
        hotProductsData={categoryProducts}
        isLoading={isLoading}
        error={error}
        sideImage={{
          url: "https://ae01.alicdn.com/kf/S3619e57974f148d087c950fe497cdf55q/300x250.jpg",
          link: "https://s.click.aliexpress.com/e/_oFRXA8n?bz=300*250",
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
      <RelatedSection
        hotProductsData={categoryProducts2}
        buttonSide="left"
        sideImageRight={true}
        isLoading={isLoading}
        error={error}
        sideImage={{
          url: "https://ae01.alicdn.com/kf/S3619e57974f148d087c950fe497cdf55q/300x250.jpg",
          link: "https://s.click.aliexpress.com/e/_oFRXA8n?bz=300*250",
          alt: "Nature left",
        }}
      />
      <AboutSection title="About Us" />
      <Newsletter />
    </main>
  );
}
