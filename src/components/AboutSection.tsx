import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

// Mock data for about section
const aboutFeatures = [
  {
    icon: "https://via.placeholder.com/140",
    title: "Thoughtful design",
    description:
      "Clever, comfy furniture that you're proud to show off but not precious about using everyday.",
  },
  {
    icon: "https://via.placeholder.com/140",
    title: "Everyday value",
    description:
      "Our direct-to-consumer model cuts out the middlemen, hidden costs and showroom expenses that charge you extra.",
  },
  {
    icon: "https://via.placeholder.com/140",
    title: "Effortless experiences",
    description:
      "Fast and flexible delivery, tool-free assembly and 120 nights to love it or return it.",
  },
  {
    icon: "https://via.placeholder.com/140",
    title: "Designed with the world in mind",
    description:
      "Ethically made and designed to last — with a portion of our sales supporting koala conservation.",
  },
];

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-36 h-36 mb-4 relative">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

interface AboutSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
}) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3 text-center">{title}</h2>
        {subtitle && (
          <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {aboutFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {backgroundImage && (
          <div className="mt-12 relative h-96 rounded-lg overflow-hidden">
            <Image
              src={backgroundImage}
              alt="About us background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            {ctaText && ctaLink && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  href={ctaLink}
                  className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
