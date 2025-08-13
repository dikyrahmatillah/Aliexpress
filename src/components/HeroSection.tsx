"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroContent {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage: string;
  textColor?: "light" | "dark";
}

interface HeroSectionProps {
  content: HeroContent[];
}

export default function HeroSection({ content }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % content.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? content.length - 1 : prev - 1));

  const {
    title,
    subtitle,
    buttonText,
    buttonLink,
    secondaryButtonText,
    secondaryButtonLink,
    backgroundImage,
    textColor = "light",
  } = content[current];

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
            textColor === "light" ? "opacity-40" : "opacity-10"
          }`}
        />
      </div>

      {/* Carousel Controls */}
      {content.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white/70 text-2xl rounded-full p-2"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            &#60;
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white/70 text-2xl rounded-full p-2"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            &#62;
          </button>
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
              textColor === "light" ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`text-xl md:text-2xl mb-8 ${
                textColor === "light" ? "text-white" : "text-gray-800"
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
                  textColor === "light"
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
                    textColor === "light"
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
