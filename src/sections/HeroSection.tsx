"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HeroContent } from "@/types/hero";
import CarouselButton from "@/components/CarouselButton";

interface HeroSectionProps {
  content: HeroContent[];
}

function CarouselControls({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <CarouselButton direction="left" onClick={onPrev} />
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <CarouselButton direction="right" onClick={onNext} />
      </div>
    </>
  );
}

export default function HeroSection({ content }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const slideCount = content.length;
  const currentContent = content[current];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slideCount);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slideCount - 1 : prev - 1));

  const {
    title,
    subtitle,
    buttonText,
    buttonLink,
    secondaryButtonText,
    secondaryButtonLink,
    backgroundImage,
    textColor = "light",
  } = currentContent;

  const isLight = textColor === "light";

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div
          className={`absolute inset-0 bg-black ${
            isLight ? "opacity-40" : "opacity-10"
          }`}
        />
      </div>

      {slideCount > 1 && (
        <CarouselControls onPrev={prevSlide} onNext={nextSlide} />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
              isLight ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-xl md:text-2xl mb-8 ${
                isLight ? "text-white" : "text-gray-800"
              }`}
            >
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={buttonLink}
              className={`inline-flex justify-center items-center px-8 py-3 font-medium text-base rounded-full 
                ${
                  isLight
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
            >
              {buttonText}
            </Link>
            {secondaryButtonText && secondaryButtonLink && (
              <Link
                href={secondaryButtonLink}
                className={`inline-flex justify-center items-center px-8 py-3 font-medium text-base rounded-full border 
                  ${
                    isLight
                      ? "border-white text-white hover:bg-white hover:text-gray-900"
                      : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
