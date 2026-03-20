# CV Portfolio Frontend

This is the frontend component of the CV Portfolio, built with React, Vite, and Tailwind CSS. It features a modern, interactive chat interface providing real-time AI responses using Server-Sent Events (SSE) streaming.

## Features

- **Modern UI**: Implements a dark mode aesthetic with glassmorphism and neon glows.
- **Interactive Chat**: A dynamic feed that displays messages with a typing indicator and streams responses from the AI.
- **Widgets System**: A scalable `WidgetRegistry` mapping specialized UI components to message types. Available widgets include:
  - `TextBubble`: Formatted chat bubbles.
  - `StackWidget`: Colour-coded grid of technical skills.
  - `ExperienceLogWidget`: Animated experience timeline.
  - `ProjectVisionWidget`: Visual demo component.
  - `ContactWidget`: Curated contact links layout.
- **Vite Proxy**: Pre-configured resolving of `/api/*` requests to the local backend during development.

## Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React

## Getting Started Locally

1. Make sure you have Node.js and `npm` installed.
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Copy `example.env` to `.env` if you do not have one yet, then start the dev server. Open **http://localhost:5173** (or the port set in `VITE_DEV_SERVER_PORT`). `/api/*` is proxied to `VITE_DEV_PROXY_TARGET` (default `http://localhost:8000`).

## Building for Production

To create a production-ready bundle, run:
```bash
npm run build
```
This command compiles the React application into the `dist/` directory, which can then be served by Nginx, Caddy, or any other web server (as used in the project's Docker setup).

## Project Structure

```
frontend/
├── index.html                  ← Main HTML entry
├── vite.config.js              ← Vite build and proxy settings
├── tailwind.config.js          ← Tailwind theme definitions
├── src/
│   ├── main.jsx                ← React root
│   ├── App.jsx                 ← Main application layout
│   ├── index.css               ← Global styles
│   ├── data/
│   │   └── mockData.js         ← Menu configuration and static widget data
│   ├── hooks/
│   │   └── useChat.js          ← State logic and SSE streaming implementation
│   └── components/
│       ├── Sidebar.jsx         ← Navigation sidebar
│       ├── ChatFeed.jsx        ← Renders the message history
│       ├── InputBar.jsx        ← Message input component
│       └── widgets/            ← Component registry and specific widget UI
```

## Configuration (`.env`)

Portfolio copy, URLs, API paths, and diagram labels are driven by **`VITE_*` variables**. See **`example.env`** for the full list and defaults.

- Shared API helpers: `src/config/env.js` (`VITE_BACKEND_URL`, `VITE_CHAT_PATH`, stats polling, architecture diagram strings).
- Identity, sidebar, about/welcome: `src/config/profile.js`
- Contact block: `src/config/contact.js`
- Navigation payloads (education, resume, publications): `src/config/nav.js`
- Optional full tech stack JSON: `VITE_TECH_STACK_JSON` in `src/config/stack.js`

`index.html` title and Google Fonts URL are injected at build time from `VITE_HTML_TITLE` and `VITE_GOOGLE_FONTS_CSS` via `vite.config.js`.

## Customisation

- Prefer updating `.env` (from `example.env`) instead of editing source for deploy-specific values.
- Sidebar menu and widget wiring live in `src/config/nav.js` (structure) and related `src/config/*.js` files.
- To add a widget, create a component under `src/components/widgets/` and register it in `WidgetRegistry.jsx`.
