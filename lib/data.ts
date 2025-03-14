import type { Contest, Solution } from "./types"

// Dummy data for contests
const contests: Contest[] = [
  {
    id: "cf-1",
    title: "Codeforces Round #835 (Div. 1)",
    platform: "Codeforces",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    url: "https://codeforces.com/contests",
  },
  {
    id: "cf-2",
    title: "Codeforces Round #836 (Div. 2)",
    platform: "Codeforces",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    url: "https://codeforces.com/contests",
  },
  {
    id: "cc-1",
    title: "CodeChef Starters 62 (Rated for Div 2, 3 & 4)",
    platform: "CodeChef",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    url: "https://www.codechef.com/contests",
  },
  {
    id: "lc-1",
    title: "LeetCode Weekly Contest 315",
    platform: "LeetCode",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    url: "https://leetcode.com/contest/",
  },
  {
    id: "cf-3",
    title: "Codeforces Round #834 (Div. 1)",
    platform: "Codeforces",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    url: "https://codeforces.com/contests",
  },
  {
    id: "cc-2",
    title: "CodeChef Starters 61 (Rated for Div 2, 3 & 4)",
    platform: "CodeChef",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    url: "https://www.codechef.com/contests",
  },
  {
    id: "lc-2",
    title: "LeetCode Weekly Contest 314",
    platform: "LeetCode",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    url: "https://leetcode.com/contest/",
  },
  {
    id: "cf-4",
    title: "Codeforces Round #833 (Div. 2)",
    platform: "Codeforces",
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
    url: "https://codeforces.com/contests",
  },
]

// Dummy data for solutions
let solutions: Solution[] = [
  {
    contestId: "cf-3",
    youtubeId: "dQw4w9WgXcQ", // Placeholder YouTube ID
    contest: contests.find((c) => c.id === "cf-3")!,
  },
  {
    contestId: "lc-2",
    youtubeId: "dQw4w9WgXcQ", // Placeholder YouTube ID
    contest: contests.find((c) => c.id === "lc-2")!,
  },
]

export function getAllContests(): Contest[] {
  return contests
}

export function getUpcomingContests(): Contest[] {
  const now = new Date()
  return contests.filter((contest) => new Date(contest.date) > now)
}

export function getPastContests(): Contest[] {
  const now = new Date()
  return contests.filter((contest) => new Date(contest.date) <= now)
}

export function getNextContest(): Contest | null {
  const upcomingContests = getUpcomingContests()
  if (upcomingContests.length === 0) return null

  return upcomingContests.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
}

export function getAllSolutions(): Solution[] {
  return solutions.map((solution) => ({
    ...solution,
    contest: contests.find((c) => c.id === solution.contestId)!,
  }))
}

export function getSolutionForContest(contestId: string): Solution | null {
  const solution = solutions.find((s) => s.contestId === contestId)
  if (!solution) return null

  return {
    ...solution,
    contest: contests.find((c) => c.id === solution.contestId)!,
  }
}

export function addSolution(solution: Omit<Solution, "contest">): void {
  // Check if solution already exists
  const existingSolution = solutions.find((s) => s.contestId === solution.contestId)

  if (existingSolution) {
    // Update existing solution
    solutions = solutions.map((s) => (s.contestId === solution.contestId ? { ...s, ...solution } : s))
  } else {
    // Add new solution
    solutions.push({
      ...solution,
      contest: contests.find((c) => c.id === solution.contestId)!,
    })
  }
}

