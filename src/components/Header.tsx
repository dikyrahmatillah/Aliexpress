"use client";

import { useState } from "react";
import Link from "next/link";

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

  const prevAnnouncement = () => {
    setCurrent((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const nextAnnouncement = () => {
    setCurrent((next) => (next === announcements.length - 1 ? 0 : next + 1));
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
            <Link href="/collections/sofas-couches" className="hover:underline">
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
            <Link href="/account" className="hover:underline hidden md:block">
              Log in
            </Link>
            <Link href="/cart" className="hover:underline flex items-center">
              <span>Cart</span>
              <span className="ml-1">(0)</span>
            </Link>
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
        </div>
      </header>
    </>
  );
}
