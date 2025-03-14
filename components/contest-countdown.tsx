"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getNextContest } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarClock, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { getPlatformColor, getPlatformIcon } from "@/lib/utils"
import { Badge } from "./ui/badge"
import Link from "next/link"

export default function ContestCountdown() {
  const nextContest = getNextContest()
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    if (!nextContest) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    const difference = new Date(nextContest.date).getTime() - new Date().getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [nextContest])

  if (!nextContest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Upcoming Contests</CardTitle>
          <CardDescription>Check back later for new contests</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const PlatformIcon = getPlatformIcon(nextContest.platform)
  const platformColor = getPlatformColor(nextContest.platform)

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
              <h3 className="text-xl md:text-2xl font-bold">{nextContest.title}</h3>
              <div className="flex items-center text-muted-foreground mt-1">
                <CalendarClock className="h-4 w-4 mr-2" />
                <span>{new Date(nextContest.date).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-3xl md:text-4xl font-bold"
                    >
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
  )
}

