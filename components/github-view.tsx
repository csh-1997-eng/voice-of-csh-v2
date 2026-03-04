import Link from "next/link"
import { ExternalLink, GitBranch, Star } from "lucide-react"
import { siteConfig } from "@/lib/site"

type GitHubUser = {
  login: string
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

type GitHubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

function extractUsername(url: string) {
  return url.replace("https://github.com/", "").replace(/\/+$/, "")
}

async function fetchGitHubView(username: string) {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 900, tags: ["github-profile"] },
    }),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      next: { revalidate: 900, tags: ["github-profile"] },
    }),
  ])

  if (!userRes.ok || !reposRes.ok) {
    return { user: null, repos: [] as GitHubRepo[] }
  }

  const user = (await userRes.json()) as GitHubUser
  const repos = (await reposRes.json()) as GitHubRepo[]
  return { user, repos }
}

export default async function GitHubView() {
  const username = extractUsername(siteConfig.links.github)
  const { user, repos } = await fetchGitHubView(username)

  return (
    <div className="panel rounded-3xl p-6 md:p-8">
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl leading-none md:text-6xl">GitHub</h2>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C45A3C] hover:underline"
        >
          Open Profile <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {user ? (
        <>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-[#E8E5E0]/15 bg-[#111111]/70 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[#bfb7ad]">Repos</p>
              <p className="mt-1 text-xl text-[#E8E5E0]">{user.public_repos}</p>
            </div>
            <div className="rounded-xl border border-[#E8E5E0]/15 bg-[#111111]/70 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[#bfb7ad]">Followers</p>
              <p className="mt-1 text-xl text-[#E8E5E0]">{user.followers}</p>
            </div>
            <div className="rounded-xl border border-[#E8E5E0]/15 bg-[#111111]/70 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[#bfb7ad]">Following</p>
              <p className="mt-1 text-xl text-[#E8E5E0]">{user.following}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {repos.map((repo) => (
              <article key={repo.id} className="rounded-2xl border border-[#E8E5E0]/15 bg-[#111111]/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-medium text-[#E8E5E0]">{repo.name}</h3>
                  <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-[#C45A3C]">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
                <p className="mt-2 min-h-10 text-sm text-[#d2ccc3]">{repo.description || "No description yet."}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-[#bfb7ad]">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-[#C45A3C]" /> {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitBranch className="h-3.5 w-3.5 text-[#C45A3C]" /> {repo.forks_count}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <article className="mt-5 rounded-2xl border border-[#E8E5E0]/15 bg-[#111111]/70 p-5 text-sm text-[#d2ccc3]">
          GitHub data is not available right now. Open your profile directly to view repos.
        </article>
      )}
    </div>
  )
}
