# CV Portfolio API Backend

This FastAPI service acts as a middleware between the frontend application and the local LLM (`llama.cpp`). It proxies user prompts, enforces strict persona guardrails (describing Andrew's background and skills), and provides Server-Sent Events (SSE) streaming.

## Features

- **Streaming Endpoint (`/api/chat`)**: Handles incoming chat messages, applies blacklists and guardrails, and streams the LLM response chunk by chunk over SSE.
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

*(Refer to `config.py` for the exhaustive list of tunable variables).*

## Project Layout

- `main.py`: The entry point for FastAPI. Mounts routers, middleware, and rate-limit handlers.
- `routes/chat.py`: Includes the core `/api/chat` route and streaming functionality.
- `routes/health.py`: Contains the `/api/health` status route.
- `config.py`: Centralized configuration loading.
- `models/chat.py`: Pydantic models (e.g., `ChatRequest`) used for payload validation.
- `dependencies.py`: Defines shared instances like the rate limiter.
