// lib/api.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api/contests";

export async function fetchUpcomingContests() {
    const res = await fetch(`${BACKEND_URL}/upcoming`);
    if (!res.ok) throw new Error("Failed to fetch upcoming contests");
    return await res.json();
}

export async function fetchPastContests() {
    const res = await fetch(`${BACKEND_URL}/past`);
    if (!res.ok) throw new Error("Failed to fetch past contests");
    return await res.json();
}

export async function fetchAllSolutions() {
    const res = await fetch(`${BACKEND_URL}/solutions`);
    if (!res.ok) throw new Error("Failed to fetch contest solutions");
    return await res.json();
}

export async function fetchContestById(id: string) {
    const res = await fetch(`${BACKEND_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch contest");
    return await res.json();
}

export async function updateContestSolution(contestId: string, solutionUrl: string) {
    const res = await fetch(`${BACKEND_URL}/${contestId}/solution`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ solution: solutionUrl }),
    });
    if (!res.ok) throw new Error("Failed to update contest solution");
    return await res.json();
}

// Utility to get the next contest (by fetching upcoming contests and picking the first)
export async function fetchNextContest() {
    const contests = await fetchUpcomingContests();
    return contests.length > 0 ? contests[0] : null;
}
