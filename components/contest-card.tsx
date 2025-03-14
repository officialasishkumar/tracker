"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { Contest } from "@/lib/types"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { CalendarClock, ExternalLink, Heart } from "lucide-react"
import Link from "next/link"
import { getPlatformColor, getPlatformIcon, getTimeLeft } from "@/lib/utils"
import { useBookmarksContext } from "@/context/bookmarks-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import YoutubeThumbnail from "./youtube-thumbnail"
import { getSolutionForContest } from "@/lib/data"

interface ContestCardProps {
  contest: Contest
  showSolution?: boolean
}

export default function ContestCard({ contest, showSolution = false }: ContestCardProps) {
  const { bookmarkedContests, toggleBookmark } = useBookmarksContext()
  const isBookmarked = bookmarkedContests.includes(contest.id)
  const PlatformIcon = getPlatformIcon(contest.platform)
  const platformColor = getPlatformColor(contest.platform)
  const timeLeft = getTimeLeft(contest.date)
  const solution = showSolution ? getSolutionForContest(contest.id) : null

  return (
    <Card className="contest-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className="text-white" style={{ backgroundColor: platformColor }}>
            <PlatformIcon className="mr-1 h-3 w-3" />
            {contest.platform}
          </Badge>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleBookmark(contest.id)}
            className="text-muted-foreground hover:text-destructive focus:outline-none"
          >
            <Heart className={cn("h-5 w-5 transition-all", isBookmarked && "fill-destructive text-destructive")} />
          </motion.button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="font-bold text-lg line-clamp-2 mb-2">{contest.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm">
          <CalendarClock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{new Date(contest.date).toLocaleString()}</span>
        </div>

        {!showSolution && timeLeft && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Time remaining:</p>
            <p className="font-medium">
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {timeLeft.hours > 0 && `${timeLeft.hours}h `}
              {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
            </p>
          </div>
        )}

        {showSolution && solution && (
          <div className="mt-4">
            <YoutubeThumbnail videoId={solution.youtubeId} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={contest.url} target="_blank" rel="noopener noreferrer">
            <span>{showSolution ? "View Contest" : "Go to Contest"}</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

