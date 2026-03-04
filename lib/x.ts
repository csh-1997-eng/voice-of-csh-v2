import { Tweet } from "@/lib/data-types"

function parseCreatedAt(date: string | undefined) {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

type XUserResponse = {
  data?: { id: string; name: string; username: string }
}

type XTweetsResponse = {
  data?: Array<{
    id: string
    text: string
    created_at?: string
    public_metrics?: {
      like_count?: number
      retweet_count?: number
      reply_count?: number
    }
  }>
}

const X_API_BASES = ["https://api.x.com/2", "https://api.twitter.com/2"]
const X_CACHE_TTL_MS = 5 * 60 * 1000
const xTweetsCache = new Map<string, { expiresAt: number; data: Tweet[] }>()

function normalizeHandle(handle: string) {
  return handle.trim().replace(/^@+/, "")
}

function normalizeBearerToken(raw: string) {
  const token = raw.trim().replace(/^['"]|['"]$/g, "")
  // Some env setups accidentally store URL-encoded bearer token values.
  if (token.includes("%")) {
    try {
      return decodeURIComponent(token)
    } catch {
      return token
    }
  }
  return token
}

async function xFetch(path: string, token: string) {
  let lastError: Error | null = null

  for (const base of X_API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (res.ok) return res

      const body = await res.text().catch(() => "")
      lastError = new Error(`${base}${path} -> ${res.status}: ${body.slice(0, 300)}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  throw lastError ?? new Error("Unknown X API request failure")
}

export async function getLatestTweets(limit = 12): Promise<Tweet[]> {
  try {
    const rawBearer = process.env.TWITTER_BEARER_TOKEN
    const rawHandle =
      process.env.TWITTER_USERNAME || process.env.NEXT_PUBLIC_TWITTER_HANDLE || "lordcolton_exe"
    const handle = normalizeHandle(rawHandle)

    if (!rawBearer || !handle) {
      console.warn("X fetch skipped: TWITTER_BEARER_TOKEN or handle missing")
      return []
    }

    const bearer = normalizeBearerToken(rawBearer)
    const cacheKey = `${handle}:${limit}`
    const cached = xTweetsCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) return cached.data

    const userRes = await xFetch(`/users/by/username/${encodeURIComponent(handle)}`, bearer)

    const userJson = (await userRes.json()) as XUserResponse
    const user = userJson?.data
    if (!user?.id) return []

    const tweetsRes = await xFetch(
      `/users/${user.id}/tweets?exclude=retweets&max_results=${Math.min(
        100,
        Math.max(5, limit),
      )}&tweet.fields=created_at,public_metrics`,
      bearer,
    )

    const tweetsJson = (await tweetsRes.json()) as XTweetsResponse

    const mapped =
      tweetsJson.data?.slice(0, limit).map((tweet) => ({
        id: tweet.id,
        content: tweet.text,
        date: parseCreatedAt(tweet.created_at),
        likes: tweet.public_metrics?.like_count ?? 0,
        retweets: tweet.public_metrics?.retweet_count ?? 0,
        replies: tweet.public_metrics?.reply_count ?? 0,
        author: {
          name: user.name,
          handle: user.username,
          avatar: "/placeholder-user.jpg",
        },
        url: `https://x.com/${user.username}/status/${tweet.id}`,
      })) ?? []

    // Cache only successful payloads to reduce API usage without pinning failures.
    xTweetsCache.set(cacheKey, { expiresAt: Date.now() + X_CACHE_TTL_MS, data: mapped })
    return mapped
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("X getLatestTweets error:", message)
    throw new Error(message)
  }
}
