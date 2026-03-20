import json
import logging
import time
from typing import Dict, List, Optional

import httpx
import psutil
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from fastapi.concurrency import run_in_threadpool  # Added for synchronous DB helpers

from config import settings
from models.chat import ChatRequest
from helper.chat import get_session_id, get_user_history, save_to_history
from helper.chat import sanitize_output, is_safe_prompt, build_messages, get_cache_key, CACHE, fetch_resume_markdown
from helper.qdrant import search_chunks
from dependencies import limiter

router = APIRouter()

logger = logging.getLogger("chat_service")
logging.basicConfig(level=logging.INFO)

# ------------------------
# 🚀 GLOBAL HTTP CLIENT (Connection Pool)
# ------------------------
# Create it once to avoid handshake overhead per request
http_client = httpx.AsyncClient(timeout=settings.httpx_timeout_seconds)


STREAM_STATS: Dict[str, Optional[float]] = {
    "tokens_per_second": 0.0,
    "tokens_generated": 0,
    "generation_start": None,
    "active_session_id": None,
}

CONTEXT_STATS: Dict[str, object] = {
    "last_context_tokens": 0,
    "per_session": {},
}


def _approx_token_count(text: str) -> int:
    if not text:
        return 0
    return len(text.split())


def _context_token_count(messages: List[Dict[str, str]]) -> int:
    total = 0
    for message in messages:
        total += _approx_token_count(message.get("content", ""))
    return total


def _reset_stream_stats(session_id: Optional[str]) -> float:
    now = time.monotonic()
    STREAM_STATS.update(
        tokens_per_second=0.0,
        tokens_generated=0,
        generation_start=now,
        active_session_id=session_id,
    )
    return now


def _update_stream_stats(tokens_generated: int, start_time: float) -> None:
    elapsed = max(time.monotonic() - start_time, 1e-6)
    STREAM_STATS.update(
        tokens_generated=tokens_generated,
        tokens_per_second=tokens_generated / elapsed,
    )


# ------------------------
# 🔁 STREAMING
# ------------------------

async def stream_llama(messages, cache_key, session_id, use_history):
    full_response = ""

    payload = {
        "messages": messages,
        "temperature": settings.temperature,
        "stream": True,
        # Cap the response length (e.g., 250 tokens ~ 150-200 words).
        # Ideally move this into settings.max_tokens
        "max_tokens": 250, 
    }

    start_time = _reset_stream_stats(session_id)
    try:
        # Reuse the global client instead of opening a new one for every stream
        async with http_client.stream("POST", settings.llama_api_url, json=payload) as response:

            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue

                data_str = line[len("data: "):]

                if data_str.strip() == "[DONE]":
                    # cache the generated response
                    CACHE[cache_key] = full_response

                    # save the history asynchronously without blocking the event loop
                    if use_history and session_id:
                        await run_in_threadpool(save_to_history, session_id, "assistant", full_response)

                    STREAM_STATS["active_session_id"] = None
                    yield "data: [DONE]\n\n"
                    break

                try:
                    data_json = json.loads(data_str)
                    delta = data_json["choices"][0].get("delta", {})
                    content = delta.get("content", "")

                    if not content:
                        continue

                    full_response += content

                    tokens_generated = STREAM_STATS["tokens_generated"] + _approx_token_count(content)
                    _update_stream_stats(tokens_generated, start_time)

                    # Removed the 20-character buffer to emit the response immediately (better TTFT).
                    yield f"data: {sanitize_output(content)}\n\n"

                except json.JSONDecodeError:
                    continue

    except Exception as exc:
        STREAM_STATS["active_session_id"] = None
        logger.exception("LLM error")
        yield f"data: {json.dumps({'text': str(exc)})}\n\n"
        yield "data: [DONE]\n\n"


# ------------------------
# 🧾 ROUTE
# ------------------------

@router.post("/chat")
@limiter.limit("5/minute")
async def chat(req: ChatRequest, request: Request):

    session_id = get_session_id(req, request)
    use_history = req.use_history if req.use_history is not None else True

    if not is_safe_prompt(req.message):
        async def fake_stream():
            yield f"data: {json.dumps({'text': 'Blocked'})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(fake_stream(), media_type="text/event-stream")

    # ------------------------
    # 🧠 HISTORY
    # ------------------------
    history = []

    if use_history and session_id:
        # Fetch the history without blocking the main thread
        history = await run_in_threadpool(get_user_history, session_id)

    # Save the user message in the background
    if use_history and session_id:
        await run_in_threadpool(save_to_history, session_id, "user", req.message)

    # ------------------------
    # ⚡ CACHE
    # ------------------------
    cache_key = get_cache_key(f"{session_id}:{req.message}")

    if cache_key in CACHE:
        async def cached_stream():
            yield f"data: {sanitize_output(CACHE[cache_key])}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(cached_stream(), media_type="text/event-stream")

    # ------------------------
    # 🧠 BUILD PROMPT
    # ------------------------
    if settings.use_vector_search:
        try:
            chunks = await run_in_threadpool(search_chunks, req.message, settings.qdrant_top_k)
            extra_context = "\n\n---\n\n".join(chunks) if chunks else await fetch_resume_markdown()
        except Exception as exc:
            logger.warning("Vector search failed, falling back to full resume: %s", exc)
            extra_context = await fetch_resume_markdown()
    else:
        extra_context = await fetch_resume_markdown()

    messages = build_messages(req.message, history, use_history, extra_context=extra_context)

    context_tokens = _context_token_count(messages)
    CONTEXT_STATS["last_context_tokens"] = context_tokens
    if session_id:
        CONTEXT_STATS["per_session"][session_id] = context_tokens

    logger.info({
        "session_id": session_id,
        "use_history": use_history,
        "history_len": len(history),
    })

    return StreamingResponse(
        stream_llama(messages, cache_key, session_id, use_history),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/chat/stats")
async def chat_stats(session_id: Optional[str] = None):
    """Lightweight operational metrics about the running chat stack."""
    memory = psutil.virtual_memory()
    context_tokens = CONTEXT_STATS["last_context_tokens"]
    if session_id:
        context_tokens = CONTEXT_STATS["per_session"].get(session_id, context_tokens)

    return {
        # Use interval=0.0 so the metric collection does not stall the server for 0.1s
        "cpu_percent": psutil.cpu_percent(interval=0.0),
        "memory_percent": memory.percent,
        "memory_used": memory.used,
        "memory_total": memory.total,
        "tokens_per_second": STREAM_STATS["tokens_per_second"],
        "tokens_generated": STREAM_STATS["tokens_generated"],
        "generation_active": STREAM_STATS["active_session_id"] is not None,
        "active_session_id": STREAM_STATS["active_session_id"],
        "context_tokens": context_tokens,
        "llm_model": settings.llm_model,
        "llm_engine": settings.llm_engine,
        "device_name": settings.device_name
    }