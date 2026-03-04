import { unstable_cache } from "next/cache"
import { Post, Video, Tweet } from "@/lib/data-types"
import { parseSubstackFeed } from "@/lib/blog"
import { getLatestVideos } from "@/lib/youtube"
import { getLatestTweets } from "@/lib/x"
type TweetsFetchResult = { tweets: Tweet[]; error: string | null }

const getCachedBlogPosts = unstable_cache(
  async () => parseSubstackFeed(25),
  ["blog-posts-cache"],
  { revalidate: 300, tags: ["blog-posts"] },
)

const getCachedYoutubeVideos = unstable_cache(
  async () => getLatestVideos(25),
  ["youtube-videos-cache"],
  { revalidate: 300, tags: ["youtube-videos"] },
)

export async function fetchBlogPosts(limit = 25): Promise<Post[]> {
  const posts = await getCachedBlogPosts()
  return posts.slice(0, limit)
}

export async function fetchYoutubeVideos(limit = 25): Promise<Video[]> {
  const videos = await getCachedYoutubeVideos()
  return videos.slice(0, limit)
}

export async function fetchTweets(): Promise<Tweet[]> {
  return (await fetchTweetsResult()).tweets
}

export async function fetchTweetsResult(): Promise<TweetsFetchResult> {
  try {
    // Avoid caching empty/error states for X; this keeps feed recovery immediate after env/token fixes.
    const tweets = await getLatestTweets(25)
    return { tweets, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { tweets: [], error: message }
  }
}
