"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Bookmarks {
  [contestId: string]: string; // contestId: expiry date (ISO string)
}

interface BookmarksContextType {
  bookmarkedContests: Bookmarks;
  toggleBookmark: (contestId: string) => void;
}

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarkedContests: {},
  toggleBookmark: () => { },
});

export const useBookmarksContext = () => useContext(BookmarksContext);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedContests, setBookmarkedContests] = useState<Bookmarks>({});

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedContests");
    if (savedBookmarks) {
      try {
        const parsed: Bookmarks = JSON.parse(savedBookmarks);
        // Filter out expired bookmarks:
        const now = new Date();
        const validBookmarks = Object.fromEntries(
          Object.entries(parsed).filter(([_, expiry]) => new Date(expiry) > now)
        );
        setBookmarkedContests(validBookmarks);
      } catch (err) {
        console.error("Error parsing bookmarks:", err);
      }
    }
  }, []);

  const toggleBookmark = (contestId: string) => {
    setBookmarkedContests((prev) => {
      const newBookmarks = { ...prev };
      if (newBookmarks[contestId]) {
        // Remove if exists
        delete newBookmarks[contestId];
      } else {
        // Set expiry for 30 days from now
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        newBookmarks[contestId] = expiryDate;
      }
      localStorage.setItem("bookmarkedContests", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  return (
    <BookmarksContext.Provider value={{ bookmarkedContests, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}
