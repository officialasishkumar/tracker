const User = require("../models/user.model");

exports.getBookmarkedContests = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Populate the "bookmarks" field to get full contest objects
        const user = await User.findById(userId).populate("bookmarks");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ bookmarks: user.bookmarks });
    } catch (error) {
        console.error("Error fetching bookmarked contests:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
