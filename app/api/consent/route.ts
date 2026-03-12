import { NextRequest, NextResponse } from "next/server"

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY!

export async function POST(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? ""
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  const res = await fetch(`${SUPABASE_URL}/rest/v1/consent_logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
    },
    body: JSON.stringify({ ip_address: ip, user_agent: userAgent, consent_version: "v1", consented: true }),
  })

  if (!res.ok) return NextResponse.json({ error: "Failed to log consent" }, { status: 500 })
  return NextResponse.json({ ok: true })
}
