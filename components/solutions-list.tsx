// components/solutions-list.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import YoutubeThumbnail from "./youtube-thumbnail";
import { getPlatformColor, getPlatformIcon, filterContestsBySearch } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { fetchAllSolutions } from "@/lib/api";
import type { Solution } from "@/lib/types";
import Skeleton from "./loading-skeleton";

// Helper function to extract YouTube video ID from a URL.
function extractYoutubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Filter solutions by search query (case-insensitive, order-independent)
function filterSolutionsBySearch(solutions: Solution[], searchQuery: string): Solution[] {
  if (!searchQuery.trim()) return solutions;
  const keywords = searchQuery.toLowerCase().split(" ").filter(Boolean);
  return solutions.filter(solution => {
    const title = (solution.title || solution.name).toLowerCase();
    return keywords.every(keyword => title.includes(keyword));
  });
}

interface SolutionsListProps {
  searchQuery?: string;
}

export default function SolutionsList({ searchQuery = "" }: SolutionsListProps) {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSolutions() {
      try {
        const fetchedSolutions: Solution[] = await fetchAllSolutions();
        const filtered = fetchedSolutions.filter((sol) => sol.solution && sol.solution.trim() !== "");
        setSolutions(filtered);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSolutions();
  }, []);

  // Filter solutions based on search query
  const filteredSolutions = useMemo(() => {
    return filterSolutionsBySearch(solutions, searchQuery);
  }, [solutions, searchQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  if (filteredSolutions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-muted-foreground">
          {solutions.length === 0
            ? "No solutions available yet"
            : "No solutions match your search criteria"}
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredSolutions.map((solution, index) => {
        const PlatformIcon = getPlatformIcon(solution.platform);
        const platformColor = getPlatformColor(solution.platform);
        const youtubeId = extractYoutubeId(solution.solution);

        if (!youtubeId) return null;

        return (
          <motion.div
            key={`solution-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{solution.title || solution.name}</CardTitle>
                  <Badge className="text-white" style={{ backgroundColor: platformColor }}>
                    <PlatformIcon className="mr-1 h-3 w-3" />
                    {solution.platform}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <YoutubeThumbnail videoId={youtubeId} />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
