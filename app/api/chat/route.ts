import { NextResponse } from "next/server"
import { retrieveRagChunks, type RagChunk } from "@/lib/rag"

type ChatRequest = {
  threadId?: string
  message?: string
}

type AnthropicsContentBlock = { type: "text"; text: string }
type AnthropicResponse = {
  content?: AnthropicsContentBlock[]
}

const DEFAULT_ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022"
const RAG_MATCH_COUNT = Number(process.env.RAG_MATCH_COUNT || 6)
const RAG_MIN_SIMILARITY = Number(process.env.RAG_MIN_SIMILARITY || 0)

function buildContextPrompt(chunks: RagChunk[]) {
  if (chunks.length === 0) return "No retrieved context was returned from the vector database."

  return chunks
    .map((c, i) => {
      const title = c.title ? ` (${c.title})` : ""
      return `[${i + 1}] ${c.source}${title}\n${c.content}`
    })
    .join("\n\n")
}

async function generateWithAnthropic(message: string, contextChunks: RagChunk[]) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("Anthropic is not configured. Add ANTHROPIC_API_KEY.")

  const contextPrompt = buildContextPrompt(contextChunks)
  const system = [
    "You are Voice of Cole's assistant.",
    "Use the retrieved context first when relevant.",
    "If context is insufficient, say that clearly and answer from general knowledge cautiously.",
    "Be concise, concrete, and useful.",
  ].join(" ")

  const userPrompt = [
    `User question:\n${message}`,
    "Retrieved context:",
    contextPrompt,
  ].join("\n\n")

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_ANTHROPIC_MODEL,
      max_tokens: 900,
      system,
      messages: [{ role: "user", content: userPrompt }],
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Anthropic request failed (${res.status}): ${body.slice(0, 300)}`)
  }

  const json = (await res.json()) as AnthropicResponse
  const text = json.content?.find((c) => c.type === "text")?.text?.trim()
  if (!text) throw new Error("Anthropic returned an empty response.")
  return text
}

export async function POST(req: Request) {
  // Service temporarily disabled
  return NextResponse.json({ error: "Chat service is currently unavailable." }, { status: 503 })

  // eslint-disable-next-line no-unreachable
  try {
    const body = (await req.json()) as ChatRequest
    const message = body.message?.trim()
    const threadId = body.threadId?.trim() || crypto.randomUUID()

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const ragChunks = await retrieveRagChunks(message, {
      matchCount: RAG_MATCH_COUNT,
      threshold: RAG_MIN_SIMILARITY,
    })
    const reply = await generateWithAnthropic(message, ragChunks)

    return NextResponse.json({
      threadId,
      reply,
      citations: ragChunks.map((c) => ({ source: c.source, title: c.title })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process chat request."
    console.error("/api/chat error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
