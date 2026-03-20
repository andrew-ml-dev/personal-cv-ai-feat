import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from dependencies import limiter

from config import settings
from routes.chat import router as chat_router
from routes.health import router as health_router
from routes.index import router as index_router

# Suppress spammy log entries from the stats endpoint
class EndpointFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/chat/stats") == -1

# Apply the filter to the Uvicorn access logger
logging.getLogger("uvicorn.access").addFilter(EndpointFilter())

# Create a custom logger for our application events
logger = logging.getLogger("api_logger")
logger.setLevel(logging.INFO)


# ---------------------------------------------------------
# Startup: auto-index CV into Qdrant if collection is empty
# ---------------------------------------------------------

async def _auto_index_cv() -> None:
    """Index the CV from resume_markdown_url into ChromaDB on first start."""
    if not settings.use_vector_search or not settings.resume_markdown_url:
        return

    try:
        # ENSURE the import points to the correct file with our new ChromaDB code!
        # If your file is named vector_store.py, change helper.qdrant to helper.vector_store
        from helper.qdrant import get_collection_count, index_text
        from helper.chat import fetch_resume_markdown

        existing = await run_in_threadpool(get_collection_count)
        
        # --- DISABLING CHECK FOR DEBUGGING ---
        # if existing > 0:
        #     logger.info("Vector store already has %d chunks — skipping auto-index.", existing)
        #     return
        logger.info("Ignoring existing %d chunks, forcing re-index for debug...", existing)
        # -------------------------------------

        logger.info("Auto-indexing CV from %s …", settings.resume_markdown_url)
        text = await fetch_resume_markdown()
        if text:
            count = await run_in_threadpool(index_text, text, "cv")
            logger.info("Auto-index complete: %d chunks stored.", count)
            
    except Exception as exc:
        logger.warning("Auto-index failed: %s", exc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await _auto_index_cv()
    yield


app = FastAPI(title="CV Portfolio API", version="1.0.0", lifespan=lifespan)

# Attach the limiter to the FastAPI app state so routers can use it
app.state.limiter = limiter


# ---------------------------------------------------------
# 1. Fallback (Custom response when rate limit is exceeded)
# ---------------------------------------------------------
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    ip = get_remote_address(request)
    logger.warning(f"🚨 RATE LIMIT HIT | IP: {ip} | Path: {request.url.path}")
    
    # Return a clean JSON response instead of a raw system error
    return JSONResponse(
        status_code=429,
        content={
            "error": "Too Many Requests",
            "message": "Whoa, that's a lot of messages! 😅 Please wait a minute so the AI can catch its breath, and try again.",
            "details": str(exc)
        }
    )


# ---------------------------------------------------------
# 2. Middleware to log every incoming request and its IP
# ---------------------------------------------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Attempt to get the real IP from Caddy via the X-Forwarded-For header
    client_ip = request.headers.get("X-Forwarded-For")
    
    if not client_ip:
        client_ip = request.client.host if request.client else "Unknown"
    else:
        client_ip = client_ip.split(",")[0].strip()

    # ADDED CHECK HERE: Log incoming request only if it's not a stats request
    if "/chat/stats" not in request.url.path:
        logger.info(f"📥 REQUEST  | IP: {client_ip} | Method: {request.method} | Path: {request.url.path}")

    # Pass the request down the stack to the routers
    response = await call_next(request)

    # Log outgoing response (check was already present here)
    if "/chat/stats" not in request.url.path:
        logger.info(f"📤 RESPONSE | IP: {client_ip} | Status: {response.status_code}")

    return response


# ---------------------------------------------------------
# 3. Configure CORS for frontend connections
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


# ---------------------------------------------------------
# 4. Include Routers
# ---------------------------------------------------------
app.include_router(chat_router, prefix="/api")
app.include_router(health_router, prefix="/api")
app.include_router(index_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    # proxy_headers=True tells Uvicorn to trust X-Forwarded-For headers from Caddy
    # forwarded_allow_ips="*" allows Uvicorn to accept headers from any proxy IP in the Docker network
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        proxy_headers=True, 
        forwarded_allow_ips="*"
    )