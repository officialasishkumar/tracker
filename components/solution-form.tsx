"use client"

import type React from "react"

import { useState } from "react"
import type { Contest } from "@/lib/types"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { addSolution } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

interface SolutionFormProps {
  contests: Contest[]
}

export default function SolutionForm({ contests }: SolutionFormProps) {
  const [selectedContest, setSelectedContest] = useState("")
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

    // Extract YouTube ID from URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = youtubeUrl.match(youtubeRegex)

    if (!match) {
      setError("Invalid YouTube URL")
      return
    }

    const youtubeId = match[1]

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addSolution({
        contestId: selectedContest,
        youtubeId,
      })

      setIsSuccess(true)
      setSelectedContest("")
      setYoutubeUrl("")

      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Failed to add solution")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contest">Contest</Label>
          <Select value={selectedContest} onValueChange={setSelectedContest}>
            <SelectTrigger id="contest">
              <SelectValue placeholder="Select a contest" />
            </SelectTrigger>
            <SelectContent>
              {contests.map((contest) => (
                <SelectItem key={contest.id} value={contest.id}>
                  {contest.title} ({contest.platform})
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
                Solution added successfully!
              </motion.div>
            ) : (
              <motion.div
                key="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Adding Solution..." : "Add Solution"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Card>
  )
}

