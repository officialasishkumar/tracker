// components/solutions-list.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import YoutubeThumbnail from "./youtube-thumbnail";
import { getPlatformColor, getPlatformIcon } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { fetchAllSolutions } from "@/lib/api";
import type { Solution } from "@/lib/types";

export default function SolutionsList() {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    async function loadSolutions() {
      try {
        const fetchedSolutions: Solution[] = await fetchAllSolutions();
        setSolutions(fetchedSolutions);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    }
    loadSolutions();
  }, []);

  if (solutions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-muted-foreground">No solutions available yet</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {solutions.map((solution, index) => {
        const PlatformIcon = getPlatformIcon(solution.platform);
        const platformColor = getPlatformColor(solution.platform);

        return (
          <motion.div
            key={`bro-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{solution.title}</CardTitle>
                  <Badge className="text-white" style={{ backgroundColor: platformColor }}>
                    <PlatformIcon className="mr-1 h-3 w-3" />
                    {solution.platform}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <YoutubeThumbnail videoId={solution.youtubeId} />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
