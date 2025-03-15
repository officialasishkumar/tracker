// app/page.tsx
import { Suspense } from "react";
import ContestCountdown from "@/components/contest-countdown";
import ContestTabs from "@/components/contest-tabs";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Loading next contest...</div>}>
          <ContestCountdown />
        </Suspense>
        <ContestTabs />
      </div>
    </main>
  );
}
