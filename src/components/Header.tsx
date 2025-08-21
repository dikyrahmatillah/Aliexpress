"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const announcements = [
  "Sale on now | Up to 25% off everything",
  "Free shipping on orders over $50",
  "New arrivals every week",
  "50,000+ five star reviews globally",
  "World-class warranty",
];

export default function Header() {
  const [current, setCurrent] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const prevAnnouncement = () => {
    setCurrent((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const nextAnnouncement = () => {
    setCurrent((next) => (next === announcements.length - 1 ? 0 : next + 1));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--accent)] text-white py-2 text-sm flex items-center justify-center ">
        <button
          className="absolute left-2/6 text-white text-lg"
          onClick={prevAnnouncement}
          aria-label="Previous announcement"
        >
          &#60;
        </button>
        <p className="mx-12">{announcements[current]}</p>
        <button
          className="absolute right-2/6 text-white text-lg"
          onClick={nextAnnouncement}
          aria-label="Next announcement"
        >
          &#62;
        </button>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {!isSearchActive ? (
            <>
              {/* Logo */}
              <Link href="/" className="text-2xl font-bold">
                Koala
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/collections/mattresses"
                  className="hover:underline bg-amber-500"
                >
                  Shop Sale
                </Link>
                <Link href="/collections/sofa-beds" className="hover:underline">
                  Electronics
                </Link>
                <Link href="/collections/bed-bases" className="hover:underline">
                  Clothing
                </Link>
                <Link
                  href="/collections/sofas-couches"
                  className="hover:underline"
                >
                  Accessories
                </Link>
                <div>
                  {/* Dropdown for More */}
                  <div className="relative">
                    <button
                      className="hover:underline"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      onBlur={() => setDropdownOpen(false)}
                    >
                      More
                    </button>
                    {dropdownOpen && (
                      <div className="absolute -left-4 mt-2 w-64 p-4 bg-white border border-amber-300 shadow-md rounded-md space-y-2">
                        <Link
                          href="/collections/bedroom/accessories"
                          className="block"
                        >
                          Home & Garden
                        </Link>
                        <Link
                          href="/collections/bedroom/accessories"
                          className="block"
                        >
                          Home Improvement & Lighting
                        </Link>
                        <Link
                          href="/collections/bedroom/accessories"
                          className="block"
                        >
                          Home Appliances
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSearchActive(true)}
                  className="hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search</span>
                </button>
                <button className="md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            /* Search Form */
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full space-x-4"
            >
              <button
                type="button"
                onClick={() => setIsSearchActive(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </header>
    </>
  );
}
