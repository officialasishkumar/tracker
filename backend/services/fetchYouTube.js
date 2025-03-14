const axios = require("axios");
const Contest = require("../models/contest.model");

const youtubeApiKey = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId, platform) {
    try {
        // Get the last 5 videos from the specified playlist
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=5&key=${youtubeApiKey}`;
        const response = await axios.get(url);
        const items = response.data.items || [];

        for (let item of items) {
            const title = item.snippet.title;                 // e.g. "LeetCode - Weekly Contest 335"
            const videoId = item.snippet.resourceId.videoId;  // YouTube video ID
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Check if the title mentions the correct platform
            if (title.toLowerCase().includes(platform.toLowerCase())) {
                // Naive approach: try to parse the last numeric token as the contestId
                const parts = title.split(" ");
                let possibleId = parts[parts.length - 1].replace(/\D/g, "");
                // possibleId might be "335" in "LeetCode - Weekly Contest 335"

                if (possibleId) {
                    // Attempt to find the contest in MongoDB by (platform, contestId)
                    const contest = await Contest.findOne({ platform, contestId: possibleId });
                    if (contest) {
                        // Add the video URL if it's not already in solutions
                        if (!contest.solutions.includes(videoUrl)) {
                            contest.solutions.push(videoUrl);
                            await contest.save();
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching playlist videos for ${platform}:`, error);
    }
}

async function fetchYouTubeSolutions() {
    // You can store playlist IDs in your .env
    const leetcodePlaylistId = process.env.LEETCODE_PLAYLIST_ID;
    const codechefPlaylistId = process.env.CODECHEF_PLAYLIST_ID;
    const codeforcesPlaylistId = process.env.CODEFORCES_PLAYLIST_ID;

    // Fetch the last 5 videos from each playlist
    if (leetcodePlaylistId) {
        await fetchPlaylistVideos(leetcodePlaylistId, "LeetCode");
    }
    if (codechefPlaylistId) {
        await fetchPlaylistVideos(codechefPlaylistId, "CodeChef");
    }
    if (codeforcesPlaylistId) {
        await fetchPlaylistVideos(codeforcesPlaylistId, "CodeForces");
    }
}

module.exports = {
    fetchYouTubeSolutions
};
