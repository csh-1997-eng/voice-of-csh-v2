import type { Metadata } from "next"
import GitHubView from "@/components/github-view"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `GitHub | ${siteConfig.shortName}`,
  description: "Recent repositories, activity, and open-source footprint.",
}

export default function GitHubPage() {
  return (
    <div className="container py-10 md:py-14">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#C45A3C]">Code</p>
          <h1 className="font-display mt-3 text-5xl leading-none md:text-6xl">GitHub</h1>
        </div>
        <GitHubView />
      </div>
    </div>
  )
}
