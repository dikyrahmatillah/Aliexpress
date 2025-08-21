"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useAnnouncement } from "../../hooks/useAnnouncement";
import { useDropdown } from "../../hooks/useDropdown";
import { useSearch } from "../../hooks/useSearch";
import type { NavItem } from "./Header.types";

const announcements = [
  "Sale on now | Up to 25% off everything",
  "Free shipping on orders over $50",
  "New arrivals every week",
  "50,000+ five star reviews globally",
  "World-class warranty",
];

const NAV_ITEMS: NavItem[] = [
  {
    key: "hardware",
    label: "Hardware",
    width: "w-56",
    links: [
      {
        href: "/collections/34",
        label: "Automobiles & Motorcycles",
      },
      { href: "/collections/1420", label: "Tools" },
      { href: "/collections/6", label: "Home Appliances" },
    ],
  },
  {
    key: "home",
    label: "Home & Living",
    width: "w-64",
    links: [
      { href: "/collections/15", label: "Home & Garden" },
      { href: "/collections/39", label: "Lights & Lighting" },
      {
        href: "/collections/18",
        label: "Sports & Entertainment",
      },
      { href: "/collections/26", label: "Toys & Hobbies" },
    ],
  },
  {
    key: "electronics",
    label: "Electronics",
    width: "w-64",
    links: [
      { href: "/collections/7", label: "Computer & Office" },
      {
        href: "/collections/44",
        label: "Consumer Electronics",
      },
      {
        href: "/collections/509",
        label: "Phones & Telecommunications",
      },
    ],
  },
  {
    key: "fashion",
    label: "Fashion",
    width: "w-64",
    links: [
      { href: "/collections/200000343", label: "Men’s Clothing" },
      { href: "/collections/200000345", label: "Women’s Clothing" },
      { href: "/collections/322", label: "Shoes" },
      {
        href: "/collections/36",
        label: "Jewelry & Accessories",
      },
      { href: "/collections/1511", label: "Watches" },
    ],
  },
];

export default function Header() {
  const { text, prev, next } = useAnnouncement(announcements, 5000);
  const { open, setOpen, clearCloseTimer, startCloseTimer } = useDropdown();
  const {
    isSearchActive,
    setIsSearchActive,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
  } = useSearch();

  const handleDropdownKey = useCallback(
    (e: React.KeyboardEvent, key: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen((prevKey) => (prevKey === key ? null : key));
        clearCloseTimer();
      } else if (e.key === "Escape") {
        setOpen(null);
      }
    },
    [clearCloseTimer, setOpen]
  );

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--accent)] text-white py-2 text-sm flex items-center justify-center relative">
        <button
          type="button"
          className="absolute left-1/4 text-white text-lg"
          onClick={prev}
          aria-label="Previous announcement"
        >
          &#60;
        </button>
        <p className="mx-12">{text}</p>
        <button
          type="button"
          className="absolute right-1/4 text-white text-lg"
          onClick={next}
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
                Runolf
              </Link>

              {/* Navigation */}
              <nav
                className="hidden md:flex space-x-6"
                aria-label="Primary navigation"
              >
                {NAV_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseLeave={() => startCloseTimer()}
                    onMouseEnter={() => {
                      clearCloseTimer();
                      setOpen(item.key);
                    }}
                  >
                    <button
                      type="button"
                      className="hover:underline"
                      aria-haspopup="true"
                      aria-expanded={open === item.key}
                      onClick={() =>
                        setOpen(open === item.key ? null : item.key)
                      }
                      onKeyDown={(e) => handleDropdownKey(e, item.key)}
                    >
                      {item.label}
                    </button>

                    {open === item.key && (
                      <div
                        role="menu"
                        className={`absolute mt-2 ${item.width} p-4 bg-white border border-amber-300 shadow-md rounded-md space-y-2`}
                        onMouseEnter={() => clearCloseTimer()}
                        onMouseLeave={() => startCloseTimer()}
                      >
                        {item.links.map((ln) => (
                          <Link
                            key={ln.href}
                            href={ln.href}
                            className="block"
                            role="menuitem"
                          >
                            {ln.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Link
                  href="/collections/beauty-health"
                  className="hover:underline"
                >
                  Beauty &amp; Health
                </Link>
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
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
                <button
                  type="button"
                  className="md:hidden"
                  aria-label="Open menu"
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
                aria-label="Close search"
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
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label="Submit search"
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
