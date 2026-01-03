"use client";

import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useAnnouncement } from "../../hooks/useAnnouncement";
import { useDropdown } from "../../hooks/useDropdown";
import { useSearch } from "../../hooks/useSearch";
import AnnouncementBar, {
  announcements,
} from "../header/announcement/AnnouncementBar";
import DesktopActions from "../header/desktop/DesktopActions";
import DesktopNav from "../header/desktop/DesktopNav";
import MobileMenu from "../header/mobile/MobileMenu";
import SearchForm from "../header/SearchForm";

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
      <AnnouncementBar text={text} prev={prev} next={next} />

      <header
        className={`sticky top-0 z-40 transition-colors duration-200 border-b bg-white/50 backdrop-blur-md shadow-sm`}
      >
        <div className="container mx-auto px-4 py-3 relative flex items-center justify-between gap-4">
          {!isSearchActive ? (
            <>
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

              <DesktopNav
                openKey={open}
                setOpen={setOpen}
                clearCloseTimer={clearCloseTimer}
                startCloseTimer={startCloseTimer}
                handleDropdownKey={handleDropdownKey}
              />

              <DesktopActions
                setIsSearchActive={setIsSearchActive}
                setMobileOpen={setMobileOpen}
              />
            </>
          ) : (
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
              setIsSearchActive={setIsSearchActive}
            />
          )}
        </div>

        <MobileMenu
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsSearchActive={setIsSearchActive}
        />
      </header>
    </>
  );
}
