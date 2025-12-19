import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ShowcaseSection from "@/sections/ShowcaseSection";
import FeaturedSection from "@/sections/FeaturedSection";
import RelatedSection from "@/sections/RelatedSection";
import Newsletter from "@/components/Newsletter";
import { heroContent } from "@/data/heroData";
import { getAliExpressProducts } from "@/utils/aliexpress";

export default async function Home() {
  const products = await getAliExpressProducts({
    query: "*",
    pageSize: 50,
    pageNo: 1,
  });

  const productsData = products.products.product;

  const getProductsSlice = (start: number, end: number) => {
    if (!productsData) return undefined;

    const sliced = productsData.slice(start, end);

    return {
      total_record_count: productsData.length,
      current_record_count: end,
      products: sliced,
    };
  };

  return (
    <main>
      <HeroSection content={heroContent} />
      <RelatedSection
        productsData={getProductsSlice(0, 10)}
        sideImage={{
          url: "https://ae01.alicdn.com/kf/S3619e57974f148d087c950fe497cdf55q/300x250.jpg",
          link: "https://s.click.aliexpress.com/e/_oFRXA8n?bz=300*250",
          alt: "ads right",
        }}
      />
      <ShowcaseSection productsData={getProductsSlice(10, 20)} />
      <FeaturedSection productsData={getProductsSlice(20, 30)} />
      <ShowcaseSection productsData={getProductsSlice(30, 40)} />
      <RelatedSection
        productsData={getProductsSlice(40, 50)}
        buttonSide="left"
        sideImageRight={true}
        sideImage={{
          url: "https://ae01.alicdn.com/kf/S3619e57974f148d087c950fe497cdf55q/300x250.jpg",
          link: "https://s.click.aliexpress.com/e/_oFRXA8n?bz=300*250",
          alt: "ads left",
        }}
      />
      <AboutSection title="About Us" />
      <Newsletter />
    </main>
  );
}
