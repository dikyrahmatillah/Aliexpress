"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { HeroContent } from "@/types/hero";
import HeroCarouselControls from "@/sections/hero/HeroCarouselControls";
import { useHeroCarousel } from "@/sections/hero/useHeroCarousel";

interface HeroSectionProps {
  content: HeroContent[];
}

export default function HeroSection({ content }: HeroSectionProps) {
  const {
    current,
    direction,
    setIsPaused,
    slideCount,
    currentContent,
    nextSlide,
    prevSlide,
    goToSlide,
  } = useHeroCarousel(content);

  const slideVariants: Variants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  if (slideCount === 0) return null;

  const {
    title,
    subtitle,
    buttonText,
    secondaryButtonText,
    secondaryButtonLink,
    backgroundImage,
  } = currentContent;

  return (
    <section
      className="relative min-h-[55vh] md:min-h-[70vh] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          aria-hidden
        >
          <Image
            src={backgroundImage}
            alt={title ?? "Hero background"}
            fill
            className="object-cover"
            priority
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 md:opacity-60`}
          />
        </motion.div>
      </AnimatePresence>

      {slideCount > 1 && (
        <div className="hidden md:block">
          <HeroCarouselControls onPrev={prevSlide} onNext={nextSlide} />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-center md:text-left">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg md:text-xl mb-8 text-white text-center md:text-left">
                  {subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center md:justify-start">
                <span className="inline-flex justify-center items-center px-6 sm:px-8 py-2 sm:py-3 font-medium text-sm sm:text-base rounded-full shadow-md bg-white text-gray-900">
                  {buttonText}
                </span>
                {secondaryButtonText && secondaryButtonLink && (
                  <Link
                    href={secondaryButtonLink}
                    aria-label={secondaryButtonText}
                    className="inline-flex justify-center items-center px-6 sm:px-8 py-2 sm:py-3 font-medium text-sm sm:text-base rounded-full border shadow-sm border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    {secondaryButtonText}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slideCount > 1 && (
        <div className="absolute left-0 right-0 bottom-6 z-20 flex items-center gap-2 justify-center">
          {content.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current}
              className={`w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white 
                ${
                  idx === current ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
