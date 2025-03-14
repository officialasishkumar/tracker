import { Suspense } from "react"
import ContestCountdown from "@/components/contest-countdown"
import UpcomingContests from "@/components/upcoming-contests"
import PastContests from "@/components/past-contests"
import FilterBar from "@/components/filter-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookmarksPage from "@/components/bookmarks-page"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Loading next contest...</div>}>
          <ContestCountdown />
        </Suspense>

        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="h-12">
              <TabsTrigger value="upcoming" className="text-lg px-6">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="text-lg px-6">
                Past
              </TabsTrigger>
              <TabsTrigger value="bookmarked" className="text-lg px-6">
                Bookmarked
              </TabsTrigger>
            </TabsList>

            <FilterBar />
          </div>

          <TabsContent value="upcoming" className="mt-0">
            <UpcomingContests />
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <PastContests />
          </TabsContent>

          <TabsContent value="bookmarked" className="mt-0">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Loading bookmarks...</div>}>
              <BookmarksPage />
              {/* <UpcomingContests bookmarkedOnly={true} />
              <PastContests bookmarkedOnly={true} /> */}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

