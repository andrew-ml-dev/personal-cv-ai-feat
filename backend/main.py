from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes.chat import router as chat_router
from routes.health import router as health_router

import logging

# Suppress spammy log entries from the stats endpoint
class EndpointFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/chat/stats") == -1

# Apply the filter to the Uvicorn access logger
logging.getLogger("uvicorn.access").addFilter(EndpointFilter())

app = FastAPI(title="CV Portfolio API", version="1.0.0")

# Configure CORS for the frontend (React/Vite) connections
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

    uvicorn.run(app, host="0.0.0.0", port=8000)