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

// Helper function to extract YouTube video ID from a URL.
function extractYoutubeId(url: string): string | null {
  // Matches standard YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEOID)
  // and shortened URLs (e.g., https://youtu.be/VIDEOID)
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Filter solutions by search query (case-insensitive, order-independent)
function filterSolutionsBySearch(solutions: Solution[], searchQuery: string): Solution[] {
  if (!searchQuery.trim()) return solutions;
  const keywords = searchQuery.toLowerCase().split(" ").filter(Boolean);
  return solutions.filter(solution => {
    // Use solution.title or solution.name as the display title
    const title = (solution.title || solution.name).toLowerCase();
    return keywords.every(keyword => title.includes(keyword));
  });
}

interface SolutionsListProps {
  searchQuery?: string;
}

export default function SolutionsList({ searchQuery = "" }: SolutionsListProps) {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    async function loadSolutions() {
      try {
        const fetchedSolutions: Solution[] = await fetchAllSolutions();
        // Ensure we only store contests that have a valid solution URL.
        const filtered = fetchedSolutions.filter((sol) => sol.solution && sol.solution.trim() !== "");
        setSolutions(filtered);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    }
    loadSolutions();
  }, []);

  // Filter solutions based on search query
  const filteredSolutions = useMemo(() => {
    return filterSolutionsBySearch(solutions, searchQuery);
  }, [solutions, searchQuery]);

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
        // Extract YouTube video ID from the solution URL
        const youtubeId = extractYoutubeId(solution.solution);

        // Skip rendering if youtubeId could not be extracted
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