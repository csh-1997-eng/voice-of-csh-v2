import { NextRequest, NextResponse } from "next/server"
import { formatSupabaseFetchError, getServerSupabaseConfig } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? ""
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  const config = getServerSupabaseConfig()

  try {
    const res = await fetch(`${config.url}/rest/v1/consent_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({ ip_address: ip, user_agent: userAgent, consent_version: "v1", consented: true }),
    })

    if (!res.ok) return NextResponse.json({ error: "Failed to log consent" }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("/api/consent error:", formatSupabaseFetchError(error, config))
    return NextResponse.json({ error: "Failed to log consent" }, { status: 500 })
  }
}
