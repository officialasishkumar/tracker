const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contest.controller");
const verifyToken = require("../middleware/auth.middleware");


router.get("/manual-fetch", async (req, res) => {
    try {
        // Import fetch functions from your services
        const { fetchClistContests, fetchCodeforcesContests } = require("../services/fetchContests");
        const { fetchYouTubeSolutions } = require("../services/fetchYouTube");

        // Fetch contests from different platforms manually
        await fetchClistContests("LeetCode");
        await fetchClistContests("CodeChef");
        await fetchCodeforcesContests();

        // Fetch and update YouTube solutions
        await fetchYouTubeSolutions();

        return res.status(200).json({ message: "Manual fetch completed successfully." });
    } catch (error) {
        console.error("Error during manual fetch:", error);
        return res.status(500).json({ message: "Internal server error during manual fetch." });
    }
});


// GET /api/contests
router.get("/", contestController.getAllContests);

// GET /api/contests/:id
router.get("/:id", contestController.getContestById);

// POST /api/contests/:id/bookmark (requires auth)
router.post("/:id/bookmark", verifyToken, contestController.bookmarkContest);

// DELETE /api/contests/:id/bookmark (requires auth)
router.delete("/:id/bookmark", verifyToken, contestController.removeBookmark);



module.exports = router;
