"use client"

import { useFilterContext } from "@/context/filter-context"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { motion } from "framer-motion"
import { getPlatformIcon } from "@/lib/utils"

export default function FilterBar() {
  const { selectedPlatforms, togglePlatform } = useFilterContext()
  const platforms = ["Codeforces", "CodeChef", "LeetCode"]

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-medium">Filter:</span>
      <div className="flex flex-wrap gap-4">
        {platforms.map((platform) => {
          const PlatformIcon = getPlatformIcon(platform)
          const isSelected = selectedPlatforms.includes(platform)

          return (
            <motion.div
              key={platform}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <Checkbox id={platform} checked={isSelected} onCheckedChange={() => togglePlatform(platform)} />
              <Label htmlFor={platform} className="flex items-center cursor-pointer text-sm font-medium">
                <PlatformIcon className="mr-1 h-4 w-4" />
                {platform}
              </Label>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

