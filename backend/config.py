from __future__ import annotations

from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Project-wide configuration loaded from environment variables."""

    cors_allow_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
        ],
        description="Origins allowed to access the API via CORS.",
    )
    cors_allow_methods: List[str] = Field(
        default_factory=lambda: ["*"],
        description="Allowed HTTP methods for CORS.",
    )
    cors_allow_headers: List[str] = Field(
        default_factory=lambda: ["*"],
        description="Allowed headers for CORS.",
    )
    llama_host: str = Field(
        "localhost",
        description="Hostname for the llama.cpp HTTP service.",
    )
    llama_port: int = Field(
        8090,
        description="Port for the llama.cpp HTTP service.",
    )
    llama_api_path: str = Field(
        "/v1/chat/completions",
        description="Relative path for streaming completions.",
    )
    system_prompt: str = Field(
        """You are the digital AI avatar of Andrew, a Computer Vision & Machine Learning Engineer. """,
        description="The strict system prompt injected into llama.cpp requests.",
    )
    resume_markdown_url: str = Field(
        "",
        description=(
            "URL to a raw Markdown file (e.g. raw.githubusercontent.com) whose content "
            "is appended to system_prompt at runtime. Leave empty to disable. "
            "The file is fetched once and cached for resume_markdown_ttl_seconds."
        ),
    )
    resume_markdown_ttl_seconds: int = Field(
        600,
        description="How long (in seconds) the fetched Markdown content is cached before re-fetching.",
    )
    temperature: float = Field(
        0.2,
        description="Temperature used when requesting responses from the LLM.",
    )
    response_delay_seconds: float = Field(
        0.03,
        description="Artificial delay per token to simulate typing in the stream.",
    )
    httpx_timeout_seconds: float = Field(
        120.0,
        description="Timeout used when streaming from the LLM service.",
    )
    llm_engine: str = Field(
        "llama.cpp",
        description="Name of the engine reported back in the health endpoint.",
    )
    llm_model: str = Field(
        "Llama-3.2-1B-Instruct-Q4_K_M",
        description="Model name reported through the health endpoint.",
    )
    device_name: str = Field(
        "Raspberry Pi 5 / Edge Node",
        description="Hardware description returned by the health API.",
    )
    latency_ms: int = Field(
        12,
        description="Target latency reported in the health API.",
    )
    fps: int = Field(
        83,
        description="Target inference rate reported in the health API.",
    )

    # ---------------------------------------------------------
    # ChromaDB / Vector Search
    # ---------------------------------------------------------
    chroma_path: str = Field(
        "/tmp/chroma_data",
        description="Directory where ChromaDB persists its data.",
    )
    chroma_collection: str = Field(
        "cv_chunks",
        description="Name of the ChromaDB collection used for CV chunks.",
    )
    qdrant_top_k: int = Field(
        4,
        description="Number of relevant chunks to retrieve per query.",
    )
    embedding_model: str = Field(
        "BAAI/bge-small-en-v1.5",
        description="fastembed model name used for generating embeddings.",
    )
    use_vector_search: bool = Field(
        True,
        description="When True, uses ChromaDB vector search instead of injecting the full CV.",
    )
    index_api_key: str = Field(
        "",
        description="API key required to call the /index/* endpoints. Leave empty to disable auth.",
    )

    @property
    def llama_api_url(self) -> str:
        return f"http://{self.llama_host}:{self.llama_port}{self.llama_api_path}"

    class Config:
        env_file = ".env"


settings = Settings()
