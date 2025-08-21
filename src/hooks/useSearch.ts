import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export function useSearch(initial = "") {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initial);
  const router = useRouter();

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsSearchActive(false);
        setSearchQuery("");
      }
    },
    [searchQuery, router]
  );

  return {
    isSearchActive,
    setIsSearchActive,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
  };
}
