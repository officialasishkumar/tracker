"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { Code2, Trophy } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Trophy className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold">Contest Tracker</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/solutions"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/solutions" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Solutions
            </Link>
          </nav>

          <ModeToggle />

          <Button asChild variant="default" size="sm" className="hidden md:flex">
            <Link href="https://github.com/officialasishkumar" target="_blank">
              <Code2 className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

