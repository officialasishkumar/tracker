// components/contest-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingContests from "./upcoming-contests";
import PastContests from "./past-contests";
import BookmarksPage from "./bookmarks-page";
import SearchBar from "./search-bar";
import FilterBar from "./filter-bar";

export default function ContestTabs() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Tabs defaultValue="upcoming" className="w-full">
            {/* TabsList is an immediate child of Tabs */}
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

            {/* Extra UI elements can be placed after the TabsList */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-4">
                <SearchBar onSearch={setSearchQuery} />
                <FilterBar />
            </div>

            <TabsContent value="upcoming">
                <UpcomingContests searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="past">
                <PastContests searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="bookmarked">
                <BookmarksPage searchQuery={searchQuery} />
            </TabsContent>
        </Tabs>
    );
}
