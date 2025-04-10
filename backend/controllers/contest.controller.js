const Contest = require("../models/contest.model");

// upcoming contests (endTime is in the future)
exports.getUpcomingContests = async (req, res) => {
    try {
        const now = new Date();
        const contests = await Contest.find({ endTime: { $gte: now } }).sort({ startTime: 1 });
        return res.status(200).json(contests);
    } catch (error) {
        console.error("Error fetching upcoming contests:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// past contests (endTime is in the past)
exports.getPastContests = async (req, res) => {
    try {
        const now = new Date();
        const contests = await Contest.find({ endTime: { $lt: now } }).sort({ startTime: -1 });
        return res.status(200).json(contests);
    } catch (error) {
        console.error("Error fetching past contests:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Updated endpoint: Get contest by id (now retrieves id from request body)
exports.getContestById = async (req, res) => {
    try {
        const { id } = req.body;
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

exports.getContestsWithSolution = async (req, res) => {
    try {
        const contests = await Contest.find({ solution: { $ne: "" } });
        return res.status(200).json(contests);
    } catch (error) {
        console.error("Error fetching contests with solutions:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.updateContestSolution = async (req, res) => {
    try {
        const { id, solution } = req.body;

        if (!solution) {
            return res.status(400).json({ message: "Solution URL is required." });
        }

        // Update the contest solution and lastUpdated timestamp
        const contest = await Contest.findByIdAndUpdate(
            id,
            { solution, lastUpdated: new Date() },
            { new: true }
        );

        if (!contest) {
            return res.status(404).json({ message: "Contest not found." });
        }

        return res.status(200).json(contest);
    } catch (error) {
        console.error("Error updating contest solution:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({});
        return res.status(200).json(contests);
    } catch (error) {
        console.error("Error fetching all contests:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
