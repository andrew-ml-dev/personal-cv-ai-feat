// ─────────────────────────────────────────────────────────────────────────────
// Environment variables (Vite: only VITE_* are exposed to client code).
// Defaults match the previous hardcoded portfolio values.
// ─────────────────────────────────────────────────────────────────────────────

const raw = import.meta.env

export function envString(key, fallback = '') {
  const v = raw[key]
  if (v === undefined || v === null || v === '') return fallback
  return String(v)
}

export function envNumber(key, fallback) {
  const v = raw[key]
  if (v === undefined || v === null || v === '') return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export function envBool(key, fallback = false) {
  const v = raw[key]
  if (v === undefined || v === null || v === '') return fallback
  return v === 'true' || v === '1'
}

/**
 * Join API base (`/api`, `http://host:port`, or `http://host:port/api`) with path segments.
 */
export function joinApiPath(base, ...segments) {
  const parts = segments.flatMap((s) => String(s).split('/')).filter(Boolean)
  const path = parts.join('/')
  if (!base) return `/${path}`
  const b = String(base).replace(/\/$/, '')
  if (b.startsWith('http://') || b.startsWith('https://')) {
    return `${b}/${path}`
  }
  if (!b.startsWith('/')) {
    return `/${b}/${path}`
  }
  return `${b}/${path}`
}

// ——— API ——————————————————————————————————————————————————————————

/** Base URL or path for API (e.g. `/api` or `http://localhost:8000/api`). */
export const API_BASE = envString('VITE_BACKEND_URL', '/api')

/** Path segment(s) after base for chat SSE (default matches FastAPI `/api/chat`). */
export const CHAT_PATH = envString('VITE_CHAT_PATH', 'chat')

export const CHAT_API_URL = joinApiPath(API_BASE, CHAT_PATH)

/** Relative or absolute URL for stats polling (same-origin `/api/...` in most setups). */
export const API_STATS_PATH = envString('VITE_API_STATS_PATH', '/api/chat/stats')

export const STATS_POLL_INTERVAL_MS = envNumber('VITE_STATS_POLL_INTERVAL_MS', 500)

// ——— Diagram / RAG labels (Architecture widget + nav) ——————————————

export const DIAGRAM_POST_CHAT_LABEL = envString('VITE_DIAGRAM_POST_CHAT_LABEL', 'POST /api/chat')

export const DIAGRAM_RAG_EMBEDDING_MODEL = envString(
  'VITE_DIAGRAM_RAG_EMBEDDING_MODEL',
  'BAAI/bge-small-en-v1.5',
)

export const DIAGRAM_RAG_TOP_CHUNKS_LABEL = envString('VITE_DIAGRAM_RAG_TOP_CHUNKS_LABEL', 'top-4 chunks')

export const DIAGRAM_RAG_SUBTITLE = envString(
  'VITE_DIAGRAM_RAG_SUBTITLE',
  'fastembed + ChromaDB · cosine · top-4',
)

export const DIAGRAM_RAG_PHASE_TEXT = envString(
  'VITE_DIAGRAM_RAG_PHASE_TEXT',
  'Query → 384-dim embedding via fastembed → cosine search → top-4 CV sections retrieved from ChromaDB.',
)

export const DIAGRAM_LLM_SUBTITLE = envString(
  'VITE_DIAGRAM_LLM_SUBTITLE',
  'Llama-3.2-1B · GGUF · INT4 quant',
)

/** Comma-separated labels for the decorative chunk list in the diagram. */
export function ragChunkLabels() {
  const s = envString(
    'VITE_RAG_CHUNK_LABELS',
    'Work Experience,Tech Stack,ML Projects',
  )
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}
