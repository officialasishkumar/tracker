// components/bookmarks-page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ContestCard from "./contest-card";
import { useFilterContext } from "@/context/filter-context";
import { useBookmarksContext } from "@/context/bookmarks-context";
import type { Contest } from "@/lib/types";
import { fetchUpcomingContests, fetchPastContests } from "@/lib/api";

export default function BookmarksPage() {
    const { selectedPlatforms } = useFilterContext();
    const { bookmarkedContests } = useBookmarksContext();
    const [contests, setContests] = useState<Contest[]>([]);

    useEffect(() => {
        async function loadContests() {
            try {
                // Fetch upcoming and past contests concurrently
                const [upcoming, past] = await Promise.all([
                    fetchUpcomingContests(),
                    fetchPastContests(),
                ]);
                // Merge contests into one array
                let fetchedContests: Contest[] = [...upcoming, ...past];

                // Filter based on selected platforms if any
                if (selectedPlatforms.length > 0) {
                    fetchedContests = fetchedContests.filter((contest) =>
                        selectedPlatforms.includes(contest.platform)
                    );
                }

                // Filter for bookmarked contests
                fetchedContests = fetchedContests.filter((contest) =>
                    Boolean(bookmarkedContests[contest.contestId])
                );

                setContests(fetchedContests);
            } catch (error) {
                console.error("Error fetching contests:", error);
            }
        }

        loadContests();
    }, [selectedPlatforms, bookmarkedContests]);

    if (contests.length === 0) {
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
            {contests.map((contest, index) => (
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
