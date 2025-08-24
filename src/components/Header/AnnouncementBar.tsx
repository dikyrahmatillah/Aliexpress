import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

export const announcements = [
  "Sale on now | Up to 25% off everything",
  "Free shipping on orders over $50",
  "New arrivals every week",
  "50,000+ five star reviews globally",
  "World-class warranty",
];

export default function AnnouncementBar({
  text,
  prev,
  next,
}: {
  text: string;
  prev: () => void;
  next: () => void;
}) {
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackMouse: true,
  });

  return (
    <div className="bg-[var(--accent)] text-white" {...handlers}>
      <div
        role="status"
        aria-live="polite"
        className="container relative mx-auto px-2 py-1 sm:px-4 sm:py-2 flex items-center justify-center text-xs sm:text-sm overflow-hidden"
      >
        <button
          type="button"
          className="hidden sm:block absolute left-2 sm:left-1/4 text-white text-lg"
          onClick={prev}
          aria-label="Previous announcement"
        >
          &#60;
        </button>

        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={text}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
              className="mx-2 sm:mx-12 text-center w-full"
            >
              {text}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="absolute right-2 flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous announcement"
            className="text-white text-sm p-1"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next announcement"
            className="text-white text-sm p-1"
          >
            ›
          </button>
        </div>

        <button
          type="button"
          className="hidden sm:block absolute right-2 sm:right-1/4 text-white text-lg"
          onClick={next}
          aria-label="Next announcement"
        >
          &#62;
        </button>
      </div>
    </div>
  );
}
