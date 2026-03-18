# CV Portfolio API

This FastAPI service proxies user prompts to a llama.cpp edge LLM while applying strict RTS guardrails that describe Andrew’s CV, skills, and real-time electronics background. It exposes a streaming `/api/chat` endpoint tailored for Andrew’s persona and a lightweight `/api/health` check that reports inference goals.

## Getting started

1. Create or activate your virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server locally with auto-reload:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Configuration

All runtime knobs live in `config.py` and are backed by `pydantic.BaseSettings`, so you can override them with environment variables or a `.env` file.

| Variable | Description | Default |
| --- | --- | --- |
| `LLAMA_API_URL` | Endpoint that proxies prompt requests into llama.cpp. | `http://localhost:8080/v1/chat/completions` |
| `SYSTEM_PROMPT` | The strict persona prompt injected into every user request. Spread across multiple lines. | Pre-populated narrative about Andrew’s background (see `config.py`). |
| `TEMPERATURE` | Sampling temperature used when generating tokens | `0.2` |
| `RESPONSE_DELAY_SECONDS` | Artificial delay inserted between SSE tokens to simulate typing. | `0.03` |
| `HTTPX_TIMEOUT_SECONDS` | Timeout for the llama.cpp streaming call. | `120.0` |
| `CORS_ALLOW_ORIGINS` | Comma-separated origins permitted by the CORS middleware. | `http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173` |
| `CORS_ALLOW_METHODS` | Methods available via CORS. | `*` |
| `CORS_ALLOW_HEADERS` | Headers allowed via CORS. | `*` |
| `LLM_ENGINE` | Value returned by `/api/health`. | `llama.cpp` |
| `LLM_MODEL` | Value returned by `/api/health`. | `Llama-3.2-1B-Instruct-Q4_K_M` |
| `DEVICE_NAME` | Device label surfaced by `/api/health`. | `Raspberry Pi 5 / Edge Node` |
| `LATENCY_MS` | Latency goal visible in `/api/health`. | `12` |
| `FPS` | Target FPS surfaced by `/api/health`. | `83` |

You can override any of these values by exporting the variable before launching the server or providing them in a `.env` file located at the project root.

## Project layout

- `main.py` wires FastAPI, loads CORS settings from `config.py`, and mounts routers from `routes/`.
- `routes/chat.py` contains the streaming `/api/chat` router plus the guardrail helpers.
- `routes/health.py` keeps the lightweight `/api/health` check while models live under `models/`.
- `config.py` centralizes all environment-driven values via `pydantic.BaseSettings`.
- `models/chat.py` defines the `ChatRequest` schema consumed by the chat router.

## API endpoints

- **POST `/api/chat`**
  - Accepts JSON payload: `{ "message": "<user text>" }`.
  - Validates the message against a blacklist (phrases like `ignore previous`, `recipe`, `tell me a joke`) to enforce the persona scope.
  - Streams JSON tokens via `text/event-stream`; each chunk is sanitized and wrapped as `data: <token>\n\n`.
  - For safety violations, returns a short refusal message instead of forwarding to llama.cpp.

- **GET `/api/health`**
  - Returns static metadata about the edge deployment and inference targets:
    ```json
    {
      "status": "ok",
      "llm_engine": "...",
      "model": "...",
      "device": "...",
      "latency_ms": 12,
      "fps": 83
    }
    ```

## Security notes

- The `is_safe_prompt` helper filters out requests that try to override the persona (e.g., `ignore previous`, `act as`) or request unrelated content (jokes, cooking, recipes).
- The `SYSTEM_PROMPT` enforces Andrew’s professional persona and refusal template even when the LLM is streaming tokens.

