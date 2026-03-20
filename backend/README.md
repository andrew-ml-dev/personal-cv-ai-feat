# CV Portfolio API Backend

This FastAPI service acts as a middleware between the frontend application and the local LLM (`llama.cpp`). It proxies user prompts, enforces strict persona guardrails (describing Andrew's background and skills), and provides Server-Sent Events (SSE) streaming. When vector search is enabled, the CV is indexed into a local vector store so the chat can retrieve **relevant excerpts** (RAG) instead of loading the full resume into every request.

## Features

- **Streaming Endpoint (`/api/chat`)**: Handles incoming chat messages, applies blacklists and guardrails, and streams the LLM response chunk by chunk over SSE.
- **CV indexing and semantic search (RAG)**: Markdown CV content is chunked, embedded, and stored in **ChromaDB**; each chat message triggers a similarity search, and matching chunks are passed to the LLM as context. Implemented in `helper/qdrant.py` (the filename is historical—the backend uses ChromaDB and [fastembed](https://qdrant.github.io/fastembed/), not Qdrant server).
- **Index API (`/api/index/*`)**: Optional authenticated endpoints to re-index from a URL or an uploaded UTF-8 file, and to inspect collection size.
- **Health Check (`/api/health`)**: Lightweight endpoint returning current statistics about the engine, model, simulated latency, and FPS.
- **Rate Limiting**: Protects the API from spam, logging IPs and providing graceful error messages on limit hits.
- **Persona Enforcement**: Validates that prompts don't request generic LLM behaviors (like telling jokes or writing recipes) and keeps the conversation strictly on-topic.

## Getting Started Locally

1. Navigate to the `backend` folder.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install the necessary dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server using Uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Configuration

Settings are managed in `config.py` using `pydantic.BaseSettings`. They can be overridden by exporting environment variables or providing a `.env` file in the project root.

| Variable | Description | Default |
| --- | --- | --- |
| `LLAMA_HOST` / `LLAMA_PORT` | The host and port of the LLM engine to proxy requests to. | Used to build `LLAMA_API_URL` |
| `SYSTEM_PROMPT` | The core persona instructions provided to the LLM. | See `config.py` |
| `TEMPERATURE` | Determines the creativity of the generated tokens. | `0.2` |
| `RESPONSE_DELAY_SECONDS` | Artificial delay for typing simulation. | `0.03` |
| `CORS_ALLOW_ORIGINS` | Allowed origins connecting to this API. | `http://localhost:5173,...` |
| `CHROMA_PATH` | Directory where ChromaDB persists vectors and metadata. | `/tmp/chroma_data` |
| `CHROMA_COLLECTION` | Collection name for CV chunks. | `cv_chunks` |
| `EMBEDDING_MODEL` | fastembed model id used for document and query vectors. | `BAAI/bge-small-en-v1.5` |
| `USE_VECTOR_SEARCH` | If `true`, chat retrieves context via `search_chunks`; if `false`, the full CV markdown is fetched and injected instead. | `true` |
| `QDRANT_TOP_K` | Max number of nearest neighbors to retrieve per chat query (passed as `top_k` to `search_chunks`). | `8` |
| `INDEX_API_KEY` | If non-empty, required as `X-Api-Key` for `/api/index/*` routes. | *(empty)* |
| `RESUME_MARKDOWN_URL` | URL of the CV markdown used by startup auto-indexing (see `main.py` lifespan). | *(empty)* |

*(Refer to `config.py` for the exhaustive list of tunable variables and exact env names.)*

## CV indexing and retrieval (`helper/qdrant.py`)

Indexing and search are centralized in `helper/qdrant.py`. The public helpers are:

| Function | Role |
| --- | --- |
| `index_text(text, source="cv")` | Chunk the markdown, compute embeddings, and upsert into ChromaDB. Existing points with the same `source` metadata are removed before insert (replace-on-reindex for that source). Returns the number of chunks stored. |
| `search_chunks(query, top_k=8, max_distance=0.5)` | Embed the query, run a vector query in cosine space, and return **only** chunks whose distance is at or below `max_distance` (in Chroma’s cosine setup, lower distance means a better match). The chat route passes `settings.qdrant_top_k` as `top_k`. |
| `get_collection_count()` | Returns the number of stored chunks in the collection. |

**Pipeline details**

1. **Normalization** (`normalize_text`): Strips emojis, HTML tags, simplifies markdown links to their visible text, and normalizes whitespace. Chunk text is stored in the database **after** this step.
2. **Chunking** (`chunk_markdown`): Splits on paragraph breaks, keeps chunks up to ~600 characters, carries active markdown headers into the next chunk for context, merges very small trailing fragments into the previous chunk, and drops duplicate chunks by content hash.
3. **Embedding input** (`_to_embed`): For vectors only, markdown bullets/headers/syntax are stripped further so embeddings focus on semantic content; **stored documents** remain the chunk text from step 1–2.
4. **Store**: ChromaDB persistent client, collection metadata `hnsw:space: cosine`. Each point has metadata `source` and `chunk_index`.

**How chat uses this**

When `use_vector_search` is true, `routes/chat.py` runs `search_chunks` in a thread pool. If **no** chunks pass the distance threshold, the API responds with a dedicated “not found” stream; otherwise the retrieved chunks are joined and passed as `extra_context` into `build_messages`. If `use_vector_search` is false, behavior falls back to loading the full resume markdown (`fetch_resume_markdown`) for context.

**Startup and manual re-index**

- On app startup, `main.py` can fetch the CV and call `index_text` when `use_vector_search` and `resume_markdown_url` are configured (see `_auto_index_cv`).
- Operators can also call `POST /api/index/url`, `POST /api/index/file`, or `GET /api/index/status` under the `/api` prefix; set `INDEX_API_KEY` to require the `X-Api-Key` header.

## Project Layout

- `main.py`: The entry point for FastAPI. Mounts routers, middleware, rate-limit handlers, and lifespan hooks (including optional CV auto-index).
- `routes/chat.py`: Includes the core `/api/chat` route, RAG context assembly, and streaming functionality.
- `routes/index.py`: Authenticated `/api/index/*` routes for re-indexing and status.
- `routes/health.py`: Contains the `/api/health` status route.
- `helper/qdrant.py`: ChromaDB + fastembed: chunking, indexing, and semantic search.
- `helper/chat.py`: Resume fetch/cache, history, prompt building, and related helpers.
- `config.py`: Centralized configuration loading.
- `models/chat.py`: Pydantic models (e.g., `ChatRequest`) used for payload validation.
- `dependencies.py`: Defines shared instances like the rate limiter.
