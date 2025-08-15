import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/app/sections/HeroSection";
import AboutSection from "@/app/sections/AboutSection";
import Newsletter from "@/components/Newsletter";
import AsSeenInSection from "@/app/sections/AssSeenInSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import { heroContent } from "@/data/heroData";
import FeaturedSection from "@/app/sections/FeaturedSection";
import CategorySection from "./sections/CategorySection";

export default function Home() {
  return (
    <>
      <Header />

      <main className="">
        <HeroSection content={heroContent} />
        <CategorySection
          sideImage={{
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
            link: "https://unsplash.com/photos/1506744038136-46273834b3fb",
            alt: "Nature left",
          }}
          sideImageRight={false}
          buttonSide="right"
        />
        <ShowcaseSection />
        <FeaturedSection />
        <AsSeenInSection />
        <ShowcaseSection />
        <CategorySection
          sideImage={{
            url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
            link: "https://unsplash.com/photos/1465101046530-73398c7f28ca",
            alt: "Nature right",
          }}
          sideImageRight={true}
          buttonSide="left"
        />
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
