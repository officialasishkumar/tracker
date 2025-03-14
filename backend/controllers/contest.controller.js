const Contest = require("../models/contest.model");
const User = require("../models/user.model");

exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({});
        return res.status(200).json(contests);
    } catch (error) {
        console.error("Error fetching contests:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.getContestById = async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found." });
        }
        return res.status(200).json(contest);
    } catch (error) {
        console.error("Error fetching contest:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.bookmarkContest = async (req, res) => {
    try {
        const { id } = req.params; // contest _id in MongoDB
        const userId = req.user.userId; // from JWT

        // Ensure the contest exists
        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found." });
        }

        // Add contest to user's bookmarks if not already present
        const user = await User.findById(userId);
        if (!user.bookmarks.includes(id)) {
            user.bookmarks.push(id);
            await user.save();
        }

        return res.status(200).json({ message: "Contest bookmarked successfully." });
    } catch (error) {
        console.error("Error bookmarking contest:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.removeBookmark = async (req, res) => {
    try {
        const { id } = req.params; // contest _id in MongoDB
        const userId = req.user.userId; // from JWT

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Remove contest from user's bookmarks if present
        user.bookmarks = user.bookmarks.filter(
            (bookmarkId) => bookmarkId.toString() !== id
        );
        await user.save();

        return res.status(200).json({ message: "Bookmark removed successfully." });
    } catch (error) {
        console.error("Error removing bookmark:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
