from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

from config import settings
from routes.chat import router as chat_router
from routes.health import router as health_router

# Initialize Limiter (it will identify users by their IP)
limiter = Limiter(key_func=get_remote_address)

class EndpointFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/chat/stats") == -1

logging.getLogger("uvicorn.access").addFilter(EndpointFilter())

app = FastAPI(title="CV Portfolio API", version="1.0.0")

# Connect Limiter to the application
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(chat_router, prefix="/api")
app.include_router(health_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    # IMPORTANT: proxy_headers=True and forwarded_allow_ips="*" are required to
    # correctly determine the user's real IP address behind Caddy
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        proxy_headers=True, 
        forwarded_allow_ips="*"
    )