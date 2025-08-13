import React from "react";
import Image from "next/image";

// Mock data for impact section
const impactCards = [
  {
    title: "We are a part of 1% for the Planet",
    description:
      "We put our money where our mouth is. We were the first Australian mattress and furniture retailer to join the 1% for the Planet movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?ixlib=rb-1.2.1&auto=format&fit=crop&w=830&q=80",
  },
  {
    title: "We're proudly a B Corp",
    description:
      "We're proud to be B Corp certified, which means we meet high standards of social and environmental impact, transparency and accountability.",
    imageUrl:
      "https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-1.2.1&auto=format&fit=crop&w=830&q=80",
  },
  {
    title: "Protecting our Aussie icon",
    description:
      "In partnership with WWF-Australia since 2017, we are working together to prevent the further decline of koala populations.",
    imageUrl:
      "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&auto=format&fit=crop&w=830&q=80",
  },
];

interface ImpactCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col">
      <div className="relative h-80 mb-4 overflow-hidden">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

interface ImpactSectionProps {
  title: string;
}

const ImpactSection: React.FC<ImpactSectionProps> = ({ title }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactCards.map((card, index) => (
            <ImpactCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
