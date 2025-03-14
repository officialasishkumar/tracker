const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
    platform: { type: String, required: true },  // e.g. "LeetCode", "CodeChef", "CodeForces"
    contestId: { type: String, required: true }, // Unique ID from the platform
    name: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
    url: { type: String },
    solution: { type: String, default: "" },
    lastUpdated: { type: Date, default: Date.now }
});

// Ensure (platform + contestId) is unique
contestSchema.index({ platform: 1, contestId: 1 }, { unique: true });

module.exports = mongoose.model("Contest", contestSchema);
