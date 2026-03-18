from fastapi import APIRouter

from config import settings


router = APIRouter()


@router.get("/health")
async def health():
    """Report basic metadata about the running LLM deployment."""
    return {
        "status": "ok",
        "llm_engine": settings.llm_engine,
        "model": settings.llm_model,
        "device": settings.device_name,
        "latency_ms": settings.latency_ms,
        "fps": settings.fps,
    }
