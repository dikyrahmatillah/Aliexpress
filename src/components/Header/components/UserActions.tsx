"use client";
import Link from "next/link";

export default function UserActions() {
  return (
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
  );
}
