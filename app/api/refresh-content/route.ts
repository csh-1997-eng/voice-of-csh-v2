import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

export async function POST(req: Request) {
  const secret = req.headers.get("x-refresh-secret")
  if (!secret || secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Revalidate tagged content caches
    revalidateTag("blog-posts")
    revalidateTag("youtube-videos")
    revalidateTag("x-posts")

    return NextResponse.json({
      message: "Content refreshed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error refreshing content:", error)
    return NextResponse.json({ error: "Failed to refresh content" }, { status: 500 })
  }
}
