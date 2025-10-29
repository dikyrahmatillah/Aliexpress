import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
      {direction === "left" ? (
        <FiChevronLeft className="w-6 h-6" />
      ) : (
        <FiChevronRight className="w-6 h-6" />
      )}
    </button>
  );
}
