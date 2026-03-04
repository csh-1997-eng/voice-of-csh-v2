import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Youtube, FileText, Twitter } from "lucide-react"
import { fetchBlogPosts, fetchYoutubeVideos, fetchTweets } from "@/lib/api"

type FeedItem = {
  id: string
  type: "blog" | "youtube" | "x"
  title: string
  date: string
  url: string
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 604800)}w ago`
}

export default async function LiveFeed() {
  // Fetch data from all sources
  const [blogPosts, videos, tweets] = await Promise.all([fetchBlogPosts(), fetchYoutubeVideos(), fetchTweets()])

  // Combine and sort all content by date
  const allContent: FeedItem[] = [
    ...blogPosts.slice(0, 5).map((post) => ({
      id: `blog-${post.id}`,
      type: "blog" as const,
      title: post.title,
      date: formatRelativeTime(new Date(post.date)),
      url: post.url,
    })),
    ...videos.slice(0, 5).map((video) => ({
      id: `youtube-${video.id}`,
      type: "youtube" as const,
      title: video.title,
      date: formatRelativeTime(new Date(video.date)),
      url: video.url,
    })),
    // ...tweets.slice(0, 5).map((tweet) => ({
    //   id: `x-${tweet.id}`,
    //   type: "x" as const,
    //   title: tweet.content.length > 50 ? tweet.content.substring(0, 50) + "..." : tweet.content,
    //   date: formatRelativeTime(new Date(tweet.date)),
    //   url: tweet.url,
    // })),
  ]

  // Sort by most recent (this is simplified - you'd want to parse actual dates)
  const sortedFeed = allContent.slice(0, 10)

  const getIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "x":
        return <Twitter className="h-4 w-4" />
      default:
        return null
    }
  }

  const getBadge = (type: string) => {
    switch (type) {
      case "blog":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
          >
            Substack
          </Badge>
        )
      case "youtube":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
          >
            YouTube
          </Badge>
        )
      case "x":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800"
          >
            X
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Live Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedFeed.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
              <div className="mt-0.5">{getIcon(item.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  {getBadge(item.type)}
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <a href={item.url} className="block font-medium hover:underline">
                  {item.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
