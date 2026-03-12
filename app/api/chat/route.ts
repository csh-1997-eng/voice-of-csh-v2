import { NextResponse } from "next/server"
import { retrieveRagChunks, type RagChunk } from "@/lib/rag"
import OpenAI from "openai"

type ChatRequest = {
  threadId?: string
  message?: string
}

const OPENAI_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-5-mini"
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

async function generateWithOpenAI(message: string, contextChunks: RagChunk[]) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const contextPrompt = buildContextPrompt(contextChunks)
  const system = [
    "You are Voice of Cole's assistant.",
    "Use the retrieved context first when relevant.",
    "If context is insufficient, say that clearly and answer from general knowledge cautiously.",
    "Be concise, concrete, and useful.",
  ].join(" ")

  const userPrompt = [`User question:\n${message}`, "Retrieved context:", contextPrompt].join("\n\n")

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: 900,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
  })

  const text = completion.choices[0]?.message?.content?.trim()
  if (!text) throw new Error("OpenAI returned an empty response.")
  return text
}

export async function POST(req: Request) {
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
    const reply = await generateWithOpenAI(message, ragChunks)

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
