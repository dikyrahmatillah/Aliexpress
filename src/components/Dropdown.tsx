import { useState, useRef, useEffect, useCallback } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface ReusableDropdownProps {
  items: DropdownItem[];
  buttonLabel: string;
}

const ReusableDropdown: React.FC<ReusableDropdownProps> = ({
  items,
  buttonLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [closeDropdown]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {buttonLabel}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReusableDropdown;
