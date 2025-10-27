import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ShowcaseSection from "@/sections/ShowcaseSection";
import { heroContent } from "@/data/heroData";
import FeaturedSection from "@/sections/FeaturedSection";
import RelatedSection from "@/sections/RelatedSection";
import Newsletter from "@/components/Newsletter";
import { getAliExpressProducts, parseProductString } from "@/utils/aliexpress";
import type { ProductQueryResult, ProcessedProduct } from "@/types/aliexpress";

export default async function Home() {
  let products: ProductQueryResult | undefined;

  try {
    products = await getAliExpressProducts({
      query: "*",
      pageSize: 50,
      pageNo: 1,
    });
  } catch {
    products = undefined;
  }

  const rawProductStrings = products?.products?.product || [];
  const processedProducts: ProcessedProduct[] = rawProductStrings.map((s) =>
    parseProductString(s)
  );

  const sliceProcessed = (
    start: number,
    end: number
  ):
    | {
        total_record_count: number;
        current_record_count: number;
        products: ProcessedProduct[];
      }
    | undefined => {
    if (!processedProducts || processedProducts.length === 0) {
      return undefined;
    } else {
      const sliced = processedProducts.slice(start, end);

      return {
        total_record_count: processedProducts.length,
        current_record_count: sliced.length,
        products: sliced,
      };
    }
  };

  const categoryProducts = sliceProcessed(0, 10);
  const showcaseProducts1 = sliceProcessed(10, 20);
  const featuredProducts = sliceProcessed(20, 30);
  const showcaseProducts2 = sliceProcessed(30, 40);
  const categoryProducts2 = sliceProcessed(40, 50);

  const isLoading = false;

  return (
    <main>
      <HeroSection content={heroContent} />
      <RelatedSection
        productsData={categoryProducts}
        isLoading={isLoading}
        sideImage={{
          url: "https://ae01.alicdn.com/kf/S3619e57974f148d087c950fe497cdf55q/300x250.jpg",
          link: "https://s.click.aliexpress.com/e/_oFRXA8n?bz=300*250",
          alt: "Nature left",
        }}
      />
      <ShowcaseSection productsData={showcaseProducts1} isLoading={isLoading} />
      <FeaturedSection productsData={featuredProducts} isLoading={isLoading} />
      <ShowcaseSection productsData={showcaseProducts2} isLoading={isLoading} />
      <RelatedSection
        productsData={categoryProducts2}
        buttonSide="left"
        sideImageRight={true}
        isLoading={isLoading}
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
