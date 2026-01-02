"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS } from "./nav.data";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  setIsSearchActive: (v: boolean) => void;
};

export default function MobileMenu({
  mobileOpen,
  setMobileOpen,
  searchQuery,
  setSearchQuery,
  setIsSearchActive,
}: Props) {
  return (
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="md:hidden border-t"
        >
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                aria-label="Search products mobile"
              />
              <button
                onClick={() => {
                  setIsSearchActive(true);
                  setMobileOpen(false);
                }}
                className="ml-2 px-3 py-2 bg-amber-500 text-white rounded-md"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {NAV_ITEMS.map((item) => (
                <details key={item.key} className="rounded-md" aria-hidden>
                  <summary className="px-2 py-2 cursor-pointer text-gray-700 font-medium">
                    {item.label}
                  </summary>
                  <div className="pl-4 pb-2 space-y-1">
                    {item.links.map((ln) => (
                      <Link
                        key={ln.href}
                        href={ln.href}
                        className="block text-sm text-gray-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {ln.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}

              <Link
                href="/collections/beauty-health"
                className="block px-2 py-2 text-sm text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Beauty &amp; Health
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
