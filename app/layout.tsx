import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { BookmarksProvider } from "@/context/bookmarks-context"
import { FilterProvider } from "@/context/filter-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Contest Tracker | Track Coding Competitions",
  description: "Track upcoming and past coding contests from Codeforces, CodeChef, and LeetCode",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FilterProvider>
            <BookmarksProvider>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50 dark:from-background dark:to-background">
                <Header />
                {children}
              </div>
            </BookmarksProvider>
          </FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'