import type { Metadata } from "next"
import TweetsWidget from "@/components/x-feed"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `X Feed | ${siteConfig.shortName}`,
  description: "Live timeline and short-form commentary.",
}

export default function XFeedPage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="panel max-w-6xl mx-auto rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Live Stream</p>
        <h1 className="font-display mt-3 mb-8 text-5xl leading-none md:text-6xl">X Feed</h1>
        <div className="panel rounded-2xl p-4 md:p-6">
          <TweetsWidget />
        </div>
      </div>
    </div>
  )
}
