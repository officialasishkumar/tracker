const cron = require("node-cron");
const { fetchClistContests, fetchCodeforcesContests } = require("./fetchContests");
const { fetchYouTubeSolutions } = require("./fetchYouTube");

function initCronJobs() {
    // Runs every 14 hours: 0 */14 * * *
    cron.schedule("0 */14 * * *", async () => {
        console.log("Cron job started: Fetching contests & updating solutions...");

        // 1. Fetch LeetCode & CodeChef from clist
        await fetchClistContests("LeetCode");
        await fetchClistContests("CodeChef");

        // 2. Fetch CodeForces contests
        await fetchCodeforcesContests();

        // 3. Fetch and update YouTube solutions
        await fetchYouTubeSolutions();

        console.log("Cron job finished.");
    });
}

module.exports = {
    initCronJobs
};
