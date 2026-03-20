"""Vector store helpers backed by ChromaDB.

Public API:
  - index_text(text, source) -> int
  - search_chunks(query, top_k, max_distance) -> List[str]
  - get_collection_count() -> int
"""
from __future__ import annotations

import hashlib
import logging
import re
import time
import uuid
from functools import lru_cache
from typing import List

logger = logging.getLogger("vector_store")

@lru_cache(maxsize=1)
def get_embedding_model():
    """Lazy load and cache the embedding model."""
    from fastembed import TextEmbedding
    from config import settings
    model = TextEmbedding(settings.embedding_model)
    logger.info("Embedding model ready: %s", settings.embedding_model)
    return model


@lru_cache(maxsize=1)
def _get_collection():
    """Lazy load and cache the ChromaDB collection."""
    import chromadb
    from config import settings
    client = chromadb.PersistentClient(path=settings.chroma_path)
    collection = client.get_or_create_collection(
        name=settings.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )
    logger.info("ChromaDB '%s' ready (%d chunks)", settings.chroma_collection, collection.count())
    return collection


def get_collection_count() -> int:
    return _get_collection().count()


# ---------------------------------------------------------------------------
# Text normalization
# ---------------------------------------------------------------------------

_EMOJI_RE = re.compile(
    "["
    "\U0001F600-\U0001F64F"
    "\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF"
    "\U0001F1E0-\U0001F1FF"
    "\U00002700-\U000027BF"
    "\U0001F900-\U0001F9FF"
    "\U00002600-\U000026FF"
    "\U00002B50-\U00002B55"
    "\U0000200D"
    "\U0000FE0F"
    "]+",
    flags=re.UNICODE,
)
_MULTI_BLANK_RE = re.compile(r"\n{3,}")
_TRAILING_SPACE_RE = re.compile(r"[ \t]+$", re.MULTILINE)
_MD_LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]+\)")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_MD_SYNTAX_RE = re.compile(r"[*_`>~\\]")
_BULLET_RE = re.compile(r"^\s*[-*+]\s+", re.MULTILINE)
_HEADER_RE = re.compile(r"^#{1,6}\s+", re.MULTILINE)

MIN_CHUNK_CHARS = 60


def normalize_text(text: str) -> str:
    """Strip emojis, HTML tags, expand markdown links, normalize whitespace."""
    text = _EMOJI_RE.sub("", text)
    text = _HTML_TAG_RE.sub("", text)
    text = _MD_LINK_RE.sub(r"\1", text)
    text = _TRAILING_SPACE_RE.sub("", text)
    text = _MULTI_BLANK_RE.sub("\n\n", text)
    return text.strip()


def _to_embed(text: str) -> str:
    """Further strip markdown syntax for cleaner semantic embeddings.

    Documents stored in ChromaDB keep their original formatting;
    only the vectors are computed from this cleaned version.
    """
    text = _BULLET_RE.sub("", text)
    text = _HEADER_RE.sub("", text)
    text = _MD_SYNTAX_RE.sub("", text)
    return " ".join(text.split())


# ---------------------------------------------------------------------------
# Chunking
# ---------------------------------------------------------------------------
def chunk_markdown(text: str, max_chars: int = 600) -> List[str]:
    """Split text by paragraphs, accumulating up to max_chars.
    Tracks active headers for context propagation.
    Uses 'Smart Merge' to prevent dropping vital small sections (like Skills/Languages)
    by attaching them to the previous chunk instead of deleting them.
    """
    text = normalize_text(text)
    paragraphs = text.split("\n\n")

    chunks: List[str] = []
    current_chunk = ""
    active_header = ""
    seen: set[str] = set()

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # Check if paragraph is a header (e.g., ## Education)
        is_header = bool(re.match(r"^#{1,4}\s+", para))
        if is_header:
            active_header = para

        if not current_chunk:
            current_chunk = para
            continue

        # If it fits within the limit, append it
        if len(current_chunk) + len(para) + 2 <= max_chars:
            current_chunk += f"\n\n{para}"
        else:
            # It doesn't fit! Save the current chunk
            chunks.append(current_chunk)
            
            # Start a new chunk with proper header context
            if is_header:
                current_chunk = para
            else:
                current_chunk = f"{active_header}\n\n{para}" if active_header else para

    # SMART MERGE: Handle the leftover tail
    if current_chunk:
        # If the last chunk is too small (< 60 chars) and we have previous chunks,
        # merge it into the last chunk instead of keeping it isolated or dropping it.
        if len(current_chunk) < 60 and chunks:
            chunks[-1] += f"\n\n{current_chunk}"
        else:
            chunks.append(current_chunk)

    # Deduplicate by hash (no data dropping anymore!)
    result: List[str] = []
    for c in chunks:
        digest = hashlib.sha256(c.encode()).hexdigest()
        if digest in seen:
            continue
        seen.add(digest)
        result.append(c)

    # ---------------------------------------------------------
    # DEBUG LOGGING: Print all generated chunks
    # ---------------------------------------------------------
    logger.info("\n" + "="*60)
    logger.info("📦 CHUNKING DEBUG: Created %d chunks", len(result))
    logger.info("="*60)
    for i, c in enumerate(result):
        logger.info(
            "\n[Chunk %d] Length: %d chars\n"
            "%s\n"
            "%s",
            i + 1, 
            len(c), 
            c.strip(),
            "-"*60
        )
        
    return result

def _snippet(chunk: str, max_len: int = 160) -> str:
    s = " ".join(chunk.split())
    return s if len(s) <= max_len else s[: max_len - 3].rstrip() + "..."


# ---------------------------------------------------------------------------
# Indexing
# ---------------------------------------------------------------------------

def index_text(text: str, source: str = "cv") -> int:
    """Chunk, normalize, embed and upsert into ChromaDB. Idempotent per source."""
    collection = _get_collection()
    model = get_embedding_model()
    chunks = chunk_markdown(text)
    
    if not chunks:
        logger.warning("index_text: no chunks (source=%s)", source)
        return 0
        
    try:
        existing = collection.get(where={"source": source})
        if existing["ids"]:
            collection.delete(ids=existing["ids"])
            logger.info("Deleted %d stale chunks (source=%s)", len(existing["ids"]), source)
    except Exception as exc:
        logger.warning("Could not delete old chunks (source=%s): %s", source, exc)
        
    embed_texts = [_to_embed(c) for c in chunks]
    embeddings = list(model.embed(embed_texts))
    
    collection.add(
        ids=[str(uuid.uuid4()) for _ in chunks],
        embeddings=[emb.tolist() for emb in embeddings],
        documents=chunks,
        metadatas=[{"source": source, "chunk_index": i} for i in range(len(chunks))],
    )
    logger.info("Indexed %d chunks (source=%s)", len(chunks), source)
    return len(chunks)


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

def search_chunks(query: str, top_k: int = 8, max_distance: float = 0.5) -> List[str]:
    """Return top_k most relevant chunks for query, filtering out poor matches.
    Includes detailed debug logging for retrieved chunks.
    """
    collection = _get_collection()
    total = collection.count()
    if total == 0:
        logger.warning("Vector store is empty")
        return []
        
    model = get_embedding_model()
    query_emb = next(iter(model.embed([_to_embed(normalize_text(query))])))
    
    start = time.monotonic()
    results = collection.query(
        query_embeddings=[query_emb.tolist()],
        n_results=min(top_k, total),
    )
    
    documents = results.get("documents", [[]])[0]
    if not documents:
        logger.warning("search_chunks: no results for query=%r", query)
        return []
        
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    
    valid_documents = []
    summary = []
    
    # ---------------------------------------------------------
    # DEBUG LOGGING: Header
    # ---------------------------------------------------------
    logger.info("\n" + "="*60)
    logger.info("🔍 RAG SEARCH DEBUG: '%s'", query)
    logger.info("="*60)
    
    # Filter results by distance threshold and print full chunks
    for i, chunk in enumerate(documents):
        dist = distances[i] if i < len(distances) else 1.0
        meta = metadatas[i] if i < len(metadatas) else {}
        
        # Lower distance is better (cosine space in Chroma: 1 - cosine_similarity)
        passed = dist <= max_distance
        status_icon = "✅ PASSED" if passed else "❌ REJECTED"
        
        # ---------------------------------------------------------
        # DEBUG LOGGING: Chunk Details
        # ---------------------------------------------------------
        logger.info(
            "\n[%d] %s | Distance: %.4f | Source: %s#%s\n"
            "%s\n"
            "%s",
            i + 1, 
            status_icon, 
            dist, 
            meta.get('source', '?'), 
            meta.get('chunk_index', '?'),
            chunk.strip(),
            "-"*60
        )
        
        if passed:
            valid_documents.append(chunk)
            summary.append(f"[{meta.get('source','?')}#{meta.get('chunk_index','?')} dist={dist:.4f}] {_snippet(chunk)}")

    logger.info(
        "search_chunks(%r) %.3fs — %d/%d passed threshold: %s\n", 
        query, time.monotonic() - start, len(valid_documents), len(documents), " | ".join(summary)
    )
    
    return valid_documents