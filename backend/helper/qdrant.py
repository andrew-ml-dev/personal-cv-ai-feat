"""Vector store helpers backed by ChromaDB (embedded, no separate process).

Public API (unchanged from the original Qdrant-based version):
  - index_text(text, source) -> int
  - search_chunks(query, top_k) -> List[str]
  - get_collection_count() -> int
"""
from __future__ import annotations

import logging
import re
import time
import uuid
from typing import List

logger = logging.getLogger("vector_store")

# ---------------------------------------------------------------------------
# Lazy singletons
# ---------------------------------------------------------------------------

_embedding_model = None
_collection = None


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from fastembed import TextEmbedding
        from config import settings
        logger.info("Loading fastembed model: %s", settings.embedding_model)
        _embedding_model = TextEmbedding(settings.embedding_model)
        logger.info("Embedding model ready.")
    return _embedding_model


def _get_collection():
    global _collection
    if _collection is None:
        import chromadb
        from config import settings
        client = chromadb.PersistentClient(path=settings.chroma_path)
        _collection = client.get_or_create_collection(
            name=settings.chroma_collection,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info(
            "ChromaDB collection '%s' ready at '%s' (%d existing chunks)",
            settings.chroma_collection,
            settings.chroma_path,
            _collection.count(),
        )
    return _collection


# ---------------------------------------------------------------------------
# Public helper
# ---------------------------------------------------------------------------

def get_collection_count() -> int:
    return _get_collection().count()


# ---------------------------------------------------------------------------
# Chunking
# ---------------------------------------------------------------------------

def chunk_markdown(text: str, max_chars: int = 1500) -> List[str]:
    """Split markdown by headers; sub-split oversized sections by paragraphs."""
    sections = re.split(r"\n(?=#{1,3} )", text.strip())
    chunks: List[str] = []
    for section in sections:
        section = section.strip()
        if not section:
            continue
        if len(section) <= max_chars:
            chunks.append(section)
        else:
            paragraphs = section.split("\n\n")
            current = ""
            for para in paragraphs:
                if len(current) + len(para) + 2 <= max_chars:
                    current = (current + "\n\n" + para).strip()
                else:
                    if current:
                        chunks.append(current)
                    current = para.strip()
            if current:
                chunks.append(current)
    return [c for c in chunks if c.strip()]

def _format_snippet(chunk: str, max_len: int = 160) -> str:
    """Prepare a single-line, trimmed preview for logging."""
    one_line = " ".join(chunk.split())
    if len(one_line) <= max_len:
        return one_line
    return one_line[: max_len - 3].rstrip() + "..."



# ---------------------------------------------------------------------------
# Indexing  (synchronous — call via run_in_threadpool from async context)
# ---------------------------------------------------------------------------

def index_text(text: str, source: str = "cv") -> int:
    """Chunk *text*, embed each chunk, and upsert into ChromaDB.

    Existing points for the same *source* are deleted first so re-indexing
    is always idempotent.  Returns the number of chunks stored.
    """
    collection = _get_collection()
    model = get_embedding_model()

    chunks = chunk_markdown(text)
    if not chunks:
        logger.warning("index_text: no chunks produced (source=%s)", source)
        return 0

    # Remove stale entries for this source
    try:
        existing = collection.get(where={"source": source})
        if existing["ids"]:
            collection.delete(ids=existing["ids"])
            logger.info("Deleted %d stale chunks (source=%s)", len(existing["ids"]), source)
    except Exception as exc:
        logger.warning("Could not delete old chunks (source=%s): %s", source, exc)

    embeddings = list(model.embed(chunks))
    ids = [str(uuid.uuid4()) for _ in chunks]

    collection.add(
        ids=ids,
        embeddings=[emb.tolist() for emb in embeddings],
        documents=chunks,
        metadatas=[{"source": source, "chunk_index": i} for i in range(len(chunks))],
    )

    logger.info("Indexed %d chunks (source=%s)", len(chunks), source)
    return len(chunks)


# ---------------------------------------------------------------------------
# Search  (synchronous — call via run_in_threadpool from async context)
# ---------------------------------------------------------------------------

def search_chunks(query: str, top_k: int = 4) -> List[str]:
    """Return the *top_k* most relevant text chunks for *query*."""
    collection = _get_collection()
    total = collection.count()
    if total == 0:
        logger.warning("Vector store is empty — returning no chunks")
        return []

    model = get_embedding_model()
    query_emb = next(iter(model.embed([query])))

    start = time.monotonic()
    results = collection.query(
        query_embeddings=[query_emb.tolist()],
        n_results=min(top_k, total),
    )
    duration = time.monotonic() - start
    documents = results.get("documents", [[]])[0]
    if not documents:
        logger.warning("search_chunks: no documents returned for query=%s", query)
        return []

    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    summary_items = []
    for idx, chunk in enumerate(documents):
        meta = metadatas[idx] if idx < len(metadatas) else {}
        distance = distances[idx] if idx < len(distances) else None
        source = meta.get("source", "unknown")
        chunk_index = meta.get("chunk_index", "?")
        prefix = f"[{source}#{chunk_index}]"
        snippet = _format_snippet(chunk)
        distance_part = f" dist={distance:.4f}" if distance is not None else ""
        summary_items.append(f"{prefix}{distance_part} {snippet}")

    logger.info(
        "search_chunks(%s) took %.3fs and selected %d chunks: %s",
        query,
        duration,
        len(summary_items),
        " | ".join(summary_items),
    )

    return documents
