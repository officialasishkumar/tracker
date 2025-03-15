// components/past-contests.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ContestCard from "./contest-card";
import { useFilterContext } from "@/context/filter-context";
import { useBookmarksContext } from "@/context/bookmarks-context";
import type { Contest } from "@/lib/types";
import { fetchPastContests } from "@/lib/api";
import Skeleton from "./loading-skeleton";
import { filterContestsBySearch } from "@/lib/utils";

interface PastContestsProps {
  bookmarkedOnly?: boolean;
  searchQuery?: string;
}

export default function PastContests({ bookmarkedOnly = false, searchQuery = "" }: PastContestsProps) {
  const { selectedPlatforms } = useFilterContext();
  const { bookmarkedContests } = useBookmarksContext();
  const [loadedContests, setLoadedContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data once on mount
  useEffect(() => {
    async function loadContests() {
      try {
        const contests: Contest[] = await fetchPastContests();
        setLoadedContests(contests);
      } catch (error) {
        console.error("Error fetching past contests:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContests();
  }, []);

  // Apply filtering based on selected platforms, bookmarks, and search query without re-fetching.
  const filteredContests = useMemo(() => {
    let contests = [...loadedContests];

    // Filter by selected platforms if any.
    if (selectedPlatforms.length > 0) {
      contests = contests.filter((contest) =>
        selectedPlatforms.includes(contest.platform)
      );
    }

    // Filter only bookmarked contests if required.
    if (bookmarkedOnly) {
      contests = contests.filter((contest) => Boolean(bookmarkedContests[contest.id]));
    }

    // Apply search filter (case-insensitive, order-independent)
    return filterContestsBySearch(contests, searchQuery);
  }, [loadedContests, selectedPlatforms, bookmarkedOnly, bookmarkedContests, searchQuery]);

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
          No past contests found with the selected filters
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
    </div>
  );
}
