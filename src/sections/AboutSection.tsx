import React from "react";
import { FiSmartphone, FiDollarSign, FiTruck, FiGlobe } from "react-icons/fi";

interface FeatureProps {
  title: string;
  description: string;
  Icon?: React.ElementType;
}

const aboutFeatures: Array<{
  title: string;
  description: string;
  Icon: React.ElementType;
}> = [
  {
    title: "Thoughtful design",
    description:
      "Clever, comfy furniture that you're proud to show off but not precious about using everyday.",
    Icon: FiSmartphone,
  },
  {
    title: "Everyday value",
    description:
      "Our direct-to-consumer model cuts out the middlemen, hidden costs and showroom expenses that charge you extra.",
    Icon: FiDollarSign,
  },
  {
    title: "Effortless experiences",
    description:
      "Fast and flexible delivery, tool-free assembly and 120 nights to love it or return it.",
    Icon: FiTruck,
  },
  {
    title: "Designed with the world in mind",
    description:
      "Ethically made and designed to last — with a portion of our sales supporting koala conservation.",
    Icon: FiGlobe,
  },
];

const FeatureCard: React.FC<FeatureProps> = ({ title, description, Icon }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        {Icon ? (
          <Icon className="w-8 h-8 text-blue-600" aria-hidden="true" />
        ) : (
          <FiSmartphone className="w-8 h-8 text-blue-600" aria-hidden="true" />
        )}
        <span className="sr-only">feature icon</span>
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

export default function AboutSection({ title, subtitle }: AboutSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
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
      </div>
    </section>
  );
}
