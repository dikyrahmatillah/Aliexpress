import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS } from "../nav.data";

type DesktopNavProps = {
  openKey: string | null;
  setOpen: React.Dispatch<React.SetStateAction<string | null>>;
  clearCloseTimer: () => void;
  startCloseTimer: () => void;
  handleDropdownKey: (event: React.KeyboardEvent, key: string) => void;
};

export default function DesktopNav({
  openKey,
  setOpen,
  clearCloseTimer,
  startCloseTimer,
  handleDropdownKey,
}: DesktopNavProps) {
  return (
    <nav
      className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6"
      aria-label="Primary navigation"
    >
      {NAV_ITEMS.map((item) => {
        const [singleLink] = item.links;
        const hasDropdown = item.links.length > 1;

        if (!hasDropdown && singleLink) {
          return (
            <Link
              key={item.key}
              href={singleLink.href}
              className="text-sm text-gray-700 hover:text-amber-600"
            >
              {item.label}
            </Link>
          );
        }

        return (
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
              aria-expanded={openKey === item.key}
              onClick={() => setOpen(openKey === item.key ? null : item.key)}
              onKeyDown={(event) => handleDropdownKey(event, item.key)}
            >
              {item.label}
            </button>

            <AnimatePresence>
              {openKey === item.key && (
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
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-gray-700 hover:text-amber-600"
                      role="menuitem"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
