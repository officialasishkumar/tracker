"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface FilterContextType {
  selectedPlatforms: string[]
  togglePlatform: (platform: string) => void
}

const FilterContext = createContext<FilterContextType>({
  selectedPlatforms: [],
  togglePlatform: () => {},
})

export const useFilterContext = () => useContext(FilterContext)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform)
      } else {
        return [...prev, platform]
      }
    })
  }

  return <FilterContext.Provider value={{ selectedPlatforms, togglePlatform }}>{children}</FilterContext.Provider>
}

