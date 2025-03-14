const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/auth.middleware");

// GET /api/user/bookmarks (requires auth)
router.get("/bookmarks", verifyToken, userController.getBookmarkedContests);

module.exports = router;
