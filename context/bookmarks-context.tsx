"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface BookmarksContextType {
  bookmarkedContests: string[]
  toggleBookmark: (contestId: string) => void
}

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarkedContests: [],
  toggleBookmark: () => {},
})

export const useBookmarksContext = () => useContext(BookmarksContext)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedContests, setBookmarkedContests] = useState<string[]>([])

  useEffect(() => {
    // Load bookmarks from localStorage on client side
    const savedBookmarks = localStorage.getItem("bookmarkedContests")
    if (savedBookmarks) {
      setBookmarkedContests(JSON.parse(savedBookmarks))
    }
  }, [])

  const toggleBookmark = (contestId: string) => {
    setBookmarkedContests((prev) => {
      const newBookmarks = prev.includes(contestId) ? prev.filter((id) => id !== contestId) : [...prev, contestId]

      // Save to localStorage
      localStorage.setItem("bookmarkedContests", JSON.stringify(newBookmarks))

      return newBookmarks
    })
  }

  return (
    <BookmarksContext.Provider value={{ bookmarkedContests, toggleBookmark }}>{children}</BookmarksContext.Provider>
  )
}

