"use client";
import Link from "next/link";
import { useState } from "react";

export default function MainNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
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
            <Link href="/collections/bedroom/accessories" className="block">
              Home & Garden
            </Link>
            <Link href="/collections/bedroom/accessories" className="block">
              Home Improvement & Lighting
            </Link>
            <Link href="/collections/bedroom/accessories" className="block">
              Home Appliances
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
