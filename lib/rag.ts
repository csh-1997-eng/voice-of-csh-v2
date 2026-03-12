import { formatSupabaseFetchError, getServerSupabaseConfig } from "@/lib/supabase-server"

type RagDocumentInput = {
  externalId: string
  title: string
  source: string
  content: string
  metadata?: Record<string, unknown>
}

export type RagChunk = {
  id: string
  content: string
  source: string
  title?: string
  score?: number
}

const OPENAI_EMBEDDING_MODEL = process.env.RAG_EMBEDDING_MODEL || "text-embedding-3-small"
const DEFAULT_CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE || 1200)
const DEFAULT_CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP || 180)
const DEFAULT_MATCH_COUNT = Number(process.env.RAG_MATCH_COUNT || 6)
const DEFAULT_MATCH_THRESHOLD = Number(process.env.RAG_MIN_SIMILARITY || 0.2)

async function supabaseFetch(path: string, init?: RequestInit) {
  const config = getServerSupabaseConfig()
  const { url, key } = config
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  }

  // Supabase secret keys are validated by the API gateway via `apikey`.
  // Legacy JWT service_role keys still work in Authorization.
  if (!key.startsWith("sb_")) {
    headers.Authorization = `Bearer ${key}`
  }

  try {
    return await fetch(`${url}/rest/v1${path}`, {
      ...init,
      headers,
      cache: "no-store",
    })
  } catch (error) {
    throw new Error(formatSupabaseFetchError(error, config), {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

function chunkText(text: string, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_CHUNK_OVERLAP) {
  const clean = normalizeText(text)
  if (!clean) return []
  if (clean.length <= chunkSize) return [clean]

  const chunks: string[] = []
  let start = 0
  while (start < clean.length) {
    const end = Math.min(clean.length, start + chunkSize)
    const slice = clean.slice(start, end)
    chunks.push(slice)
    if (end === clean.length) break
    start = Math.max(0, end - overlap)
  }
  return chunks
}

async function createEmbedding(input: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OPENAI_API_KEY is required for embeddings.")

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input,
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Embedding request failed (${res.status}): ${body.slice(0, 300)}`)
  }

  const json = (await res.json()) as { data?: Array<{ embedding?: number[] }> }
  const embedding = json.data?.[0]?.embedding
  if (!embedding || !Array.isArray(embedding)) throw new Error("Embedding response was empty.")
  return embedding
}

async function upsertDocument(input: RagDocumentInput): Promise<string> {
  const payload = [
    {
      external_id: input.externalId,
      title: input.title,
      source: input.source,
      metadata: input.metadata ?? {},
    },
  ]

  const res = await supabaseFetch("/rag_documents?on_conflict=external_id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Document upsert failed (${res.status}): ${body.slice(0, 300)}`)
  }

  const rows = (await res.json().catch(() => [])) as Array<{ id?: string }>
  const id = rows?.[0]?.id
  if (!id) throw new Error("Document upsert returned no id.")
  return id
}

async function clearExistingChunks(documentId: string) {
  const res = await supabaseFetch(`/rag_chunks?document_id=eq.${encodeURIComponent(documentId)}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Failed clearing previous chunks (${res.status}): ${body.slice(0, 300)}`)
  }
}

async function insertChunkBatch(rows: Array<Record<string, unknown>>) {
  const res = await supabaseFetch("/rag_chunks", {
    method: "POST",
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Chunk insert failed (${res.status}): ${body.slice(0, 300)}`)
  }
}

export async function ingestRagDocument(input: RagDocumentInput) {
  const docId = await upsertDocument(input)
  await clearExistingChunks(docId)

  const chunks = chunkText(input.content)
  const rows: Array<Record<string, unknown>> = []
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await createEmbedding(chunks[i])
    rows.push({
      document_id: docId,
      chunk_index: i,
      content: chunks[i],
      embedding,
      metadata: {
        source: input.source,
        title: input.title,
      },
    })
  }

  const batchSize = 25
  for (let i = 0; i < rows.length; i += batchSize) {
    await insertChunkBatch(rows.slice(i, i + batchSize))
  }

  return {
    documentId: docId,
    chunksInserted: rows.length,
  }
}

function pickText(row: Record<string, unknown>) {
  const candidates = ["content", "text", "chunk", "body", "document", "page_content"]
  for (const key of candidates) {
    const value = row[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return ""
}

function pickSource(row: Record<string, unknown>) {
  const candidates = ["source", "url", "path", "origin", "document_id"]
  for (const key of candidates) {
    const value = row[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  const metadata = row.metadata
  if (metadata && typeof metadata === "object") {
    const s = (metadata as Record<string, unknown>).source
    if (typeof s === "string" && s.trim()) return s.trim()
  }
  return "knowledge-base"
}

function pickTitle(row: Record<string, unknown>) {
  const candidates = ["title", "name", "document_title"]
  for (const key of candidates) {
    const value = row[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  const metadata = row.metadata
  if (metadata && typeof metadata === "object") {
    const t = (metadata as Record<string, unknown>).title
    if (typeof t === "string" && t.trim()) return t.trim()
  }
  return undefined
}

function pickScore(row: Record<string, unknown>) {
  const candidates = ["similarity", "score", "distance"]
  for (const key of candidates) {
    const value = row[key]
    if (typeof value === "number") return value
  }
  return undefined
}

export async function retrieveRagChunks(query: string, opts?: { matchCount?: number; threshold?: number }) {
  const queryEmbedding = await createEmbedding(query)
  const payload = {
    query_embedding: queryEmbedding,
    match_count: opts?.matchCount ?? DEFAULT_MATCH_COUNT,
    match_threshold: opts?.threshold ?? DEFAULT_MATCH_THRESHOLD,
  }

  const res = await supabaseFetch("/rpc/match_documents", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`RAG retrieve failed (${res.status}): ${body.slice(0, 300)}`)
  }

  const data = (await res.json().catch(() => [])) as unknown
  const rows = Array.isArray(data) ? (data as Record<string, unknown>[]) : []

  return rows
    .map((row, i) => ({
      id: String(row.id ?? i),
      content: pickText(row),
      source: pickSource(row),
      title: pickTitle(row),
      score: pickScore(row),
    }))
    .filter((r) => r.content.length > 0)
}
