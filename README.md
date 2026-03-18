# Andrzej Ludkiewicz CV/ML Engineer 

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Lucide React |
| Backend | Python, FastAPI, SSE streaming |
| Style | Glassmorphism · Neon glows · Dark mode |

---

## Quick Start

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:5173**

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs at **http://localhost:8000**

> The Vite dev server proxies `/api/*` to `localhost:8000` automatically.

---

## Features

- **Sidebar navigation** — click any section to get an instant rich widget response
- **SSE streaming** — type a custom message and watch the AI reply stream word-by-word
- **Component Registry** — scalable `WidgetRegistry` maps message types to React components
- **Rich widgets:**
  - `TextBubble` — markdown-lite formatted chat bubbles (user & bot)
  - `StackWidget` — colour-coded skill grid with neon tag borders
  - `ExperienceLogWidget` — animated timeline with glowing nodes
  - `ProjectVisionWidget` — CV detection demo with live bounding box simulation
  - `ContactWidget` — styled contact links with icons
- **Top bar** — live metrics (FPS, latency) simulating a real edge deployment
- **Typing indicator** — animated dots while the bot is "thinking"

---

## Project Structure

```
example/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── data/mockData.js          ← all mock content & nav config
│       ├── hooks/useChat.js          ← chat state + SSE streaming logic
│       └── components/
│           ├── Sidebar.jsx
│           ├── TopBar.jsx
│           ├── ChatFeed.jsx
│           ├── InputBar.jsx
│           ├── TypingIndicator.jsx
│           └── widgets/
│               ├── WidgetRegistry.jsx
│               ├── TextBubble.jsx
│               ├── StackWidget.jsx
│               ├── ExperienceLogWidget.jsx
│               ├── ProjectVisionWidget.jsx
│               └── ContactWidget.jsx
└── backend/
    ├── main.py                       ← FastAPI app with SSE endpoint
    └── requirements.txt
```

---

## Customisation

- **Personal info** — edit `frontend/src/data/mockData.js`
- **Add a new widget** — create the component and register it in `WidgetRegistry.jsx`
- **Add a nav section** — append an entry to `NAV_ITEMS` in `mockData.js`
- **Swap backend LLM** — replace `pick_response()` in `backend/main.py` with a real LLM call
