const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contest.controller");

// Manual fetch route remains unchanged
router.get("/manual-fetch", async (req, res) => {
    try {
        const { fetchClistContests, fetchCodeforcesContests } = require("../services/fetchContests");
        const { fetchYouTubeSolutions } = require("../services/fetchYouTube");

        await fetchClistContests("LeetCode");
        await fetchClistContests("CodeChef");
        await fetchCodeforcesContests();
        await fetchYouTubeSolutions();

        return res.status(200).json({ message: "Manual fetch completed successfully." });
    } catch (error) {
        console.error("Error during manual fetch:", error);
        return res.status(500).json({ message: "Internal server error during manual fetch." });
    }
});

// New endpoints for upcoming and past contests
router.get("/upcoming", contestController.getUpcomingContests);
router.get("/past", contestController.getPastContests);
router.get("/solutions", contestController.getContestsWithSolution);
router.get("/all", contestController.getAllContests);

router.post("/solution", contestController.updateContestSolution);
router.post("/contest", contestController.getContestById);

module.exports = router;
