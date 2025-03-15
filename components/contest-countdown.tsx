// components/contest-countdown.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { getPlatformColor, getPlatformIcon } from "@/lib/utils";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { fetchNextContest } from "@/lib/api";
import Skeleton from "./loading-skeleton";

export default function ContestCountdown() {
  const [nextContest, setNextContest] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the next contest when the component mounts
  useEffect(() => {
    async function loadContest() {
      try {
        const contest = await fetchNextContest();
        setNextContest(contest);
      } catch (error) {
        console.error("Error fetching next contest:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContest();
  }, []);

  // Function to calculate the time left until the contest starts
  function calculateTimeLeft() {
    if (!nextContest) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const contestStartTime = nextContest.startTime || nextContest.date;
    if (!contestStartTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const difference = new Date(contestStartTime).getTime() - new Date().getTime();

    if (isNaN(difference) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [nextContest]);

  if (isLoading) {
    // Render a skeleton loading state while waiting for contest data
    return (
      <Card className="p-6">
        <Skeleton className="h-40 w-full" />
      </Card>
    );
  }

  if (!nextContest) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>No Upcoming Contests</CardTitle>
          <CardDescription>Check back later for new contests</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const contestStartTime = nextContest.startTime || nextContest.date;
  const contestName = nextContest.name || nextContest.title || "Unnamed Contest";
  const PlatformIcon = getPlatformIcon(nextContest.platform);
  const platformColor = getPlatformColor(nextContest.platform);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">Next Contest</CardTitle>
              <CardDescription className="text-base mt-1">Get ready for the upcoming challenge</CardDescription>
            </div>
            <Badge className="text-white" style={{ backgroundColor: platformColor }}>
              <PlatformIcon className="mr-1 h-3 w-3" />
              {nextContest.platform}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">{contestName}</h3>
              <div className="flex items-center text-muted-foreground mt-1">
                <CalendarClock className="h-4 w-4 mr-2" />
                <span>{new Date(contestStartTime).toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 py-2">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.div key={value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-3xl md:text-4xl font-bold">
                      {value}
                    </motion.div>
                  </AnimatePresence>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1 capitalize">{label}</div>
                </div>
              ))}
            </div>
            <Button asChild className="w-full">
              <Link href={nextContest.url} target="_blank" rel="noopener noreferrer">
                <span>Go to Contest</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
