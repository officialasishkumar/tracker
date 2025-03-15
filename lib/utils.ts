import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Code2, Code, FileCode } from "lucide-react"
import type { TimeLeft } from "./types"
import type { Contest, Solution } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPlatformIcon(platform: string) {
  switch (platform) {
    case "Codeforces":
      return Code2
    case "CodeChef":
      return FileCode
    case "LeetCode":
      return Code
    default:
      return Code
  }
}

export function getPlatformColor(platform: string) {
  switch (platform) {
    case "Codeforces":
      return "#1890FF"
    case "CodeChef":
      return "#F48024"
    case "LeetCode":
      return "#FFA116"
    default:
      return "#888888"
  }
}

export function getTimeLeft(date: string): TimeLeft | null {
  const targetDate = new Date(date)
  const now = new Date()

  if (targetDate <= now) {
    return null
  }

  const difference = targetDate.getTime() - now.getTime()

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}


// Filter contests by search query (case-insensitive, order-independent)
export function filterContestsBySearch(contests: Contest[], searchQuery: string): Contest[] {
  if (!searchQuery.trim()) return contests;
  const keywords = searchQuery.toLowerCase().split(" ").filter(Boolean);
  return contests.filter(contest => {
    // Use contest.name or contest.title as the display title
    const title = (contest.name || contest.title).toLowerCase();
    return keywords.every(keyword => title.includes(keyword));
  });
}