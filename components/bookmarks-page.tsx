// components/bookmarks-page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ContestCard from "./contest-card";
import { useFilterContext } from "@/context/filter-context";
import { useBookmarksContext } from "@/context/bookmarks-context";
import type { Contest } from "@/lib/types";
import { fetchUpcomingContests, fetchPastContests } from "@/lib/api";
import Skeleton from "./loading-skeleton";
import { filterContestsBySearch } from "@/lib/utils";

interface BookmarksPageProps {
    searchQuery?: string;
}

export default function BookmarksPage({ searchQuery = "" }: BookmarksPageProps) {
    const { selectedPlatforms } = useFilterContext();
    const { bookmarkedContests } = useBookmarksContext();
    const [loadedContests, setLoadedContests] = useState<Contest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load both upcoming and past contests once
    useEffect(() => {
        async function loadContests() {
            try {
                const [upcoming, past] = await Promise.all([
                    fetchUpcomingContests(),
                    fetchPastContests(),
                ]);
                setLoadedContests([...upcoming, ...past]);
            } catch (error) {
                console.error("Error fetching contests:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadContests();
    }, []);

    // Filter locally based on bookmarks, selected platforms, and search query.
    const filteredContests = useMemo(() => {
        let contests = [...loadedContests];

        if (selectedPlatforms.length > 0) {
            contests = contests.filter((contest) =>
                selectedPlatforms.includes(contest.platform)
            );
        }

        // Only bookmarked contests.
        contests = contests.filter((contest) => Boolean(bookmarkedContests[contest.id]));

        return filterContestsBySearch(contests, searchQuery);
    }, [loadedContests, selectedPlatforms, bookmarkedContests, searchQuery]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-56 w-full" />
                ))}
            </div>
        );
    }

    if (filteredContests.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">
                    No bookmarked contests found
                </h3>
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {filteredContests.map((contest, index) => (
                <motion.div
                    key={contest.id || `contest-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <ContestCard contest={contest} showSolution={true} />
                </motion.div>
            ))}
        </motion.div>
    );
}
