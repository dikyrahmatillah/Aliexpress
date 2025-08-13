import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import ImpactSection from "@/components/ImpactSection";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import AsSeenInSection from "@/components/AssSeenInSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import { heroContent } from "@/data/heroData";

export default function Home() {
  return (
    <>
      <Header />

      <main className="">
        <HeroSection content={heroContent} />

        <CategorySection title="Categories" />

        <ProductSection
          title="Bestsellers"
          viewAllLink="/collections/bestsellers"
          filters={[
            "Featured",
            "Sofa Beds",
            "Mattresses",
            "Sofas",
            "Bed Bases",
            "Pillows",
            "Bookshelves",
          ]}
        />

        <AsSeenInSection />
        <ShowcaseSection />

        <ReviewSection
          title="Over 570,000 customers and more than 50,000 five-star reviews globally"
          subtitle=""
        />

        <ImpactSection title="We're in the business of making things good" />

        <AboutSection
          title="A little about us"
          backgroundImage="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
          ctaText="LEARN MORE"
          ctaLink="/pages/about-us"
        />

        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
