import Link from "next/link"
import { Heart, Repeat2, MessageCircle, ExternalLink } from "lucide-react"
import type { Tweet } from "@/lib/data-types"

export default async function TweetsWidget() {
  // Feed temporarily paused — re-enable by restoring the fetchTweetsResult() call below
  // const { tweets: allTweets, error } = await fetchTweetsResult()
  const tweets: Tweet[] = []

  if (tweets.length === 0) {
    const handle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "lordcolton_exe"
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="relative z-30 rounded-2xl border border-[#E8E5E0]/16 bg-[#0B0B0B] p-5 text-[#d2ccc3] md:col-span-2 xl:col-span-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[#C45A3C]">Coming Soon</p>
          <p className="mt-2 text-sm">Live X feed is on its way.</p>
          <Link
            href={`https://x.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C45A3C] hover:underline"
          >
            View profile on X <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </article>
        {[1, 2, 3, 4].map((slot) => (
          <article key={slot} className="relative z-30 rounded-2xl border border-[#E8E5E0]/14 bg-[#0B0B0B] p-4 text-[#bfb7ad]">
            <div className="mt-1 space-y-2">
              <div className="h-2.5 w-full rounded bg-[#E8E5E0]/10" />
              <div className="h-2.5 w-5/6 rounded bg-[#E8E5E0]/10" />
              <div className="h-2.5 w-4/6 rounded bg-[#E8E5E0]/10" />
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tweets.map((tweet, idx) => (
        <article
          key={tweet.id}
          className={`relative z-30 flex h-full flex-col rounded-2xl border border-[#E8E5E0]/14 bg-[#0B0B0B] p-4 md:p-5 ${idx % 3 === 0 ? "xl:row-span-2" : ""}`}
        >
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.15em] text-[#bfb7ad]">
            <span>@{tweet.author.handle}</span>
            <span>{tweet.date}</span>
          </div>
          <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-[#E8E5E0]">{tweet.content}</p>

          <div className="mt-4 flex items-center gap-4 text-xs text-[#bfb7ad]">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-[#C45A3C]" /> {tweet.likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <Repeat2 className="h-3.5 w-3.5 text-[#C45A3C]" /> {tweet.retweets}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5 text-[#C45A3C]" /> {tweet.replies}
            </span>
          </div>

          <Link
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C45A3C] hover:underline"
          >
            Open post <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </article>
      ))}
    </div>
  )
}
