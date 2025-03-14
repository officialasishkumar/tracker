import SolutionForm from "@/components/solution-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllContests } from "@/lib/data"
import { Suspense } from "react"
import SolutionsList from "@/components/solutions-list"

export default function SolutionsPage() {
  const contests = getAllContests()
  const pastContests = contests.filter((contest) => new Date(contest.date) < new Date())

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contest Solutions</CardTitle>
            <CardDescription>View and add YouTube solution links for past contests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="view" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="view">View Solutions</TabsTrigger>
                <TabsTrigger value="add">Add Solution</TabsTrigger>
              </TabsList>

              <TabsContent value="view">
                <Suspense fallback={<div>Loading solutions...</div>}>
                  <SolutionsList />
                </Suspense>
              </TabsContent>

              <TabsContent value="add">
                <SolutionForm contests={pastContests} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

