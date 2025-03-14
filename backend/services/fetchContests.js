const axios = require("axios");
const Contest = require("../models/contest.model");

const clistApiKey = process.env.CLIST_API_KEY;
const codeforcesApiUrl = "https://codeforces.com/api/contest.list";

async function fetchClistContests(platform) {
    try {
        const resourceName = platform === "LeetCode" ? "leetcode.com" : "codechef.com";
        const now = new Date().toISOString();

        // Fetch upcoming contests
        const upcomingUrl = `https://clist.by/api/v2/contest/?resource=${resourceName}&end__gte=${now}&order_by=start`;
        const upcomingResponse = await axios.get(upcomingUrl, {
            headers: { Authorization: clistApiKey }
        });
        const upcomingData = upcomingResponse.data.objects || [];

        // Fetch past contests (limit to 5)
        const pastUrl = `https://clist.by/api/v2/contest/?resource=${resourceName}&end__lt=${now}&order_by=-start&limit=5`;
        const pastResponse = await axios.get(pastUrl, {
            headers: { Authorization: clistApiKey }
        });
        const pastData = pastResponse.data.objects || [];

        // Combine upcoming and past contests
        const contestsData = [...upcomingData, ...pastData];

        // Upsert all contests concurrently
        const upsertPromises = contestsData.map(async (c) => {
            const contestId = c.id.toString();
            const name = c.event;
            const startTime = new Date(c.start);
            const endTime = new Date(c.end);
            const duration = c.duration;
            const link = c.href;

            try {
                await Contest.findOneAndUpdate(
                    { platform, contestId },
                    {
                        platform,
                        contestId,
                        name,
                        startTime,
                        endTime,
                        duration,
                        url: link,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.error(`Error upserting ${platform} contest:`, err);
            }
        });

        await Promise.all(upsertPromises);
    } catch (error) {
        console.error(`Error fetching ${platform} contests from clist:`, error);
    }
}


async function fetchCodeforcesContests() {
    try {
        const response = await axios.get(codeforcesApiUrl);
        if (response.data.status === "OK") {
            const contests = response.data.result;

            // Filter upcoming contests
            const upcoming = contests.filter(
                (c) => c.phase === "BEFORE" || c.phase === "CODING"
            );

            // Filter past contests: sort finished contests by start time descending and take 5
            const finished = contests
                .filter((c) => c.phase === "FINISHED")
                .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
                .slice(0, 5);

            // Combine both upcoming and past contests
            const combinedContests = [...upcoming, ...finished];

            // Upsert all contests concurrently
            const upsertPromises = combinedContests.map(async (c) => {
                const contestId = c.id.toString();
                const name = c.name;
                const startTime = new Date(c.startTimeSeconds * 1000);
                const duration = c.durationSeconds;
                const endTime = new Date(startTime.getTime() + duration * 1000);
                const url = `https://codeforces.com/contest/${c.id}`;

                try {
                    await Contest.findOneAndUpdate(
                        { platform: "CodeForces", contestId },
                        {
                            platform: "CodeForces",
                            contestId,
                            name,
                            startTime,
                            endTime,
                            duration,
                            url,
                            lastUpdated: new Date()
                        },
                        { upsert: true, new: true }
                    );
                } catch (err) {
                    console.error("Error upserting CodeForces contest:", err);
                }
            });

            await Promise.all(upsertPromises);
        }
    } catch (error) {
        console.error("Error fetching CodeForces contests:", error);
    }
}


module.exports = {
    fetchClistContests,
    fetchCodeforcesContests
};
