export interface Contest {
  id: string
  title: string
  platform: "Codeforces" | "CodeChef" | "LeetCode"
  date: string
  url: string
}

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds?: number
}

export interface Solution {
  contestId: string
  youtubeId: string
  contest: Contest
}

