"use client"

import type React from "react"
import { useState } from "react"
import type { Contest } from "@/lib/types"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Input } from "./ui/input"
import { updateContestSolution } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

interface SolutionFormProps {
  contests: Contest[]
}

export default function SolutionForm({ contests }: SolutionFormProps) {
  const [selectedContest, setSelectedContest] = useState<string>("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedContest) {
      setError("Please select a contest")
      return
    }

    if (!youtubeUrl) {
      setError("Please enter a YouTube URL")
      return
    }

    setIsSubmitting(true)

    try {
      // Make the API call to update the contest solution using the MongoDB _id
      await updateContestSolution(selectedContest, youtubeUrl)

      setIsSuccess(true)
      setSelectedContest("") // Reset the selected contest
      setYoutubeUrl("")

      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Failed to update contest solution")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contest">Contest</Label>
          <Select
            value={selectedContest}
            onValueChange={(contestId) => setSelectedContest(contestId)}
          >
            <SelectTrigger id="contest">
              <SelectValue placeholder="Select a contest" />
            </SelectTrigger>
            <SelectContent className="max-h-[13rem]">
              {contests.map((contest) => (
                <SelectItem key={contest._id} value={contest._id}>
                  {contest.name} ({contest.platform})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube-url">YouTube Solution URL</Label>
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>

        {error && (
          <motion.p
            className="text-destructive text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        <div className="flex justify-end">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center text-green-600 font-medium"
              >
                <Check className="mr-2 h-5 w-5" />
                Solution updated successfully!
              </motion.div>
            ) : (
              <motion.div
                key="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Updating Solution..." : "Update Solution"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Card>
  )
}
