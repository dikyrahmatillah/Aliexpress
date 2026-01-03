import Link from "next/link";
import React from "react";
import { FiMenu, FiSearch, FiShoppingCart } from "react-icons/fi";

export type DesktopActionsProps = {
  setIsSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DesktopActions({
  setIsSearchActive,
  setMobileOpen,
}: DesktopActionsProps) {
  return (
    <div className="flex items-center ml-auto gap-3">
      <button
        type="button"
        onClick={() => setIsSearchActive(true)}
        className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-700 hover:text-amber-600 cursor-pointer"
        aria-label="Open search"
      >
        <FiSearch className="w-5 h-5" />
        <span className="hidden sm:block">Search</span>
      </button>

      <Link
        href="/cart"
        className="relative text-gray-700 hover:text-amber-600"
      >
        <FiShoppingCart className="w-6 h-6" />
        <span className="sr-only">Cart</span>
        <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-xs rounded-full px-1"></span>
      </Link>

      <button
        type="button"
        className="md:hidden p-2 rounded hover:bg-gray-100 cursor-pointer"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((state) => !state)}
      >
        <FiMenu className="w-6 h-6" />
      </button>
    </div>
  );
}
