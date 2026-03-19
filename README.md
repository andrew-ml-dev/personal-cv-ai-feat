# CV Portfolio

This is a full-stack portfolio application that features an interactive AI chatbot representing the portfolio owner's persona (Andrew). The system includes a React frontend, a FastAPI backend, and an integrated local LLM powered by `llama.cpp`.

## Tech Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | Python, FastAPI, SSE streaming |
| **LLM Engine**| `llama.cpp` using a quantised GGUF model |
| **Proxy**     | Caddy (for Docker deployments) |

---

## How to Run

There are two primary ways to run the application: using Docker (recommended for full deployment) or running the services independently locally (recommended for development).

### 1. Running with Docker Compose (Full Stack)

This will spin up the `llama-engine`, `backend`, `frontend`, and a `caddy` proxy server.

1. Ensure Docker and Docker Compose are installed.
2. Ensure you have the required model file placed at `./models/model.gguf`.
3. Run the stack from the root directory:
   ```bash
   docker-compose up -d --build
   ```

The application will be accessible via **http://localhost** (Caddy proxy) and will route frontend and backend API requests automatically.

### 2. Running Locally (Development)

You can run the frontend and backend servers separately for development purposes. You typically still need an LLM endpoint running for the backend to connect to.

#### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Set up a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend API will run at **http://localhost:8000**.

#### Frontend
1. In a new terminal, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at **http://localhost:5173**. *Note: Vite is configured to automatically proxy `/api/*` requests to `http://localhost:8000`.*

---

## Project Structure

```
cv_portfolio/
├── frontend/             ← React application powered by Vite
├── backend/              ← FastAPI service handling LLM logic and guardrails
├── llm/                  ← Dockerfile and configuration for llama-engine
├── models/               ← Directory for storing the GGUF model file
├── Caddyfile             ← Caddy web server configuration
└── docker-compose.yml    ← Compose file orchestrating the entire stack
```

For more details on the individual components, refer to the `README.md` files in the `frontend` and `backend` directories.
