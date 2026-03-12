type ServerSupabaseConfig = {
  url: string
  key: string
  urlSource: "SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_URL"
}

function normalizeUrl(rawUrl: string) {
  return rawUrl.trim().replace(/\/+$/, "")
}

export function getServerSupabaseConfig(): ServerSupabaseConfig {
  const urlSource = process.env.SUPABASE_URL ? "SUPABASE_URL" : "NEXT_PUBLIC_SUPABASE_URL"
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!rawUrl || !key) {
    throw new Error(
      "Supabase is not configured for server access. Set SUPABASE_URL and SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY).",
    )
  }

  const url = normalizeUrl(rawUrl)

  try {
    new URL(url)
  } catch {
    throw new Error(`Invalid Supabase URL in ${urlSource}: ${url}`)
  }

  return { url, key, urlSource }
}

export function formatSupabaseFetchError(error: unknown, config: Pick<ServerSupabaseConfig, "url" | "urlSource">) {
  const host = new URL(config.url).host
  const fetchError = error as { cause?: { code?: string } }

  if (fetchError?.cause?.code === "ENOTFOUND") {
    return `Supabase hostname lookup failed for ${host}. Check ${config.urlSource} in your deployed environment.`
  }

  if (error instanceof Error) {
    return `Supabase request failed for ${host}: ${error.message}`
  }

  return `Supabase request failed for ${host}.`
}
