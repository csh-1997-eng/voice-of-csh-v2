import { type NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if needed
    const signature = request.headers.get("x-webhook-signature")
    const webhookSecret = process.env.BLOG_WEBHOOK_SECRET

    if (webhookSecret && signature) {
      // Verify the webhook signature here
      // Implementation depends on your blog platform
    }

    // Revalidate blog posts cache
    revalidateTag("blog-posts")

    return NextResponse.json({
      message: "Substack content refreshed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing blog webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
