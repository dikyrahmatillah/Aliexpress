export default function CarouselButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`Scroll ${direction}`}
      className={`absolute ${
        direction === "left" ? "left-0" : "right-0"
      } top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 transition hidden md:block`}
      onClick={onClick}
      type="button"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {direction === "left" ? (
          <path d="M15 19l-7-7 7-7" />
        ) : (
          <path d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}
