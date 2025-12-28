"use client";

import { HeroContent } from "@/types/hero";
import { useEffect, useState } from "react";

export function useHeroCarousel(content: HeroContent[]) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const slideCount = content.length;
  const currentContent = content[current];

  useEffect(() => {
    if (slideCount <= 1) return;

    const autoplayMs = 6500;
    const id = window.setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slideCount);
    }, autoplayMs);

    return () => window.clearInterval(id);
  }, [slideCount]);

  function nextSlide() {
    if (slideCount <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slideCount);
  }

  function prevSlide() {
    if (slideCount <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }

  function goToSlide(idx: number) {
    if (idx < 0 || idx >= slideCount) return;
    if (idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }

  return {
    current,
    direction,
    slideCount,
    currentContent,
    nextSlide,
    prevSlide,
    goToSlide,
  };
}
