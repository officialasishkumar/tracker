// app/solutions/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import SolutionsList from "@/components/solutions-list";
import SolutionForm from "@/components/solution-form";
import SearchBar from "@/components/search-bar";

export default function SolutionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Contest Solutions</CardTitle>
          <CardDescription>
            View and add YouTube solution links for past contests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="view" className="w-full">
            {/* TabsList must be an immediate child of Tabs */}
            <TabsList className="mb-4">
              <TabsTrigger value="view">View Solutions</TabsTrigger>
              <TabsTrigger value="add">Add Solution</TabsTrigger>
            </TabsList>
            {/* Place extra UI elements (like SearchBar) inside Tabs but outside of TabsList */}
            <div className="mb-4">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <TabsContent value="view">
              <Suspense fallback={<div>Loading solutions...</div>}>
                <SolutionsList searchQuery={searchQuery} />
              </Suspense>
            </TabsContent>
            <TabsContent value="add">
              <SolutionForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
