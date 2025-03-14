const axios = require("axios");
const Contest = require("../models/contest.model");

const youtubeApiKey = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId, platform) {
    console.log(`Fetching videos from ${platform} playlist...`);
    try {
        // Get the last 20 videos from the specified playlist
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=20&key=${youtubeApiKey}`;
        const response = await axios.get(url);
        const items = response.data.items || [];

        for (let item of items) {
            const title = item.snippet.title;
            const videoId = item.snippet.resourceId.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            console.log(`Video Title: ${title}`);

            // LeetCode: use regex to extract the contest number as before.
            if (platform.toLowerCase() === "leetcode") {
                if (title.toLowerCase().includes(platform.toLowerCase())) {
                    const regex = /weekly contest (\d+)/i;
                    const match = title.match(regex);
                    if (match) {
                        const contestNumber = match[1];
                        const contest = await Contest.findOne({
                            platform: "LeetCode",
                            name: { $regex: `Weekly Contest\\s*${contestNumber}`, $options: "i" }
                        });
                        if (contest && !contest.solution) {
                            contest.solution = videoUrl;
                            await contest.save();
                            console.log(`Updated LeetCode contest "${contest.name}" with video ${videoUrl}`);
                        }
                    }
                }
            } else {
                // For CodeChef and CodeForces, extract the contest number from the title.
                let regex;
                if (platform.toLowerCase() === "codechef") {
                    // Example: "Codechef Starters 177 | Video Solutions ..." will capture "177"
                    regex = /starters\s+(\d+)/i;
                } else if (platform.toLowerCase() === "codeforces") {
                    // Remove bracketed content if any, then extract number after "round".
                    regex = /round\s+(\d+)/i;
                }
                if (regex) {
                    const match = title.match(regex);
                    if (match) {
                        const contestNumber = match[1];  // extracted as string
                        // Find contest where its name contains the extracted contest number as a whole word
                        const contest = await Contest.findOne({
                            platform,
                            name: { $regex: new RegExp("\\b" + contestNumber + "\\b", "i") }
                        });
                        if (contest && !contest.solution) {
                            contest.solution = videoUrl;
                            await contest.save();
                            console.log(`Updated ${platform} contest "${contest.name}" with video ${videoUrl}`);
                        }
                    } else {
                        console.debug(`No contest number extracted for title: "${title}"`);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching playlist videos for ${platform}:`, error);
    }
}

async function fetchYouTubeSolutions() {
    const leetcodePlaylistId = process.env.LEETCODE_PLAYLIST_ID;
    const codechefPlaylistId = process.env.CODECHEF_PLAYLIST_ID;
    const codeforcesPlaylistId = process.env.CODEFORCES_PLAYLIST_ID;

    // Fetch the last 10 videos from each playlist
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
