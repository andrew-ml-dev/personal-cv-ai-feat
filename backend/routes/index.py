from __future__ import annotations

import logging
from typing import Optional

import httpx
from fastapi import APIRouter, File, Header, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from config import settings
from helper.qdrant import index_text

router = APIRouter()
logger = logging.getLogger("index_service")


# ---------------------------------------------------------------------------
# Auth helper
# ---------------------------------------------------------------------------

def _require_api_key(x_api_key: Optional[str]) -> None:
    if settings.index_api_key and x_api_key != settings.index_api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing X-Api-Key header.")


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

class IndexURLRequest(BaseModel):
    url: str
    source: str = "cv"


@router.post("/index/url")
async def index_from_url(
    req: IndexURLRequest,
    x_api_key: Optional[str] = Header(None),
):
    """Fetch a text / Markdown document from *url* and index it into Qdrant."""
    _require_api_key(x_api_key)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(req.url)
            response.raise_for_status()
            text = response.text
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to fetch URL: {exc}")

    count = await run_in_threadpool(index_text, text, req.source)
    logger.info("Indexed %d chunks from URL %s (source=%s)", count, req.url, req.source)
    return {"status": "ok", "chunks_indexed": count, "source": req.source}


@router.post("/index/file")
async def index_from_file(
    file: UploadFile = File(...),
    source: str = "cv",
    x_api_key: Optional[str] = Header(None),
):
    """Upload a UTF-8 text / Markdown file and index it into Qdrant."""
    _require_api_key(x_api_key)

    raw = await file.read()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be UTF-8 encoded text.")

    count = await run_in_threadpool(index_text, text, source)
    logger.info("Indexed %d chunks from uploaded file '%s' (source=%s)", count, file.filename, source)
    return {"status": "ok", "chunks_indexed": count, "source": source}


@router.get("/index/status")
async def index_status(x_api_key: Optional[str] = Header(None)):
    """Return basic info about the ChromaDB collection."""
    _require_api_key(x_api_key)

    from helper.qdrant import get_collection_count

    try:
        count = await run_in_threadpool(get_collection_count)
        return {
            "collection": settings.chroma_collection,
            "points_count": count,
        }
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Vector store unavailable: {exc}")
