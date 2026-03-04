import type { Metadata } from "next"
import RecentVideos from "@/components/recent-videos"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `YouTube | ${siteConfig.shortName}`,
  description: "Latest videos, interviews, and short-form technical explainers.",
}

export default function YouTubePage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Video</p>
          <h1 className="font-display mt-3 text-5xl leading-none md:text-6xl">YouTube</h1>
        </div>
        <RecentVideos limit={10} />
      </div>
    </div>
  )
}
