"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

import { useAnnouncement } from "../../hooks/useAnnouncement";
import { useDropdown } from "../../hooks/useDropdown";
import { useSearch } from "../../hooks/useSearch";
import AnnouncementBar, { announcements } from "./AnnouncementBar";
import { NAV_ITEMS } from "./nav.data";

export default function Header() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsActive(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { text, prev, next } = useAnnouncement(announcements, 5000);
  const { open, setOpen, clearCloseTimer, startCloseTimer } = useDropdown();
  const {
    isSearchActive,
    setIsSearchActive,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
  } = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <AnnouncementBar text={text} prev={prev} next={next} />

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
          isActive || isSearchActive
            ? "bg-white/50 backdrop-blur-md shadow-sm"
            : "bg-white/100 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-3 relative flex items-center justify-between gap-4">
          {!isSearchActive ? (
            <>
              {/* Logo */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-amber-500 flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <span className="hidden sm:inline text-lg font-semibold">
                    Runolf
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav
                className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6"
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
                      className="text-sm text-gray-700 hover:text-amber-600 transition-colors"
                      aria-haspopup="true"
                      aria-expanded={open === item.key}
                      onClick={() =>
                        setOpen(open === item.key ? null : item.key)
                      }
                      onKeyDown={(e) => handleDropdownKey(e, item.key)}
                    >
                      {item.label}
                    </button>

                    <AnimatePresence>
                      {open === item.key && (
                        <motion.div
                          role="menu"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute mt-3 ${item.width} p-3 bg-white border border-gray-100 shadow-lg rounded-md space-y-2`}
                          onMouseEnter={() => clearCloseTimer()}
                          onMouseLeave={() => startCloseTimer()}
                        >
                          {item.links.map((ln) => (
                            <Link
                              key={ln.href}
                              href={ln.href}
                              className="block text-sm text-gray-700 hover:text-amber-600"
                              role="menuitem"
                            >
                              {ln.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link
                  href="/collections/beauty-health"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Beauty &amp; Health
                </Link>
              </nav>

              {/* Right actions */}
              <div className="flex items-center ml-auto gap-3">
                <button
                  type="button"
                  onClick={() => setIsSearchActive(true)}
                  className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-700 hover:text-amber-600"
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

                {/* Mobile menu button */}
                <button
                  type="button"
                  className="md:hidden p-2 rounded hover:bg-gray-100"
                  aria-label="Toggle menu"
                  onClick={() => setMobileOpen((s) => !s)}
                >
                  <FiMenu className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            /* Search Form */
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full gap-3"
            >
              <button
                type="button"
                onClick={() => setIsSearchActive(false)}
                className="text-gray-500 hover:text-gray-700"
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-label="Submit search"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mobile menu panel */}
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
                    onClick={() => setIsSearchActive(true)}
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
                  >
                    Beauty &amp; Health
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
