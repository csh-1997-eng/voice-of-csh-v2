import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CalendarIcon, Clock } from "lucide-react"
import { safeFetch } from "@/lib/safe-fetch";
import { fetchBlogPosts } from "@/lib/api";
import type { Post } from "@/lib/data-types";

interface RecentBlogPostsProps {
  limit?: number
}

export default async function RecentBlogPosts({
  limit = 3,
}: RecentBlogPostsProps) {
  // graceful error handling via safeFetch
  const posts: Post[] = await safeFetch(fetchBlogPosts(limit));

  return (
    <div>
      {/* ---------- section header ---------- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-4xl leading-none">Recent Substack Content</h2>
        <Link
          href="/blog"
          className="text-sm text-[#C45A3C] hover:underline"
        >
          View all posts
        </Link>
      </div>

      {/* ---------- empty state ---------- */}
      {posts.length === 0 ? (
        <p className="italic text-muted-foreground">No posts available yet.</p>
      ) : (
        /* ---------- rich card grid ---------- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="border-[#E8E5E0]/15 bg-[#111111]/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <Link
                    href={post.url}
                    className="hover:underline"
                    target={post.url.startsWith("http") ? "_blank" : "_self"}
                  >
                    {post.title}
                  </Link>
                </CardTitle>

                <CardDescription className="flex items-center gap-3 text-xs text-[#d2ccc3]">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-[#d2ccc3]">
                  {post.excerpt}
                </p>
              </CardContent>

              <CardFooter>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-[#E8E5E0]/25 text-[#d2ccc3]"
                    >
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
