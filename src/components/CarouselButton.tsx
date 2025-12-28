import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CarouselButton({
  direction,
  onClick,
  disabled = false,
  showOnMobile = true,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  showOnMobile?: boolean;
}) {
  const visibility = showOnMobile ? "block" : "hidden md:block";
  return (
    <button
      aria-label={`Scroll ${direction}`}
      className={`bg-white bg-opacity-75 border border-gray-300 rounded-full shadow p-2 transition cursor-pointer ${visibility}`}
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
