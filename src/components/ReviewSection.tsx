"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Mock data for reviews
const reviews = [
  {
    text: "Amazing Sofa Bed!\nKoala sofa bed is excellent quality. We keep it in our home office as a sofa however we have had guests sleep on it and they said it was extremely comfortable.",
    name: "Terri",
    isVerified: true,
    productName: "Koala Sofa Bed",
    productLink: "/products/koala-sofa-bed",
    imageUrl:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=782&q=80",
  },
  {
    text: "KOALAMAZING!\nThe New Koala Mattress is amazing and exceeded all my expectations. I love how easy it is to change the comfort layer, our personal fave is the medium-firm support.",
    name: "David",
    isVerified: true,
    productName: "Koala Mattress",
    productLink: "/products/koala-mattress",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=782&q=80",
  },
  {
    text: "Brilliant\nI love EVERYTHING about this couch. It's beautiful, the fabric is wonderful and cleans so well with either a soapy wipe or the Bissell. It was so easy to assemble and do by myself.",
    name: "Lauren",
    isVerified: true,
    productName: "Modern Sofa",
    productLink: "/products/modern-sofa",
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=782&q=80",
  },
];

interface ReviewProps {
  text: string;
  name: string;
  isVerified: boolean;
  productName: string;
  productLink: string;
  imageUrl: string;
}

const ReviewCard: React.FC<ReviewProps> = ({
  text,
  name,
  isVerified,
  productName,
  productLink,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-6 flex-grow">
        <div className="md:w-1/2">
          <div className="flex text-yellow-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-3">{text.split("\n")[0]}</h3>
          <p className="text-gray-700 mb-4">
            {text.split("\n").slice(1).join("\n")}
          </p>

          <div className="mt-auto">
            <div className="flex items-center mb-2">
              <p className="font-medium mr-2">{name}</p>
              {isVerified && (
                <span className="flex items-center text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Buyer
                </span>
              )}
            </div>

            <Link
              href={productLink}
              className="text-sm font-medium text-black underline"
            >
              Shop {productName}
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 h-64 md:h-auto relative">
          <Image
            src={imageUrl}
            alt={`${name}'s review of ${productName}`}
            fill
            className="object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
};

interface ReviewSectionProps {
  title: string;
  subtitle: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-gray-600 mb-12">{subtitle}</p>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? "bg-black" : "bg-gray-300"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Previous review"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Next review"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
