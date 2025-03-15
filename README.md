video: https://vimeo.com/1066185238/decb4826c4?share=copy

# Backend Docs

A Node.js backend service that aggregates and manages programming contest information from LeetCode, CodeChef, and CodeForces platforms, along with YouTube solution videos.

## Features

- Automatically fetches and updates contest information from multiple platforms
- Stores contest data in MongoDB
- Provides API endpoints for upcoming and past contests
- Links YouTube solution videos to contests
- Scheduled updates via cron jobs

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm run start
```

The application will be available at http://localhost:4000

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLIST_API_KEY=your_clist_api_key
YOUTUBE_API_KEY=your_youtube_api_key
LEETCODE_PLAYLIST_ID=youtube_playlist_id_for_leetcode_solutions
CODECHEF_PLAYLIST_ID=youtube_playlist_id_for_codechef_solutions
CODEFORCES_PLAYLIST_ID=youtube_playlist_id_for_codeforces_solutions
```

## Database Structure

The application uses a single MongoDB collection:

### Contest Model

```javascript
{
  platform: String,         // "LeetCode", "CodeChef", or "CodeForces"
  contestId: String,        // Unique ID from the platform
  name: String,             // Contest name
  startTime: Date,          // Start time of the contest
  endTime: Date,            // End time of the contest
  duration: Number,         // Duration in seconds
  url: String,              // Contest URL
  solution: String,         // YouTube solution URL
  lastUpdated: Date         // Timestamp of last update
}
```

A unique compound index is created on `{platform, contestId}`.

## API Endpoints

### Contest Routes

- `GET /api/contests/upcoming` - Get all upcoming contests
- `GET /api/contests/past` - Get all past contests
- `GET /api/contests/solutions` - Get contests with solution videos
- `GET /api/contests/all` - Get all contests
- `POST /api/contests/contest` - Get contest by ID (requires `id` in request body)
- `POST /api/contests/solution` - Update contest solution (requires `id` and `solution` in request body)
- `GET /api/contests/manual-fetch` - Manually trigger contest and solution updates

## Data Collection

### Automated Updates (Cron Jobs)

The application runs a scheduled job every 14 hours to:
1. Fetch LeetCode and CodeChef contests from Clist API
2. Fetch CodeForces contests directly from CodeForces API
3. Update YouTube solution links by scanning specified playlists

### Manual Updates

You can trigger immediate data updates by making a GET request to `/api/contests/manual-fetch`. This endpoint:
- Fetches latest contest information from all platforms
- Updates YouTube solution links
- Returns a success message when complete

## External APIs Used

- [Clist API](https://clist.by/) - For LeetCode and CodeChef contests
- [CodeForces API](https://codeforces.com/apiHelp) - For CodeForces contests
- [YouTube Data API](https://developers.google.com/youtube/v3) - For solution videos


# Frontend docs

## Tech Stack
- **Framework**: Next.js (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Fetch API

## Installation and Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at http://localhost:3000

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api/contests
```

## Core Features

### 1. Contest Tracking
- View upcoming contests with countdown timers
- Browse past contests
- Filter contests by platform (Codeforces, CodeChef, LeetCode)

### 2. Bookmarking System
- Bookmark contests for easy reference
- View all bookmarked contests in a dedicated tab

### 3. Solutions
- Access YouTube video solutions for past contests
- Add new solutions to contests (admin functionality)

## Bookmark Management

The bookmark system uses a combination of React Context and browser localStorage:

1. **Storage Format**: 
   - Bookmarks are stored as key-value pairs in localStorage
   - Key: Contest ID
   - Value: Expiration date (ISO string)

2. **Expiration Handling**:
   - Bookmarks automatically expire after 30 days
   - Invalid bookmarks are filtered out on application load

3. **Implementation Details**:
   - `BookmarksProvider` in `context/bookmarks-context.tsx` manages bookmark state
   - When a user toggles a bookmark:
     - If adding: Creates entry with 30-day expiration
     - If removing: Deletes entry from localStorage
   - On app initialization, expired bookmarks are automatically removed

4. **UI Integration**:
   - Heart icons in contest cards toggle bookmark status
   - Bookmarked tab shows only bookmarked contests

## Styling and Theming

- Support for light/dark mode via `next-themes`
- Custom animations using Framer Motion
- Platform-specific colors for visual identification
- Responsive design for mobile and desktop

## Main Pages

1. **Home Page**: 
   - Next contest countdown
   - Tabs for upcoming, past, and bookmarked contests
   - Platform filtering

2. **Solutions Page**:
   - View YouTube solutions for past contests
   - Add new solutions (admin functionality)
