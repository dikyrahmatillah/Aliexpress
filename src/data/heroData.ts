import type { HeroContent } from "@/types/hero";

export const heroContent: HeroContent[] = [
  {
    title: "Summer Sale is Here!",
    subtitle: "Save up to 50% on selected items. Limited time only.",
    buttonText: "Explore Summer Deals",
    secondaryButtonText: "View All Products",
    secondaryButtonLink: "/collections/all",
    backgroundImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1500&q=80",
    textColor: "light",
  },
  {
    title: "Best Deals",
    subtitle: "Discover the latest trends in home & living.",
    buttonText: "Best Deals",
    secondaryButtonText: "Explore Bestsellers",
    secondaryButtonLink: "/collections/bestsellers",
    backgroundImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80",
    textColor: "light",
  },
];
