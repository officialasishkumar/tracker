const axios = require("axios");
const Contest = require("../models/contest.model");

const youtubeApiKey = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId, platform) {

    console.log(`Fetching videos from ${platform} playlist...`);
    try {
        // Get the last 5 videos from the specified playlist
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=5&key=${youtubeApiKey}`;
        const response = await axios.get(url);
        const items = response.data.items || [];

        for (let item of items) {
            const title = item.snippet.title;  // e.g. "Leetcode Weekly Contest 439 | Video Solutions ..."
            const videoId = item.snippet.resourceId.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            console.log(title)

            if (title.toLowerCase().includes(platform.toLowerCase())) {
                if (platform.toLowerCase() === 'leetcode') {
                    // Use a regex to capture the contest number from the title
                    const regex = /weekly contest (\d+)/i;
                    const match = title.match(regex);
                    if (match) {
                        const contestNumber = match[1];
                        // Find contest by matching the contest name using the contest number
                        const contest = await Contest.findOne({
                            platform: 'LeetCode',
                            name: { $regex: `Weekly Contest\\s*${contestNumber}`, $options: 'i' }
                        });
                        if (contest) {
                            // Set the solution if not already set
                            if (!contest.solution) {
                                contest.solution = videoUrl;
                                await contest.save();
                            }
                        }
                    }
                } else {
                    const parts = title.split(" ");
                    let possibleId = parts[parts.length - 1].replace(/\D/g, "");

                    console.debug(possibleId)
                    if (possibleId) {
                        const contest = await Contest.findOne({ platform, contestId: possibleId });
                        if (contest) {
                            if (!contest.solution) {
                                contest.solution = videoUrl;
                                await contest.save();
                            }
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
