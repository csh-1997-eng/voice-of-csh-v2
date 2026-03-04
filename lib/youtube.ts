// lib/youtube.ts
import { Video } from "@/lib/data-types";

function mapSearchItemsToVideos(items: any[] = []): Video[] {
  return items
    .map((item: any) => {
      const s = item?.snippet
      const id = item?.id?.videoId || s?.resourceId?.videoId
      if (!id || !s) return null

      return {
        id,
        title: s.title,
        description: s.description,
        date: s.publishedAt,
        thumbnail: s.thumbnails?.medium?.url || s.thumbnails?.high?.url || "/placeholder.svg",
        url: `https://www.youtube.com/watch?v=${id}`,
      } satisfies Video
    })
    .filter(Boolean) as Video[]
}

export async function getLatestVideos(limit = 5): Promise<Video[]> {
  try {
    const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } =
      process.env as Record<string, string>;

    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      throw new Error("Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID");
    }

    /* ---------- 1. uploads playlist ID ---------- */
    const chanRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!chanRes.ok) {
      const body = await chanRes.json().catch(() => ({}));
      throw new Error(
        `channel lookup ${chanRes.status} – ${body.error?.errors?.[0]?.reason ?? "unknown"}`
      );
    }

    const chan = await chanRes.json();
    const uploads =
      chan?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploads) {
      console.warn("YouTube channel has no uploads playlist");
      return [];
    }

    /* ---------- 2. playlist items ---------- */
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=${limit}&key=${YOUTUBE_API_KEY}`
    );

    if (!plRes.ok) {
      const body = await plRes.json().catch(() => ({}));
      const reason = body.error?.errors?.[0]?.reason ?? "unknown"

      // Some channels return stale/invalid uploads playlist IDs. Fall back to channel search.
      if (plRes.status === 404 && reason === "playlistNotFound") {
        const fallbackRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&order=date&maxResults=${limit}&type=video&key=${YOUTUBE_API_KEY}`
        )

        if (!fallbackRes.ok) {
          const fallbackBody = await fallbackRes.json().catch(() => ({}))
          throw new Error(
            `search fallback ${fallbackRes.status} – ${fallbackBody.error?.errors?.[0]?.reason ?? "unknown"}`
          )
        }

        const fallbackJson = await fallbackRes.json()
        return mapSearchItemsToVideos(fallbackJson?.items)
      }

      throw new Error(`playlistItems ${plRes.status} – ${reason}`);
    }

    const pl = await plRes.json();

    return mapSearchItemsToVideos(pl?.items);
  } catch (err) {
    // One central place to log; UI will show "No videos yet" because we return []
    console.error("YouTube getLatestVideos error:", err);
    return [];
  }
}
