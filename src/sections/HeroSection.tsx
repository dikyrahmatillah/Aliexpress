"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = content.length;
  const currentContent = content[current];
  const autoplayRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  // Autoplay
  useEffect(() => {
    if (slideCount <= 1) return;
    if (isPaused) return;

    autoplayRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 5000);

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    };
  }, [isPaused, slideCount]);

  if (slideCount === 0) return null;

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

  const slideVariants = {
    enter: (dir: 1 | -1) => ({
      opacity: 0,
      x: dir * 120,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: 1 | -1) => ({
      opacity: 0,
      x: dir * -120,
      scale: 0.98,
    }),
  } as const;

  const bgVariants = {
    enter: (dir: 1 | -1) => ({ opacity: 0, scale: 1.05, x: dir * 40 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir: 1 | -1) => ({ opacity: 0, scale: 0.98, x: dir * -40 }),
  } as const;

  // responsive overlay opacity classes
  const overlayOpacityClass = isLight
    ? "opacity-80 md:opacity-60"
    : "opacity-50 md:opacity-30";

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;
    const swipePower = Math.abs(offset.x) * 0.5 + Math.abs(velocity.x);
    const swipeConfidenceThreshold = 500;

    if (swipePower > swipeConfidenceThreshold) {
      if (offset.x < 0) nextSlide();
      else prevSlide();
    }

    window.setTimeout(() => setIsPaused(false), 300);
  };

  return (
    <section
      className="relative min-h-[55vh] md:min-h-[70vh] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setIsPaused(false), 300)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          variants={bgVariants}
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
          {/* subtle gradient overlay for better contrast */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black to-transparent ${overlayOpacityClass}`}
          />
        </motion.div>
      </AnimatePresence>

      {slideCount > 1 && (
        <div className="hidden md:block">
          <CarouselControls onPrev={prevSlide} onNext={nextSlide} />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={current}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              variants={slideVariants}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={handleDragEnd}
              className="opacity-100"
              aria-live="polite"
            >
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
                  isLight ? "text-white" : "text-gray-900"
                } text-center md:text-left`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-lg md:text-xl mb-8 ${
                    isLight ? "text-white" : "text-gray-800"
                  } text-center md:text-left`}
                >
                  {subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center md:justify-start">
                <Link
                  href={buttonLink}
                  aria-label={buttonText}
                  className={`inline-flex justify-center items-center px-6 sm:px-8 py-2 sm:py-3 font-medium text-sm sm:text-base rounded-full shadow-md 
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
                    aria-label={secondaryButtonText}
                    className={`inline-flex justify-center items-center px-6 sm:px-8 py-2 sm:py-3 font-medium text-sm sm:text-base rounded-full border shadow-sm 
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
            </motion.div>
          </AnimatePresence>

          {/* slide indicators */}
          {slideCount > 1 && (
            <div className="mt-6 flex items-center gap-2 justify-center">
              {content.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === current) return;
                    setDirection(idx > current ? 1 : -1);
                    setCurrent(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === current}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white 
                    ${
                      idx === current
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
