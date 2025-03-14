"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Contest } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CalendarClock, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { getPlatformColor, getPlatformIcon, getTimeLeft, cn } from "@/lib/utils";
import { useBookmarksContext } from "@/context/bookmarks-context";
import { motion } from "framer-motion";
import YoutubeThumbnail from "./youtube-thumbnail";
import { fetchContestById } from "@/lib/api";

function extractYoutubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

interface ContestCardProps {
  contest: Contest;
  showSolution?: boolean;
}

export default function ContestCard({ contest, showSolution = false }: ContestCardProps) {
  const { bookmarkedContests, toggleBookmark } = useBookmarksContext();
  const contestIdentifier = contest.contestId || contest.id;
  const isBookmarked = Boolean(bookmarkedContests[contestIdentifier]);
  const PlatformIcon = getPlatformIcon(contest.platform);
  const platformColor = getPlatformColor(contest.platform);
  const timeLeft = getTimeLeft(contest.startTime);

  const [contestDetails, setContestDetails] = useState<Contest | null>(null);

  useEffect(() => {
    async function getContestDetails() {
      if (showSolution) {
        try {
          const details = await fetchContestById(contest._id);
          console.log("Contest details:", details);
          setContestDetails(details);
        } catch (error) {
          console.error("Error fetching contest details:", error);
        }
      }
    }
    getContestDetails();
  }, [showSolution, contest._id]);

  const youtubeId = contestDetails && contestDetails.solution
    ? extractYoutubeId(contestDetails.solution)
    : null;

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
            onClick={() => toggleBookmark(contestIdentifier)}
            className="text-muted-foreground hover:text-destructive focus:outline-none"
          >
            <Heart
              className={cn("h-5 w-5 transition-all", isBookmarked && "fill-destructive text-destructive")}
            />
          </motion.button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="font-bold text-lg line-clamp-2 mb-2">{contest.name}</h3>
        <div className="flex flex-col text-muted-foreground text-sm space-y-1">
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Start: {new Date(contest.startTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>End: {new Date(contest.endTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Duration: {(contest.duration / 3600).toFixed(2)} hours</span>
          </div>
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

        {showSolution && contestDetails && youtubeId && (
          <div className="mt-4">
            <YoutubeThumbnail videoId={youtubeId} />
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
  );
}
