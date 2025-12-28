"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export function useHeroCarousel<T>(content: T[]) {
  const slideCount = content.length;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  const currentContent = useMemo(() => content[current], [content, current]);

  useEffect(() => {
    if (slideCount <= 1) return;
    if (isPaused) return;

    const autoplayMs = 6500;
    const id = window.setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slideCount);
    }, autoplayMs);

    return () => window.clearInterval(id);
  }, [slideCount, isPaused]);

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  const goToSlide = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= slideCount) return;
      if (idx === current) return;
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current, slideCount]
  );

  return {
    current,
    direction,
    isPaused,
    setIsPaused,
    slideCount,
    currentContent,
    nextSlide,
    prevSlide,
    goToSlide,
  };
}
