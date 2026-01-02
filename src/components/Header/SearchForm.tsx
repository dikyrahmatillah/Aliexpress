"use client";

import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsSearchActive: (v: boolean) => void;
};

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  setIsSearchActive,
}: Props) {
  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex items-center w-full gap-3"
    >
      <button
        type="button"
        onClick={() => setIsSearchActive(false)}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
        aria-label="Close search"
      >
        <FiX className="w-6 h-6" />
      </button>
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          autoFocus
          aria-label="Search products"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          aria-label="Submit search"
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
