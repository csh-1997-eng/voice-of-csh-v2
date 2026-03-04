import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CalendarIcon, Eye } from "lucide-react"
import { safeFetch } from "@/lib/safe-fetch";
import { fetchYoutubeVideos } from "@/lib/api";
import type { Video } from "@/lib/data-types";

interface RecentVideosProps {
  limit?: number;
}


export default async function RecentVideos({ limit = 5 }: RecentVideosProps) {
  const videos: Video[] = await safeFetch(fetchYoutubeVideos(limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-4xl leading-none">Latest YouTube Content</h2>
        <Link
          href="/youtube"
          className="text-sm text-[#C45A3C] hover:underline"
        >
          View all videos
        </Link>
      </div>

      {videos.length === 0 ? (
        <p className="italic text-muted-foreground">No videos available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden border-[#E8E5E0]/15 bg-[#111111]/70">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-[#0A0A0A]/85 text-[#E8E5E0] text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <Link
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {video.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-3 text-xs text-[#d2ccc3]">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {video.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#d2ccc3] line-clamp-2">
                  {video.description}
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-1">
                  {(video.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-[#E8E5E0]/25 text-[#d2ccc3]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
