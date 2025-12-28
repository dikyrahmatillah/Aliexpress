"use client";

import CarouselButton from "@/components/CarouselButton";

export default function HeroCarouselControls({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="absolute left-4 z-10">
        <CarouselButton direction="left" onClick={onPrev} />
      </div>
      <div className="absolute right-4 z-10">
        <CarouselButton direction="right" onClick={onNext} />
      </div>
    </>
  );
}
