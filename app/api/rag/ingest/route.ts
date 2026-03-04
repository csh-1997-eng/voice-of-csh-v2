import { NextResponse } from "next/server"
import { ingestRagDocument } from "@/lib/rag"

type IngestDocInput = {
  externalId: string
  title: string
  source: string
  content: string
  metadata?: Record<string, unknown>
}

type IngestRequest =
  | IngestDocInput
  | {
      documents: IngestDocInput[]
    }

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
}

function validateDoc(input: Partial<IngestDocInput>) {
  if (!input.externalId?.trim()) return "externalId is required."
  if (!input.title?.trim()) return "title is required."
  if (!input.source?.trim()) return "source is required."
  if (!input.content?.trim()) return "content is required."
  return null
}

function getApiKeyFromRequest(req: Request) {
  const h = req.headers.get("x-api-key") || req.headers.get("authorization")
  if (!h) return null
  if (h.toLowerCase().startsWith("bearer ")) return h.slice(7).trim()
  return h.trim()
}

export async function POST(req: Request) {
  try {
    const expected = process.env.RAG_INGEST_API_KEY
    if (!expected) {
      return NextResponse.json(
        { error: "RAG ingest is not configured. Set RAG_INGEST_API_KEY." },
        { status: 500 },
      )
    }

    const provided = getApiKeyFromRequest(req)
    if (!provided || provided !== expected) return unauthorized()

    const body = (await req.json()) as IngestRequest
    const docs = "documents" in body ? body.documents : [body]
    if (!Array.isArray(docs) || docs.length === 0) {
      return NextResponse.json({ error: "No documents provided." }, { status: 400 })
    }

    const errors: string[] = []
    const results: Array<{ externalId: string; documentId: string; chunksInserted: number }> = []
    for (const doc of docs) {
      const validation = validateDoc(doc)
      if (validation) {
        errors.push(`${doc.externalId || "unknown"}: ${validation}`)
        continue
      }

      const ingest = await ingestRagDocument({
        externalId: doc.externalId.trim(),
        title: doc.title.trim(),
        source: doc.source.trim(),
        content: doc.content,
        metadata: doc.metadata ?? {},
      })

      results.push({
        externalId: doc.externalId.trim(),
        documentId: ingest.documentId,
        chunksInserted: ingest.chunksInserted,
      })
    }

    return NextResponse.json({
      ok: true,
      ingested: results.length,
      results,
      errors,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to ingest document."
    console.error("/api/rag/ingest error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
