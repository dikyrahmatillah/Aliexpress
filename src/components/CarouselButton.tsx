export default function CarouselButton({
  direction,
  onClick,
  disabled = false,
  className = "",
  showOnMobile = true,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  showOnMobile?: boolean;
}) {
  const visibility = showOnMobile ? "block" : "hidden md:block";
  const base = `bg-white bg-opacity-75 border border-gray-300 rounded-full shadow p-2 transition ${visibility}`;
  return (
    <button
      aria-label={`Scroll ${direction}`}
      className={`${base} ${className}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
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
