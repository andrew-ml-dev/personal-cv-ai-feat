from typing import List, Dict
import re
import time
import logging

import hashlib
import httpx
from config import settings

logger = logging.getLogger("chat_helper")

USER_HISTORY = {}

# ------------------------
# ⚡ CACHE (simple in-memory)
# ------------------------

CACHE = {}

def get_cache_key(message: str) -> str:
    return hashlib.sha256(message.encode()).hexdigest()


# ------------------------
# 📄 RESUME MARKDOWN CACHE
# ------------------------

_resume_cache: Dict[str, object] = {
    "content": "",
    "fetched_at": 0.0,
}


async def fetch_resume_markdown() -> str:
    """Fetch the resume Markdown from the configured URL with in-memory TTL caching.

    Returns an empty string when the URL is not configured or the fetch fails,
    so the system prompt degrades gracefully without raising exceptions.
    """
    url = settings.resume_markdown_url
    if not url:
        return ""

    now = time.monotonic()
    age = now - _resume_cache["fetched_at"]  # type: ignore[operator]
    if age < settings.resume_markdown_ttl_seconds and _resume_cache["content"]:
        return _resume_cache["content"]  # type: ignore[return-value]

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            content = response.text
    except Exception as exc:
        logger.warning("Failed to fetch resume markdown from %s: %s", url, exc)
        # Return stale cache if available, otherwise empty string
        return _resume_cache["content"]  # type: ignore[return-value]

    _resume_cache["content"] = content
    _resume_cache["fetched_at"] = now
    logger.info("Resume markdown refreshed (%d chars) from %s", len(content), url)
    return content

def get_session_id(req, request):
    # Priority: frontend value → cookie → new session
    if req.session_id:
        return req.session_id

    return getattr(request.state, "session_id", None)

def get_user_history(session_id: str):
    return USER_HISTORY.get(session_id, [])

def save_to_history(session_id: str, role: str, content: str):
    USER_HISTORY.setdefault(session_id, []).append({
        "role": role,
        "content": content
    })

    # trim history to the most recent entries
    USER_HISTORY[session_id] = USER_HISTORY[session_id][-10:]


# ------------------------
# 🧹 OUTPUT SANITIZER
# ------------------------

def sanitize_output(text: str) -> str:
    # strip potential noise characters
    text = text.replace("\n", "<br>")

    # extend sanitization rules here if needed
    return text


# ------------------------
# 🛡️ PROMPT GUARD
# ------------------------

FORBIDDEN_PATTERNS = [
    r"ignore\s+previous",
    r"forget\s+all",
    r"act\s+as",
    r"system\s+prompt",
    r"developer\s+mode",
    r"jailbreak",
]


def is_safe_prompt(user_text: str) -> bool:
    text = user_text.lower()

    # regex detection
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, text):
            return False

    # length sanity check
    if len(text) > 2000:
        return False

    return True


# ------------------------
# 🧠 HISTORY
# ------------------------

def build_messages(
    user_message: str,
    history: List[Dict],
    use_history: bool,
    extra_context: str = "",
) -> List[Dict]:
    # 1. Keep the system prompt clean - only instructions and role
    messages = [
        {"role": "system", "content": settings.system_prompt},
    ]

    # 2. Append history (if needed)
    if use_history and history:
        messages.extend(history[-10:])

    # 3. Construct the final user message
    if extra_context:
        # Wrap context and query into a single prompt for RAG
        final_user_content = (
            f"Context information is below:\n"
            f"<context>\n"
            f"{extra_context}\n"
            f"</context>\n\n"
            f"Given the context information and no prior knowledge, answer the query.\n"
            f"Query: {user_message}"
        )
    else:
        # Standard dialogue if context is not found/needed
        final_user_content = user_message

    messages.append({"role": "user", "content": final_user_content})

    logger.info("build_messages: %s", messages)

    return messages