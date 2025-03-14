"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog"
import { Play, X } from "lucide-react"
import { motion } from "framer-motion"

interface YoutubeThumbnailProps {
  videoId: string
}

export default function YoutubeThumbnail({ videoId }: YoutubeThumbnailProps) {
  const [isOpen, setIsOpen] = useState(false)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="youtube-thumbnail cursor-pointer rounded-md overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            src={thumbnailUrl || "/placeholder.svg"}
            alt="YouTube video thumbnail"
            className="w-full h-auto object-cover"
          />
          <div className="play-icon">
            <Play className="h-12 w-12 fill-white" />
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] md:max-w-[900px] p-0 bg-black/95 border-neutral-800 rounded-xl shadow-2xl">
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white/70 hover:text-white" />
          </button>
        </div>
        <DialogTitle className="sr-only">YouTube Video Player</DialogTitle>
        <div className="aspect-video w-full rounded-b-xl overflow-hidden">
          <motion.iframe
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="bg-black"
          ></motion.iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}

